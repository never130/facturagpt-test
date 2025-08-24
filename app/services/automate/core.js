const { Worker } = require('worker_threads');
const { connectDB } = require("../../controllers/utils");
const { filterOutlook } = require("./api/outlook");
const { accessTokenOutlook } = require("./api/outlook");
const path = require('path');
const fs = require('fs');
const axios = require('axios');

const COLORS = {
    RESET: '\x1b[0m',
    BRIGHT: '\x1b[1m',
    DIM: '\x1b[2m',
    RED: '\x1b[31m',
    GREEN: '\x1b[32m',
    YELLOW: '\x1b[33m',
    BLUE: '\x1b[34m',
    MAGENTA: '\x1b[35m',
    CYAN: '\x1b[36m',
    WHITE: '\x1b[37m',
    BG_RED: '\x1b[41m',
    BG_GREEN: '\x1b[42m',
    BG_YELLOW: '\x1b[43m',
    BG_BLUE: '\x1b[44m'
};

const logWithColor = (message, color = COLORS.WHITE, bgColor = '') => {
    console.log(`${bgColor}${color}${message}${COLORS.RESET}`);
};



const outlookPoller = {
    active: false,
    interval: null,
    lastCheck: null,
    checkInterval: 1000000, 
    // checkInterval: 10000, 
    pendingInterval: 90, 
    activeAutomations: new Map(), 

    start: function () {
        if (!this.active) {
            this.active = true;
            this.interval = setInterval(() => this.checkAllAutomations(), this.checkInterval);
            logWithColor(`🚀 Outlook polling system started (checking every ${this.checkInterval / 1000}s)`, COLORS.GREEN);
        }


    },
    reset: async function (id) {
        try {
            const db_doc = await connectDB(`db_${id}_docs`);
            
            const allDocs = await db_doc.find({
                selector: {
                    status: 'pending'
                }
            });

            for (const doc of allDocs.docs) {
                try {
                    await db_doc.destroy(doc._id, doc._rev);
                } catch (deleteError) {
                    console.error(`Error deleting doc ${doc._id}:`, deleteError);
                }
            }   

        } catch (error) {
            console.error(COLORS.RED + "❌ Error resetting automation: " + error.message + COLORS.RESET);
        }
    },

    addAutomation: function (automationId, { automate, tokenGPT, auth }) {
        logWithColor(`\n🔍 Añadiendo automatización (${automate.type}): ${automationId}`, COLORS.CYAN);
        
        if(automate.type == 'Outlook'){
            this.activeAutomations.set(automationId, { automate, tokenGPT, auth });
        }
    },

    checkAllAutomations: async function () {
        const now = Date.now();
        this.lastCheck = now;


        for (const [automationId, config] of this.activeAutomations) {
            try {
                logWithColor(`\n📧 Procesando automatización ${new Date().toISOString()}\n`, COLORS.MAGENTA);
                const files = await filterOutlook(config.automate);
                const userId = config?.automate?.userId;
                const id = userId?.split("_").pop();
                const db_doc = await connectDB(`db_${id}_docs`);
                const accessToken = await accessTokenOutlook(id, config.automate);

                let num = 0;

                for (const file of files) {
                    try {
                        const doc = await db_doc.find({
                            selector: {
                                _id: file.id
                            }
                        });

                        const attachmentResponse = await axios.get(
                            `https://graph.microsoft.com/v1.0/me/messages/${file.messageId}/attachments/${file.id}/$value`,
                            {
                                headers: {
                                    Authorization: `Bearer ${accessToken}`,
                                },
                                responseType: 'arraybuffer'
                            }
                        );

                        
                        const buffer = attachmentResponse.data;
                        file.buffer = Buffer.from(buffer);
                        file.size = buffer.byteLength;

                        if (doc.docs.length > 0) {
                            const existingDoc = doc.docs[0];

                            if (existingDoc.status === 'processed') {
                                logWithColor(`⏭️  File ${file.name} already processed`, COLORS.YELLOW);
                                continue;
                            }

                            const secondsPassed = Math.floor((Date.now() - new Date(existingDoc.statusAt).getTime()) / 1000);

                            if (existingDoc.statusAt && existingDoc.status === 'pending' ) {
                                logWithColor(`⏭️  File ${file.name} is pending but not enough time has passed (${secondsPassed}s)`, COLORS.YELLOW);
                                continue;
                            }

                            try {
                                logWithColor(`⏳ Loading file ${file.name} (${secondsPassed}s)`, COLORS.RED);
                                
                                try {
                                    const updatedDoc = await db_doc.insert({
                                        _id: existingDoc._id,
                                        _rev: existingDoc._rev,
                                        name: file.name,
                                        status: 'pending',
                                        statusAt: new Date().toISOString()
                                    });

                                    num++;
                                    DistributedProcessManager.addTask({
                                        type: 'AUTOMATION',
                                        id: file.id,
                                        name: file.name,
                                        data: {
                                            type: config.automate.type,
                                            userId: userId,
                                            result: file,
                                            tokenGPT: config.tokenGPT,
                                            auth: config.auth,
                                            pageCost: 0.20,
                                            db: {
                                                _id: updatedDoc.id,
                                                _rev: updatedDoc.rev
                                            }
                                        },
                                        priority: {
                                            score: 1,
                                            factors: {
                                                timeInQueue: 0,
                                                taskType: 1,
                                                resourceIntensity: 0.5
                                            }
                                        }
                                    });
                                    logWithColor(`\n✅ File ${file.name} added to queue`, COLORS.GREEN);
                                    
                                } catch (updateError) {
                                    logWithColor(`⚠️ Error updating document for ${file.name}: ${updateError.message}`, COLORS.RED);
                                    continue;
                                }
                            } catch (fileError) {
                                logWithColor(`❌ Error procesando archivo ${file.name} en automatización ${automationId}: ${fileError.message}`, COLORS.RED);
                            }
                        } else {
                            try {
                                const newDoc = await db_doc.insert({
                                    _id: file.id,
                                    name: file.name,
                                    status: 'pending',
                                    statusAt: new Date().toISOString()
                                });

                                num++;
                                DistributedProcessManager.addTask({
                                    type: 'AUTOMATION',
                                    id: file.id,
                                    name: file.name,
                                    data: {
                                        type: config.type,
                                        userId: userId,
                                        result: file,
                                        tokenGPT: config.tokenGPT,
                                        auth: config.auth,
                                        pageCost: 0.20,
                                        db: {
                                            _id: newDoc.id,
                                            _rev: newDoc.rev
                                        }
                                    },
                                    priority: {
                                        score: 1,
                                        factors: {
                                            timeInQueue: 0,
                                            taskType: 1,
                                            resourceIntensity: 0.5
                                        }
                                    }
                                });
                                logWithColor(`\n✅ File ${file.name} added to queue`, COLORS.GREEN);
                            } catch (insertError) {
                                logWithColor(`⚠️ Error creating document for ${file.name}: ${insertError.message}`, COLORS.RED);
                                continue;
                            }
                        }
                    } catch (fileError) {
                        logWithColor(`❌ Error procesando archivo ${file.name} en automatización ${automationId}: ${fileError.message}`, COLORS.RED);
                    }
                }

                logWithColor(`\n📨 Found ${num} new files for automation ${automationId}`, COLORS.GREEN);


            } catch (error) {
                logWithColor(`\n❌ Error checking automation ${automationId}: ${error.message}`, COLORS.RED);
            }
        }
    }
};

const DistributedProcessManager = {
    config: {
        maxMemoryPerProcess: 200, 
        totalServerMemory: 8192,  
        minProcesses: 2,
        maxProcesses: 10,
        processCheckInterval: 5000, 
        memoryThreshold: 0.8, 
    },

    state: {
        activeProcesses: new Map(),
        processQueue: [],
        totalMemoryUsed: 0,
        lastProcessId: 0,
    },

    metrics: {
        processCreationTimes: [],
        processCompletionTimes: [],
        memoryUsageHistory: [],
        queueSizeHistory: [],
    },

    initialize: function () {
        this.startMonitoring();
        this.initializeProcesses();
        logWithColor('🚀 Sistema de Procesamiento Distribuido Iniciado', COLORS.GREEN);
    },

    initializeProcesses: function () {

        const initialProcessCount = this.config.minProcesses;

        logWithColor(`\n🔄 Inicializando ${initialProcessCount} procesos...`, COLORS.CYAN);

        for (let i = 0; i < initialProcessCount; i++) {
            this.createProcess();
        }

        const statusTable = [
            '┌' + '─'.repeat(60) + '┐',
            '│' + ' '.repeat(20) + '📊 ESTADO INICIAL' + ' '.repeat(23) + '│',
            '├' + '─'.repeat(60) + '┤',
            '│ 🔄 Procesos Activos: ' + ' '.repeat(37 - String(this.state.activeProcesses.size).length) + this.state.activeProcesses.size + ' │',
            '│ 💾 Memoria por Proceso: ' + ' '.repeat(32 - String(this.config.maxMemoryPerProcess).length) + this.config.maxMemoryPerProcess + 'MB │',
            '│ 📈 Memoria Total: ' + ' '.repeat(36 - String(this.config.totalServerMemory / 1024).length) + (this.config.totalServerMemory / 1024).toFixed(1) + 'GB │',
            '│ ⏱️  Intervalo de Monitoreo: ' + ' '.repeat(30 - String(this.config.processCheckInterval / 1000).length) + this.config.processCheckInterval / 1000 + 's │',
            '└' + '─'.repeat(60) + '┘'
        ];

        console.log('\n' + COLORS.BRIGHT + COLORS.CYAN + statusTable.join('\n') + COLORS.RESET + '\n');
    },

    createProcess: function () {
        const processId = ++this.state.lastProcessId;

        const process = {
            id: processId,
            queue: [],
            active: true,
            memoryUsage: 0,
            startTime: Date.now(),
            tasksCompleted: 0,
            lastTaskTime: null,
        };

        const worker = new Worker(__dirname + '/processWorker.js');
        worker.on('message', (message) => {
            console.log(`📨 Mensaje recibido del worker ${processId}:`, message.type);
            this.handleWorkerMessage(processId, message);
        });
        worker.on('error', (error) => {
            console.log(`\n❌ Error en worker ${processId}:`, error);
            this.handleWorkerError(processId, error);
        });

        process.worker = worker;
        this.state.activeProcesses.set(processId, process);

        logWithColor(`✨ Procesos activos: ${this.state.activeProcesses.size}`, COLORS.GREEN);

        return processId;
    },

    calculateOptimalBatchSize: function () {
        const availableMemory = this.config.totalServerMemory - this.state.totalMemoryUsed;
        const maxTasks = Math.floor(availableMemory / this.config.maxMemoryPerProcess);
        return Math.min(maxTasks, 10); 
    },

    calculateOptimalDistribution: function (tasks, processes) {
        const distribution = {};

        if (!processes || processes.length === 0) {
            console.log('⚠️ No hay procesos disponibles para distribuir tareas');
            return distribution;
        }

        processes.forEach(process => {
            if (!process.id) {
                console.log('⚠️ Proceso sin ID encontrado:', process);
                return;
            }
            distribution[process.id] = [];
        });

        tasks.forEach(task => {
            const leastLoadedProcess = processes.reduce((min, current) =>
                (current.queue.length < min.queue.length) ? current : min
            );

            if (leastLoadedProcess && leastLoadedProcess.id) {
                distribution[leastLoadedProcess.id].push(task);
            }
        });

        return distribution;
    },

    distributeTasks: function () {
        
        const availableProcesses = Array.from(this.state.activeProcesses.values())
        .filter(p => p.queue.length < 5);
        
        console.log(`\n🔄 Iniciando distribución de ${this.state.processQueue.length} tareas | ⚡Activos: ${this.state.activeProcesses.size} | ⚡Disponibles: ${availableProcesses.length}`);

        if (availableProcesses.length === 0) {
            if (this.state.activeProcesses.size < this.config.maxProcesses) {
                console.log('⚠️ No hay procesos disponibles, creando nuevo proceso...');
                this.createProcess();
                return;
            } else {
                console.log('⚠️ No hay procesos disponibles y no se pueden crear más');
                return;
            }
        }

        const tasks = this.state.processQueue.splice(0, this.calculateOptimalBatchSize());

        if (tasks.length === 0) {
            console.log('ℹ️ No hay tareas para distribuir');
            return;
        }

        const distribution = this.calculateOptimalDistribution(tasks, availableProcesses);

        for (const [pid, processTasks] of Object.entries(distribution)) {
            if (processTasks.length === 0) continue;

            const process = this.state.activeProcesses.get(parseInt(pid));
            if (!process) {
                console.log(`⚠️ Proceso ${pid} no encontrado en activeProcesses`);
                console.log('Procesos disponibles:', Array.from(this.state.activeProcesses.keys()));
                continue;
            }

            console.log(`\n📥 Añadiendo ${processTasks.length} tareas al proceso ${pid}:`);
            processTasks.forEach(task => {
                console.log(` - ${task.name}`);
            });

            process.queue.push(...processTasks);
            process.worker.postMessage({
                type: 'NEW_TASKS',
                tasks: processTasks
            });
        }
    },

    startMonitoring: function () {
        setInterval(() => {
            this.collectMetrics();
        }, this.config.processCheckInterval);
    },

    collectMetrics: function () {
        const currentMetrics = {
            timestamp: Date.now(),
            activeProcesses: this.state.activeProcesses.size,
            totalMemoryUsed: this.state.totalMemoryUsed,
            queueSize: this.state.processQueue.length,
            averageProcessLoad: this.calculateAverageProcessLoad(),
        };

        this.metrics.memoryUsageHistory.push(currentMetrics);
    },

    getLatestMetrics: function () {
        if (this.metrics.memoryUsageHistory.length === 0) {
            return {
                averageProcessLoad: 0,
                totalMemoryUsed: 0,
                queueSize: 0,
                activeProcesses: 0
            };
        }
        return this.metrics.memoryUsageHistory[this.metrics.memoryUsageHistory.length - 1];
    },

    analyzeMetrics: function () {
        const metrics = this.getLatestMetrics();

        const metricsTable = [
            '┌' + '─'.repeat(60) + '┐',
            '│' + ' '.repeat(20) + '📊 MÉTRICAS DEL SISTEMA' + ' '.repeat(20) + '│',
            '├' + '─'.repeat(60) + '┤',
            '│' + ' '.repeat(60) + '│',
            '│ 🔄 Procesos Activos: ' + ' '.repeat(35 - String(metrics.activeProcesses).length) + metrics.activeProcesses + ' │',
            '│ 📦 Tamaño de Cola: ' + ' '.repeat(35 - String(metrics.queueSize).length) + metrics.queueSize + ' │',
            '│ 💾 Memoria en Uso: ' + ' '.repeat(35 - String((metrics.totalMemoryUsed / 1024).toFixed(2)).length) + (metrics.totalMemoryUsed / 1024).toFixed(2) + 'GB │',
            '│ 📈 Carga Promedio: ' + ' '.repeat(35 - String((metrics.averageProcessLoad * 100).toFixed(1)).length) + (metrics.averageProcessLoad * 100).toFixed(1) + '% │',
            '│' + ' '.repeat(60) + '│',
            '└' + '─'.repeat(60) + '┘'
        ];

        console.log('\n' + COLORS.BRIGHT + COLORS.CYAN + metricsTable.join('\n') + COLORS.RESET + '\n');
    },

    calculateAverageProcessLoad: function () {
        const processes = Array.from(this.state.activeProcesses.values());
        if (processes.length === 0) return 0;

        const totalLoad = processes.reduce((sum, p) => sum + p.queue.length, 0);
        return totalLoad / (processes.length * 5); 
    },

    optimizeProcesses: function () {
        const metrics = this.getLatestMetrics();

        if (metrics.averageProcessLoad > 0.8 && this.state.activeProcesses.size < this.config.maxProcesses) {
            this.createProcess();
        } else if (metrics.averageProcessLoad < 0.2 && this.state.activeProcesses.size > this.config.minProcesses) {
            this.terminateLeastLoadedProcess();
        }
    },

    handleWorkerMessage: function (processId, message) {
        const process = this.state.activeProcesses.get(processId);
        if (!process) {
            console.log(`⚠️ No se encontró el proceso ${processId} para manejar mensaje`);
            return;
        }

        switch (message.type) {
            case 'TASK_COMPLETED':
                process.tasksCompleted++;
                process.lastTaskTime = Date.now();

                if (message.metrics) {
                    console.log(`\n${COLORS.GREEN}📊 Datos procesados:${COLORS.RESET}`);
                    if (message.metrics.cost) {
                        console.log('- cost:', message.metrics.cost);
                    }
                    if (message.metrics.processedData) {
                        console.log('- processedData:', message.metrics.processedData);
                    }
                    if (message.metrics.telematel) {
                        console.log('- telematel:', message.metrics.telematel);
                    }
                    if (message.metrics.googleSheets) {
                        console.log('- googleSheets:', message.metrics.googleSheets);
                    }
                }

                this.updateProcessMetrics(processId, message.metrics);
                logWithColor(`✅ Tarea completada en proceso ${processId}`, COLORS.GREEN);
                break;

            case 'MEMORY_UPDATE':
                this.updateProcessMemory(processId, message.memoryUsage);
                break;

            case 'ERROR':
                this.handleProcessError(processId, message.error);
                break;
        }
    },

    updateProcessMetrics: function (processId, metrics) {
        const process = this.state.activeProcesses.get(processId);
        if (!process) {
            console.log(`⚠️ No se encontró el proceso ${processId} para actualizar métricas`);
            return;
        }

        process.metrics = {
            ...process.metrics,
            ...metrics,
            lastUpdate: Date.now()
        };

        this.metrics.processCompletionTimes.push({
            processId,
            timestamp: Date.now(),
            taskCount: process.tasksCompleted
        });

        if (this.metrics.processCompletionTimes.length > 1000) {
            this.metrics.processCompletionTimes.shift();
        }

        const recentMetrics = this.metrics.processCompletionTimes.filter(
            m => m.processId === processId &&
                Date.now() - m.timestamp < 60000 
        );

        if (recentMetrics.length > 0) {
            const tasksPerMinute = recentMetrics.length;
            console.log(`\n📊 Métricas del proceso ${processId} (Tareas/minuto: ${tasksPerMinute}):`);
            console.log(`- Tareas completadas: ${process.tasksCompleted}`);
        }
    },

    updateProcessMemory: function (processId, memoryUsage) {
        const process = this.state.activeProcesses.get(processId);
        const oldMemory = process.memoryUsage;
        process.memoryUsage = memoryUsage;
        this.state.totalMemoryUsed = this.state.totalMemoryUsed - oldMemory + memoryUsage;
    },

    handleProcessError: function (processId, error) {
        logWithColor(`❌ Error en proceso ${processId}: ${error}`, COLORS.RED);
    },

    terminateLeastLoadedProcess: function () {
        const processes = Array.from(this.state.activeProcesses.values());
        const leastLoaded = processes.sort((a, b) => a.queue.length - b.queue.length)[0];

        if (leastLoaded && leastLoaded.queue.length === 0) {
            leastLoaded.worker.terminate();
            this.state.activeProcesses.delete(leastLoaded.id);
            logWithColor(`🛑 Proceso ${leastLoaded.id} terminado por baja carga`, COLORS.YELLOW);

            this.analyzeMetrics();
        }
    },

    addTask: function (task) {
        const taskInfo = [
            `📥 ${task.name}`,
            `📊 ${this.state.processQueue.length} en cola`,
            `⚡ ${this.state.activeProcesses.size} procesos`
        ].join(' | ');

        logWithColor(`\n${taskInfo}`, COLORS.BLUE);

        this.state.processQueue.push(task);
        this.distributeTasks();

        logWithColor(
            `\n📊 Estado actual (Cola: ${this.state.processQueue.length}, ` +
            `Procesos: ${this.state.activeProcesses.size}, ` +
            `Memoria: ${(this.state.totalMemoryUsed / 1024).toFixed(2)}GB)`,
            COLORS.BLUE
        );
    }
};



DistributedProcessManager.initialize();
outlookPoller.start();



global.automationValidActive = false
global.automationValidActiveTime = null
global.automationValidJob = null




const validAutomate = async () => {
    try {
        if (!global.automationValidActive) {
            global.automationValidActive = true;
            global.automationValidActiveTime = new Date().toISOString();

            const dbAutomations = await connectDB(`db_automations`);

            try {
                const BATCH_SIZE = 1000;
                let automates = [];
                let lastId = null;
                let hasMore = true;

                while (hasMore) {
                    const query = {
                        selector: {
                            type: { $in: ['Outlook'] },
                        },
                        fields: ['_id', 'selectedEmailConnection', 'userId', 'filesArrayKeyWords', 'type'],
                        limit: BATCH_SIZE
                    };

                    if (lastId) {
                        query.selector._id = { $gt: lastId };
                    }

                    const batch = await dbAutomations.find(query);
                    if (batch.docs.length > 0) {
                        automates = automates.concat(batch.docs);
                        lastId = batch.docs[batch.docs.length - 1]._id;
                        hasMore = batch.docs.length === BATCH_SIZE;
                    } else {
                        hasMore = false;
                    }
                }

                if (!automates.length) {
                    console.log('ℹ️  No automations to process.', COLORS.YELLOW);
                    return;
                }

                let configTable = [
                    '┌' + '─'.repeat(50) + '┐',
                    '│' + ' '.repeat(15) + '🚀 SYSTEM CONFIGURATION' + ' '.repeat(12) + '│',
                    '├' + '─'.repeat(50) + '┤',
                    '│ 📊 Total Automations: ' + ' '.repeat(26 - String(automates.length).length) + automates.length + ' │',
                    '│ ⏱️  Polling Interval: ' + ' '.repeat(26 - String(outlookPoller.checkInterval / 1000).length) + outlookPoller.checkInterval / 1000 + 's │',
                    '│ 🔄 Batch Size: ' + ' '.repeat(33 - String(BATCH_SIZE).length) + BATCH_SIZE + ' │',
                    '└' + '─'.repeat(50) + '┘'
                ];

                console.log('\n' + COLORS.BRIGHT + COLORS.CYAN + configTable.join('\n') + COLORS.RESET + '\n');

                let processed = 0;
                let users = {}

                for (const automate of automates) {
                    try {
                        const id = automate?.userId?.split("_").pop();
                        const dbAuth = await connectDB(`db_${id}_auth`);
                        const dbAccounts = await connectDB(`db_accounts`);


                        let user = await dbAccounts.find({
                            selector: {
                                _id: automate.userId,
                                tokenGPT: { $exists: true }
                            },
                            fields: ['tokenGPT']
                        });

                        if (!user.docs.length) {
                            console.log(`⚠️ Usuario sin token GPT: ${automate.userId}`);
                            processed++;
                            continue;
                        }
                        
                        user = user.docs[0];
                        
                        if(!users[automate.userId]){
                            logWithColor(`\n👤 New user detected: ${automate.userId}`, COLORS.BRIGHT + COLORS.GREEN);
                            users[automate.userId] = true;

                            outlookPoller.reset(id);
                        }

                        let auth = null;
                        let tokenGPT = user.tokenGPT;

                        if (automate.selectedEmailConnection) {
                            auth = await dbAuth.find({
                                selector: {
                                    userId: id,
                                    type: { $in: ['Telematel'] },
                                },
                                fields: ['j_username', 'j_password', 'host', 'port'],
                                limit: 1
                            });

                            if (!auth.docs.length) {
                                console.log(`⚠️ Usuario sin autenticación Telematel: ${automate.userId}`);
                                processed++;
                                continue;
                            }
                            auth = auth.docs[0];
                        }

                        outlookPoller.addAutomation(automate._id, {
                            automate,
                            tokenGPT,
                            auth,
                        });


                        processed++;
                    } catch (error) {
                        console.error(`\n${COLORS.RED}❌ Error setting up automation ${automate._id}: ${error.message}${COLORS.RESET}`);
                    }
                }

                console.log('\n' + COLORS.GREEN + '✨ All automations set up for polling.' + COLORS.RESET + '\n');

            } catch (error) {
                console.error(COLORS.RED + '❌ Error in automation setup: ' + error.message + COLORS.RESET);
                global.automationValidActive = false;
            }

            return {
                success: true,
                message: "Automations set up for polling",
            };

        } else {
            if (global.automationValidJob) {
                global.automationValidJob.cancel();
                global.automationValidJob = null;
            }

            return {
                success: true,
                message: "Already active automate",
                time: global.automationActiveTime
            };
        }

    } catch (error) {
        console.log(COLORS.RED + "❌ Error automation: " + error.message + COLORS.RESET);
        return {
            success: false,
            message: "Error validating automate",
        };
    }
};


const getStatsPolling = async (req, res) => {
    try {
       
        const metrics = {
            totalTasks: 0,
            activeProcesses: 0,
            averageLoad: 0,
            performance: {}
        };

        
        if (global.processManager && global.processManager.state) {
            const processes = Array.from(global.processManager.state.activeProcesses.values());
            metrics.activeProcesses = processes.length;

            
            metrics.totalTasks = processes.reduce((sum, p) => sum + p.tasksCompleted, 0);
            metrics.averageLoad = processes.reduce((sum, p) => sum + p.queue.length, 0) /
                (processes.length * 5 || 1); 

            
            const totalMemoryUsage = processes.reduce((sum, p) => sum + (p.memoryUsage || 0), 0);
            const totalUptime = processes.reduce((sum, p) => sum + (Date.now() - p.startTime), 0);
            const totalQueueLength = processes.reduce((sum, p) => sum + p.queue.length, 0);
            
            
            const memoryScore = Math.max(0, 30 - (totalMemoryUsage / (metrics.activeProcesses * 200)) * 30);
            

            const uptimeScore = Math.min(30, (totalUptime / (metrics.activeProcesses * 3600000)) * 30);
            
            
            const queueEfficiency = Math.max(0, 40 - (totalQueueLength / (metrics.activeProcesses * 5)) * 40);
            
            metrics.performance = Math.round(memoryScore + uptimeScore + queueEfficiency);
        }

        console.log("metrics", metrics);

        return res.status(200).json({
            success: true,
            metrics
        });

    } catch (error) {
        console.error(COLORS.RED + "❌ Error getting performance metrics: " + error.message + COLORS.RESET);
        return res.status(500).json({
            success: false,
            message: "Error retrieving performance metrics",
            error: error.message
        });
    }
};


module.exports = {
    validAutomate,
    getStatsPolling
}

