// Motor de ejecución para flujos de testing
export class FlowEngine {
  constructor() {
    this.context = {};
    this.executionLog = [];
    this.currentNode = null;
    this.visitedNodes = new Set();
  }

  // Ejecutar un nodo específico
  async executeNode(node, inputData = {}) {
    if (!node) return null;

    this.currentNode = node;
    this.visitedNodes.add(node.id);
    
    const logEntry = {
      timestamp: new Date(),
      nodeId: node.id,
      nodeType: node.type,
      nodeTitle: node.data?.title || 'Sin título',
      input: inputData,
      output: null,
      result: null,
      error: null
    };

    try {
      let result = null;

      switch (node.type) {
        case 'operator':
          result = await this.executeOperator(node, inputData);
          break;
        case 'response':
          result = await this.executeResponse(node, inputData);
          break;
        case 'operation':
          result = await this.executeOperation(node, inputData);
          break;
        case 'control':
          result = await this.executeControl(node, inputData);
          break;
        case 'comparison':
          result = await this.executeComparison(node, inputData);
          break;
        default:
          result = { success: true, data: inputData };
      }

      logEntry.output = result;
      logEntry.result = result.success ? 'SUCCESS' : 'FAILED';
      
      if (result.success) {
        this.context[node.id] = result.data;
      }

      this.executionLog.push(logEntry);
      return result;

    } catch (error) {
      logEntry.error = error.message;
      logEntry.result = 'ERROR';
      this.executionLog.push(logEntry);
      return { success: false, error: error.message };
    }
  }

  // Ejecutar operadores de comparación
  async executeOperator(node, inputData) {
    const operator = node.data;
    const value = inputData.value;
    const compareValue = inputData.compareValue;

    let result = false;

    switch (operator.symbol) {
      case '==':
        result = value == compareValue;
        break;
      case '===':
        result = value === compareValue;
        break;
      case '!=':
        result = value != compareValue;
        break;
      case '>':
        result = value > compareValue;
        break;
      case '<':
        result = value < compareValue;
        break;
      case '>=':
        result = value >= compareValue;
        break;
      case '<=':
        result = value <= compareValue;
        break;
      case 'T':
        result = value === true;
        break;
      case 'F':
        result = value === false;
        break;
      case '∈':
        if (Array.isArray(compareValue)) {
          result = compareValue.includes(value);
        } else {
          result = value >= compareValue[0] && value <= compareValue[1];
        }
        break;
      case '∉':
        if (Array.isArray(compareValue)) {
          result = !compareValue.includes(value);
        } else {
          result = value < compareValue[0] || value > compareValue[1];
        }
        break;
      case '⊃':
        result = String(value).includes(String(compareValue));
        break;
      case '⊅':
        result = !String(value).includes(String(compareValue));
        break;
      case '→':
        result = String(value).startsWith(String(compareValue));
        break;
      case '←':
        result = String(value).endsWith(String(compareValue));
        break;
      default:
        result = false;
    }

    return {
      success: true,
      data: result,
      nextNode: result ? node.data?.trueNode : node.data?.falseNode
    };
  }

  // Ejecutar respuestas
  async executeResponse(node, inputData) {
    const response = node.data;
    let responseText = '';

    switch (response.category) {
      case 'text_response':
        responseText = response.config?.text || 'Respuesta por defecto';
        break;
      case 'ai_response':
        responseText = await this.generateAIResponse(response.config, inputData);
        break;
      case 'context_response':
        responseText = this.getContextValue(response.config, inputData);
        break;
      case 'data_collection':
        responseText = response.config?.question || 'Por favor, proporciona más información';
        break;
      default:
        responseText = 'Respuesta no configurada';
    }

    return {
      success: true,
      data: responseText,
      type: 'response',
      category: response.category
    };
  }

  // Ejecutar operaciones matemáticas
  async executeOperation(node, inputData) {
    const operation = node.data;
    const config = operation.config;
    let result = 0;

    switch (operation.symbol) {
      case '+':
        result = config.operands.reduce((sum, operand) => {
          const value = this.resolveValue(operand, inputData);
          return sum + (Number(value) || 0);
        }, 0);
        break;
      case '-':
        result = config.operands.reduce((diff, operand, index) => {
          const value = this.resolveValue(operand, inputData);
          return index === 0 ? Number(value) || 0 : diff - (Number(value) || 0);
        }, 0);
        break;
      case '×':
        result = config.operands.reduce((product, operand) => {
          const value = this.resolveValue(operand, inputData);
          return product * (Number(value) || 1);
        }, 1);
        break;
      case '÷':
        result = config.operands.reduce((quotient, operand, index) => {
          const value = this.resolveValue(operand, inputData);
          const numValue = Number(value) || 1;
          return index === 0 ? numValue : quotient / numValue;
        }, 1);
        break;
      case '%':
        const dividend = this.resolveValue(config.operands[0], inputData);
        const divisor = this.resolveValue(config.operands[1], inputData);
        result = (Number(dividend) || 0) % (Number(divisor) || 1);
        break;
      case '^':
        const base = this.resolveValue(config.base, inputData);
        const exponent = this.resolveValue(config.exponent, inputData);
        result = Math.pow(Number(base) || 0, Number(exponent) || 1);
        break;
      case '√':
        const operand = this.resolveValue(config.operand, inputData);
        result = Math.sqrt(Number(operand) || 0);
        break;
      case '≈':
        const value = this.resolveValue(config.operand, inputData);
        const decimals = config.decimals || 2;
        result = Math.round((Number(value) || 0) * Math.pow(10, decimals)) / Math.pow(10, decimals);
        break;
      default:
        result = 0;
    }

    // Guardar resultado en variable si está configurada
    if (config.resultVariable) {
      this.context[config.resultVariable] = result;
    }

    return {
      success: true,
      data: result,
      type: 'operation',
      category: operation.category
    };
  }

  // Ejecutar controles de tiempo
  async executeControl(node, inputData) {
    const control = node.data;
    const config = control.config;

    switch (control.category) {
      case 'time':
        return await this.executeTimeControl(control, config, inputData);
      case 'loop':
        return await this.executeLoopControl(control, config, inputData);
      case 'conditional':
        return await this.executeConditionalControl(control, config, inputData);
      default:
        return { success: true, data: null };
    }
  }

  // Ejecutar controles de tiempo
  async executeTimeControl(control, config, inputData) {
    switch (control.symbol) {
      case '⏰':
        const duration = this.resolveValue(config.duration, inputData);
        await this.sleep(duration);
        return { success: true, data: `Esperado ${duration}ms` };
      
      case '📅':
        const days = this.resolveValue(config.days, inputData);
        const businessDays = config.businessDays || false;
        const waitTime = businessDays ? days * 24 * 60 * 60 * 1000 * 0.7 : days * 24 * 60 * 60 * 1000;
        await this.sleep(waitTime);
        return { success: true, data: `Esperado ${days} días` };
      
      case '🎯':
        const targetDate = new Date(config.targetDate);
        const now = new Date();
        const waitUntil = targetDate.getTime() - now.getTime();
        if (waitUntil > 0) {
          await this.sleep(waitUntil);
        }
        return { success: true, data: `Esperado hasta ${targetDate}` };
      
      case '📈':
        const baseDelay = this.resolveValue(config.baseDelay, inputData);
        const maxDelay = this.resolveValue(config.maxDelay, inputData);
        const factor = config.factor || 2;
        const currentDelay = Math.min(baseDelay * Math.pow(factor, this.executionLog.length), maxDelay);
        await this.sleep(currentDelay);
        return { success: true, data: `Esperado ${currentDelay}ms con retraso exponencial` };
      
      default:
        return { success: true, data: null };
    }
  }

  // Ejecutar bucles
  async executeLoopControl(control, config, inputData) {
    switch (control.symbol) {
      case '🔄': // For loop
        const iterations = this.resolveValue(config.iterations, inputData);
        const maxIterations = config.maxIterations || 100;
        const actualIterations = Math.min(iterations, maxIterations);
        
        for (let i = 0; i < actualIterations; i++) {
          this.context['loopIndex'] = i;
          // Aquí se ejecutaría el cuerpo del bucle
          await this.sleep(100); // Pequeña pausa para evitar bloqueo
        }
        return { success: true, data: `Ejecutado ${actualIterations} iteraciones` };
      
      case '⏳': // While loop
        const maxWhileIterations = config.maxIterations || 1000;
        const timeout = config.timeout || 30000;
        const startTime = Date.now();
        let iterations = 0;
        
        while (iterations < maxWhileIterations && (Date.now() - startTime) < timeout) {
          this.context['loopIndex'] = iterations;
          iterations++;
          await this.sleep(100);
        }
        return { success: true, data: `Ejecutado bucle while ${iterations} veces` };
      
      default:
        return { success: true, data: null };
    }
  }

  // Ejecutar controles condicionales
  async executeConditionalControl(control, config, inputData) {
    switch (control.symbol) {
      case '🎯': // IF
        const condition = this.evaluateCondition(config.condition, inputData);
        return {
          success: true,
          data: condition,
          nextNode: condition ? config.trueBranch : config.falseBranch
        };
      
      case '🔄': // IF-ELSE
        const ifCondition = this.evaluateCondition(config.condition, inputData);
        return {
          success: true,
          data: ifCondition,
          nextNode: ifCondition ? config.trueBranch : config.falseBranch
        };
      
      case '🎚️': // SWITCH
        const variable = this.resolveValue(config.variable, inputData);
        const matchingCase = config.cases.find(c => c.value === variable);
        const nextNode = matchingCase ? matchingCase.branch : config.defaultCase;
        return {
          success: true,
          data: variable,
          nextNode: nextNode
        };
      
      default:
        return { success: true, data: null };
    }
  }

  // Ejecutar comparaciones avanzadas
  async executeComparison(node, inputData) {
    const comparison = node.data;
    const config = comparison.config;
    let result = false;

    switch (comparison.symbol) {
      case '🔍': // Comparar texto
        const text1 = String(this.resolveValue(config.operand1, inputData));
        const text2 = String(this.resolveValue(config.operand2, inputData));
        
        if (config.caseSensitive) {
          result = text1 === text2;
        } else {
          result = text1.toLowerCase() === text2.toLowerCase();
        }
        
        if (config.partialMatch) {
          result = text1.includes(text2) || text2.includes(text1);
        }
        break;
      
      case '📅': // Comparar fechas
        const date1 = new Date(this.resolveValue(config.operand1, inputData));
        const date2 = new Date(this.resolveValue(config.operand2, inputData));
        
        switch (config.precision) {
          case 'second':
            result = date1.getTime() === date2.getTime();
            break;
          case 'minute':
            result = Math.floor(date1.getTime() / 60000) === Math.floor(date2.getTime() / 60000);
            break;
          case 'hour':
            result = Math.floor(date1.getTime() / 3600000) === Math.floor(date2.getTime() / 3600000);
            break;
          case 'day':
            result = date1.toDateString() === date2.toDateString();
            break;
          case 'month':
            result = date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth();
            break;
          case 'year':
            result = date1.getFullYear() === date2.getFullYear();
            break;
          default:
            result = date1.getTime() === date2.getTime();
        }
        break;
      
      default:
        result = false;
    }

    return {
      success: true,
      data: result,
      nextNode: result ? node.data?.trueNode : node.data?.falseNode
    };
  }

  // Utilidades
  resolveValue(value, inputData) {
    if (typeof value === 'string' && value.startsWith('$')) {
      const key = value.substring(1);
      return this.context[key] || inputData[key] || null;
    }
    return value;
  }

  evaluateCondition(condition, inputData) {
    try {
      // Evaluar condición simple
      if (typeof condition === 'boolean') return condition;
      if (typeof condition === 'string') {
        // Reemplazar variables en la condición
        let evalCondition = condition;
        Object.keys(this.context).forEach(key => {
          evalCondition = evalCondition.replace(new RegExp(`\\$${key}`, 'g'), JSON.stringify(this.context[key]));
        });
        Object.keys(inputData).forEach(key => {
          evalCondition = evalCondition.replace(new RegExp(`\\$${key}`, 'g'), JSON.stringify(inputData[key]));
        });
        return eval(evalCondition);
      }
      return false;
    } catch (error) {
      console.error('Error evaluating condition:', error);
      return false;
    }
  }

  getContextValue(config, inputData) {
    const key = config.contextKey;
    return this.context[key] || inputData[key] || 'Valor no encontrado';
  }

  async generateAIResponse(config, inputData) {
    // Simulación de respuesta de IA
    const prompt = config.prompt || 'Generar respuesta';
    const context = config.context || '';
    
    // Aquí se integraría con un servicio de IA real
    return `Respuesta de IA basada en: ${prompt} con contexto: ${context}`;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Obtener el log de ejecución
  getExecutionLog() {
    return this.executionLog;
  }

  // Limpiar el contexto y log
  reset() {
    this.context = {};
    this.executionLog = [];
    this.visitedNodes.clear();
    this.currentNode = null;
  }

  // Ejecutar un flujo completo
  async executeFlow(nodes, edges, startNodeId, inputData = {}) {
    this.reset();
    
    let currentNodeId = startNodeId;
    const results = [];

    while (currentNodeId && !this.visitedNodes.has(currentNodeId)) {
      const node = nodes.find(n => n.id === currentNodeId);
      if (!node) break;

      const result = await this.executeNode(node, inputData);
      results.push(result);

      if (!result.success) {
        break;
      }

      // Determinar el siguiente nodo
      if (result.nextNode) {
        currentNodeId = result.nextNode;
      } else {
        // Buscar la siguiente conexión en los edges
        const nextEdge = edges.find(e => e.source === currentNodeId);
        currentNodeId = nextEdge ? nextEdge.target : null;
      }
    }

    return {
      success: results.every(r => r.success),
      results: results,
      log: this.getExecutionLog(),
      finalContext: this.context
    };
  }
} 