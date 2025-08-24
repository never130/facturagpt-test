import React, { useState, useEffect, useRef, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import styles from "./ScrapingContainer.module.css";

import { apiUrl } from '../../../../../../apiBackend';
import { templateSave } from '../../../../../../actions/chat';

const IconPlus = () => <span>+</span>;
const IconTrash = () => <span>🗑️</span>;
const IconEdit = () => <span>✏️</span>;
const IconPlay = () => <span>▶️</span>;
const IconPause = () => <span>⏸️</span>;
const IconEye = () => <span>👁️</span>;
const IconCheck = () => <span>✅</span>;
const IconClose = () => <span>❌</span>;
const IconArrowRight = () => <span>→</span>;
const IconArrowLeft = () => <span>←</span>;
const IconArrowDown = () => <span>↓</span>;

const ScrapingContainer = ({
    messageContainerRef
}) => {

    const [status, onStatusChange] = useState(null);
    const [onTemplateSave, setOnTemplateSave] = useState(null);
    const [initialUrl, setInitialUrl] = useState('');
    const [initialScreenshot, setInitialScreenshot] = useState(null);

    const [currentUrl, setCurrentUrl] = useState(initialUrl);
    const [screenshot, setScreenshot] = useState(initialScreenshot);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const [selectors, setSelectors] = useState([]);
    const [selectedElement, setSelectedElement] = useState(null);
    const [isSelecting, setIsSelecting] = useState(false);

    const [visualSelectionMode, setVisualSelectionMode] = useState(false);
    const [selectedElements, setSelectedElements] = useState([]);
    const [browserPage, setBrowserPage] = useState(null);
    const [pageUrl, setPageUrl] = useState('');
    const [pageInfo, setPageInfo] = useState(null);
    const [favicon, setFavicon] = useState(null);

    const [template, setTemplate] = useState({
        id: uuidv4(),
        name: 'Nuevo Template',
        description: '',
        templates: [],
        variables: {},
        conditions: []
    });

    const [scrapingResults, setScrapingResults] = useState([]);
    const [isExecuting, setIsExecuting] = useState(false);
    const [executionTime, setExecutionTime] = useState(0);

    const screenshotRef = useRef(null);
    const selectorOverlayRef = useRef(null);

    const iframeRef = useRef(null);
    const loadingIframeRef = useRef(null); 

    const LoadingState = () => {
        const [newTemplate, setNewTemplate] = useState({
            name: '',
            url: '',
            description: ''
        });
        const [validationError, setValidationError] = useState('');
        const [isValidating, setIsValidating] = useState(false);

        const validateUrl = (url) => {
            try {
                const urlObj = new URL(url);
                return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
            } catch {
                return false;
            }
        };

        const addTemplate = async () => {
            if (!newTemplate.url.trim()) return;

            if (!validateUrl(newTemplate.url)) {
                setValidationError('Por favor, introduce una URL válida (http:// o https://)');
                return;
            }

            setValidationError('');
            setIsValidating(true);

            const templateStep = {
                id: uuidv4(),
                name: newTemplate.name,
                url: newTemplate.url,
                description: newTemplate.description,
                screenshot: null,
                info: null,
                htmlWithStyles: null,
                interactiveElements: null,
                selectors: []
            };

            setTemplate(prev => {
                const newTemplateState = {
                    ...prev,
                    templates: [...prev.templates, templateStep]
                };

                setTimeout(() => {
                    loadTemplatePage(templateStep);
                }, 0);

                return newTemplateState;
            });

            setNewTemplate({
                name: '',
                url: '',
                description: ''
            });

            setIsValidating(false);
        };



        const removeTemplate = (id) => {
            setTemplate(prev => ({
                ...prev,
                templates: prev.templates.filter(t => t.id !== id)
            }));
        };

        const moveTemplate = (id, direction) => {
            setTemplate(prev => {
                const templates = [...prev.templates];
                const index = templates.findIndex(t => t.id === id);
                if (index === -1) return prev;

                const newIndex = direction === 'up' ? index - 1 : index + 1;
                if (newIndex < 0 || newIndex >= templates.length) return prev;

                [templates[index], templates[newIndex]] = [templates[newIndex], templates[index]];
                return { ...prev, templates };
            });
        };

        const loadTemplatePage = async (templateStep) => {

            if (!templateStep) return;

            setIsLoading(true);
            setLoadingProgress(0);

            const progressInterval = setInterval(() => {
                setLoadingProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(progressInterval);
                        return 90;
                    }
                    return prev + 1;
                });
            }, 200);

            try {
                const user = localStorage.getItem("user");
                const userJson = JSON.parse(user);
                const token = userJson.accessToken;

                const response = await fetch(`${apiUrl}/api/chat/scraping`, {
                    method: "POST",
                    body: JSON.stringify({
                        url: templateStep.url,
                        action: 'loadPage'
                    }),
                    headers: {
                        "Content-Type": "application/octet-stream",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let result = '';

                const processStream = async () => {
                    try {
                        while (true) {
                            const { done, value } = await reader.read();
                            if (done) break;

                            const chunk = decoder.decode(value, { stream: true });
                            result += chunk;

                            let lines = result.split("\n");
                            result = lines.pop();

                            for (const line of lines) {
                                if (line.trim()) {
                                    try {
                                        const chunk = JSON.parse(line);
                                        const { text, type, scrapId, timestamp } = chunk.data;

                                        if (type === 'error') {
                                            console.error('Error from backend:', text);
                                            setIsLoading(false);

                                            setTemplate(prev => ({
                                                ...prev,
                                                templates: prev.templates.filter(t => t.id !== templateStep.id)
                                            }));

                                            alert(`Error al cargar la página: ${text.error || 'Error desconocido'}`);
                                            return;
                                        } else if (text.status === 'ready-info') {
                                            setLoadingProgress(50);

                                            setTemplate(prev => ({
                                                ...prev,
                                                templates: prev.templates.map(t =>
                                                    t.id === templateStep.id
                                                        ? { ...t, info: text.info }
                                                        : t
                                                )
                                            }));

                                        } else if (text.status === 'ready-html') {
                                            setLoadingProgress(75);

                                            if (loadingIframeRef.current && loadingIframeRef.current.contentWindow) {
                                                const doc = loadingIframeRef.current.contentWindow.document;
                                                doc.open();
                                                doc.write(text.htmlWithStyles);
                                                doc.close();
                                            } else {
                                                console.error('Loading iframe not available');
                                            }

                                           
                                            setTemplate(prev => ({
                                                ...prev,
                                                templates: prev.templates.map(t =>
                                                    t.id === templateStep.id
                                                        ? {
                                                            ...t,
                                                            htmlWithStyles: text.htmlWithStyles,
                                                        }
                                                        : t
                                                )
                                            }));

                                        } else if (text.status === 'ready-screenshot') {
                                            setLoadingProgress(100);

                                            if (text.screenshot) {
                                                const screenshotData = `data:image/png;base64,${text.screenshot}`;

                                                setTemplate(prev => ({
                                                    ...prev,
                                                    templates: prev.templates.map(t =>
                                                        t.id === templateStep.id
                                                            ? { ...t, screenshot: screenshotData }
                                                            : t
                                                    )
                                                }));

                                                setTimeout(() => {
                                                    setIsLoading(false);
                                                }, 500);
                                            }
                                        }
                                    } catch (error) {
                                        console.error('Error parsing chunk:', error);
                                    }
                                }
                            }
                        }
                    } catch (error) {
                        console.error('Error in processStream:', error);
                        setIsLoading(false);

                        setTemplate(prev => ({
                            ...prev,
                            templates: prev.templates.filter(t => t.id !== templateStep.id)
                        }));

                        alert(`Error al procesar la respuesta: ${error.message}`);
                    }
                };

                await processStream();
            } catch (error) {
                setIsLoading(false);

                setTemplate(prev => ({
                    ...prev,
                    templates: prev.templates.filter(t => t.id !== templateStep.id)
                }));

                alert(`Error al cargar la página: ${error.message}`);
            }
        };

        return (
            <div className={styles.loadingContainer}>
                {/* <div className={styles.loadingHeader}>
                    <h3>📋 Gestor de Plantillas</h3>
                    <p>Configura las plantillas con sus URLs y pasos de scraping</p>
                </div> */}

                <div className={styles.templatesContainer}>
                    <div className={styles.addTemplateForm}>
                        {/* <h4>Añadir Nueva Plantilla</h4> */}
                        <h4>Plantillas Configuradas ({template.templates.length})</h4>


                        <div className={styles.templateFormRow}>

                            <input
                                type="url"
                                placeholder="https://ejemplo.com"
                                value={newTemplate.url}
                                onChange={(e) => setNewTemplate(prev => ({ ...prev, url: e.target.value }))}
                                className={styles.templateInput}
                            />
                        </div>
                        <button
                            onClick={addTemplate}
                            disabled={!newTemplate.url.trim() || isValidating}
                            className={styles.addTemplateButton}
                        >
                            {isValidating ? (
                                <div className={styles.loadingSpinner}>
                                    <div className={styles.spinner}></div>
                                    Validando...
                                </div>
                            ) : (
                                <>
                                    <IconPlus /> Añadir Plantilla
                                </>
                            )}
                        </button>
                        {validationError && (
                            <p className={styles.validationError}>{validationError}</p>
                        )}
                    </div>

                    <div className={styles.templatesList}>

                        {template.templates.length === 0 ? (
                            <div className={styles.noTemplates}>
                                <p>No hay plantillas configuradas. Añade la primera plantilla para comenzar.</p>
                            </div>
                        ) : (
                            template.templates.map((templateStep, index) => (
                                <div
                                    key={templateStep.id}
                                    className={styles.templateItem}
                                    style={{
                                        animationDelay: `${index * 0.1}s`
                                    }}
                                >
                                    <div className={styles.templateHeader}>
                                        <div className={styles.templateInfo}>
                                            {templateStep.screenshot ? (
                                                <div
                                                    className={styles.templateImageContainer}
                                                    onClick={() => onStatusChange('selector')}
                                                    title="Haz clic para abrir la plantilla"
                                                >
                                                    <img
                                                        src={templateStep.screenshot}
                                                        alt={`Screenshot de ${templateStep.name}`}
                                                        className={styles.templateThumbnail}
                                                    />
                                                    <div className={styles.templateImageOverlay}>
                                                        <IconEye />
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className={styles.templateNumberContainer}>
                                                    <span className={styles.templateNumber}>{index + 1}</span>
                                                    <div className={styles.templateNumberHint}>
                                                        Cargar imagen
                                                    </div>
                                                </div>
                                            )}
                                            <div className={styles.templateDetails}>
                                                <div className={styles.templateTitleRow}>
                                                    <strong>{templateStep.name}</strong>
                                                    {templateStep.screenshot && (
                                                        <span className={styles.screenshotIndicator}>
                                                            <IconCheck /> Screenshot
                                                        </span>
                                                    )}

                                                    <div className={styles.templateActions}>
                                                        {template.templates.length > 1 && (
                                                            <>
                                                                <button
                                                                    onClick={() => moveTemplate(templateStep.id, 'up')}
                                                                    disabled={index === 0}
                                                                    className={styles.moveButton}
                                                                    title="Mover hacia arriba"
                                                                >
                                                                    ↑
                                                                </button>
                                                                <button
                                                                    onClick={() => moveTemplate(templateStep.id, 'down')}
                                                                    disabled={index === template.templates.length - 1}
                                                                    className={styles.moveButton}
                                                                    title="Mover hacia abajo"
                                                                >
                                                                    ↓
                                                                </button>
                                                            </>
                                                        )}
                                                        {/* <button
                                                            onClick={() => loadTemplatePage(templateStep.id)}
                                                            disabled={isLoading}
                                                            className={`${styles.loadTemplateButton} ${isLoading ? styles.loading : ''}`}
                                                            title={templateStep.screenshot ? "Recargar imagen" : "Cargar imagen"}
                                                        >
                                                            {isLoading ? (
                                                                <div className={styles.loadingSpinner}>
                                                                    <div className={styles.spinner}></div>
                                                                    Cargando...
                                                                </div>
                                                            ) : (
                                                                <IconEye />
                                                            )}
                                                        </button> */}
                                                        <button
                                                            onClick={() => removeTemplate(templateStep.id)}
                                                            className={styles.removeTemplateButton}
                                                            title="Eliminar plantilla"
                                                        >
                                                            <IconTrash />
                                                        </button>
                                                    </div>
                                                </div>
                                                <span className={styles.templateUrl}>{templateStep.url}</span>
                                                {templateStep.description && (
                                                    <span className={styles.templateDescription}>{templateStep.description}</span>
                                                )}
                                            </div>

                                        </div>


                                    </div>

                                    <p>
                                        Description

                                    </p>
                                    <div>
                                        icono
                                    </div>

                                    <div className={styles.templateStats}>
                                        <span>🔘 Selectores: {templateStep?.selectors?.length}</span>
                                        <span>🔘 Acciones: {templateStep?.actions?.length}</span>
                                        <span>🔘 Buttons: {templateStep?.actions?.length}</span>
                                        <span>📝 Forms: {templateStep?.actions?.length}</span>
                                        <span>🖼️ Images: {templateStep?.actions?.length}</span>
                                        <span>🔗 Links: {templateStep?.actions?.length}</span>
                                        {/* {templateStep.screenshot && (
                                            <span className={styles.templateStatus}>
                                                <IconCheck /> Imagen cargada
                                            </span>
                                        )} */}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* {template.templates.length > 0 && (
                        <div className={styles.templateActions}>
                            <button
                                onClick={() => onStatusChange('selector')}
                                className={styles.continueButton}
                                disabled={template.templates.length === 0}
                            >
                                Continuar a Selectores <IconArrowRight />
                            </button>
                        </div>
                    )} */}
                </div>

                {isLoading && (
                    <div className={styles.progressContainer}>
                        <div className={styles.progressBar}>
                            <div
                                className={styles.progressFill}
                                style={{ width: `${loadingProgress}%` }}
                            />
                        </div>
                        <span className={styles.progressText}>{loadingProgress}%</span>
                    </div>
                )}

                {/* Iframe oculto para cargar contenido durante el loading */}
                <iframe
                    ref={loadingIframeRef}
                    style={{ display: 'none' }}
                    title="Loading iframe"
                />
            </div>
        );
    };

    const SelectorState = () => {
        const [currentTemplateIndex, setCurrentTemplateIndex] = useState(0);
        const [viewMode, setViewMode] = useState('screenshot'); 
        const [newSelector, setNewSelector] = useState({
            name: '',
            selector: '',
            prompt: '',
            type: 'text'
        });

        const currentTemplate = template.templates[currentTemplateIndex];

        const handleElementSelect = useCallback((event) => {
            if (!isSelecting) return;

            event.preventDefault();
            event.stopPropagation();

            const element = event.target;
            const rect = element.getBoundingClientRect();
            const selector = generateSelector(element);

            setSelectedElement({
                element,
                rect,
                selector,
                name: `Elemento ${currentTemplate.selectors.length + 1}`
            });

            setIsSelecting(false);
        }, [isSelecting, currentTemplate]);

        const generateSelector = (element) => {
            if (element.id) {
                return `#${element.id}`;
            }

            if (element.className) {
                const classes = element.className.split(' ').filter(c => c.trim());
                if (classes.length > 0) {
                    return `.${classes[0]}`;
                }
            }

            return element.tagName.toLowerCase();
        };

        const addSelector = () => {
            if (!selectedElement || !newSelector.name.trim()) return;

            const selector = {
                id: uuidv4(),
                name: newSelector.name,
                selector: selectedElement.selector,
                prompt: newSelector.prompt,
                type: newSelector.type,
                position: {
                    x: selectedElement.rect.x,
                    y: selectedElement.rect.y,
                    width: selectedElement.rect.width,
                    height: selectedElement.rect.height
                }
            };

            setTemplate(prev => ({
                ...prev,
                templates: prev.templates.map((t, index) =>
                    index === currentTemplateIndex
                        ? { ...t, selectors: [...t.selectors, selector] }
                        : t
                )
            }));

            setSelectedElement(null);
            setNewSelector({
                name: '',
                selector: '',
                prompt: '',
                type: 'text'
            });
        };

        const removeSelector = (selectorId) => {
            setTemplate(prev => ({
                ...prev,
                templates: prev.templates.map((t, index) =>
                    index === currentTemplateIndex
                        ? { ...t, selectors: t.selectors.filter(s => s.id !== selectorId) }
                        : t
                )
            }));
        };

        const startSelection = () => {
            setIsSelecting(true);
        };

        const nextTemplate = () => {
            if (currentTemplateIndex < template.templates.length - 1) {
                setCurrentTemplateIndex(currentTemplateIndex + 1);
                setSelectedElement(null);
            }
        };

        const prevTemplate = () => {
            if (currentTemplateIndex > 0) {
                setCurrentTemplateIndex(currentTemplateIndex - 1);
                setSelectedElement(null);
            }
        };

        if (!currentTemplate) {
            return (
                <div className={styles.selectorContainer}>
                    <div className={styles.errorContainer}>
                        <h3>❌ No hay plantillas configuradas</h3>
                        <p>Vuelve al paso anterior para configurar las plantillas.</p>
                        <button onClick={() => onStatusChange('loading')}>
                            Volver a Plantillas
                        </button>
                    </div>
                </div>
            );
        }

        return (
            <div className={styles.selectorContainer}>
                <div className={styles.selectorContent}>
                    <div className={styles.templateNavigation}>
                        <div className={styles.templateProgress}>
                            <span>Plantilla {currentTemplateIndex + 1} de {template.templates.length}</span>
                            {/* <strong>{currentTemplate.name}</strong> */}
                            <strong>Selectores de {currentTemplate.name} ({currentTemplate.selectors.length})</strong>
                        </div>
                        {template.templates.length > 1 && (
                            <div className={styles.navigationButtons}>
                                <button
                                    onClick={prevTemplate}
                                    disabled={currentTemplateIndex === 0}
                                    className={styles.navButton}
                                >
                                    ←
                                </button>
                                <button
                                    onClick={nextTemplate}
                                    disabled={currentTemplateIndex === template.templates.length - 1}
                                    className={styles.navButton}
                                >
                                    →
                                </button>
                            </div>
                        )}
                    </div>

                    <div className={styles.selectionButtons}>
                        <button
                            onClick={() => onStatusChange('loading')}
                            className={styles.backToTemplatesButton}
                            title="Volver a Plantillas"
                        >
                            <IconArrowLeft />
                        </button>

                        {/* Botones de cambio de vista */}
                        <div className={styles.viewModeButtons}>
                            <button
                                onClick={() => setViewMode('screenshot')}
                                className={`${styles.viewModeButton} ${viewMode === 'screenshot' ? styles.active : ''}`}
                                title="Vista de Captura de Pantalla"
                            >
                                📸 Captura
                            </button>
                            <button
                                onClick={() => setViewMode('html')}
                                className={`${styles.viewModeButton} ${viewMode === 'html' ? styles.active : ''}`}
                                title="Vista HTML Renderizado"
                            >
                                🎨 HTML
                            </button>
                        </div>

                        <button
                            onClick={startSelection}
                            className={`${styles.selectionButton} ${isSelecting ? styles.active : ''}`}
                        >
                            <IconEye />
                        </button>

                        {/* Botón para selección visual interactiva */}
                        <button
                            onClick={() => {
                                setPageUrl(currentTemplate.url);
                                onStatusChange('visual_selection');
                            }}
                            className={styles.visualSelectionButton}
                            title="Selección Visual Interactiva"
                        >
                            🎯 Selección Visual
                        </button>

                        <button
                            onClick={() => onStatusChange('template')}
                            className={styles.continueButton}
                            disabled={template.templates.every(t => t.selectors.length === 0)}
                        >
                            Continuar ({template.templates.reduce((acc, t) => acc + t.selectors.length, 0)} elementos)
                        </button>
                    </div>

                    <div className={styles.screenshotContainer}>
                        <div className={styles.screenshotWrapper}>
                      
                            <iframe
                                ref={iframeRef}
                                className={styles.iframe}
                                style={{ cursor: isSelecting ? 'crosshair' : 'default' }}
                            />

                            <div ref={selectorOverlayRef} className={styles.selectorOverlay}>
                                {currentTemplate.selectors.map(selector => (
                                    <div
                                        key={selector.id}
                                        className={styles.selectorBox}
                                        style={{
                                            left: selector.position.x,
                                            top: selector.position.y,
                                            width: selector.position.width,
                                            height: selector.position.height
                                        }}
                                    >
                                        <div className={styles.selectorLabel}>
                                            {selector.name}
                                        </div>
                                    </div>
                                ))}

                                {selectedElement && (
                                    <div
                                        className={styles.selectedElement}
                                        style={{
                                            left: selectedElement.rect.x,
                                            top: selectedElement.rect.y,
                                            width: selectedElement.rect.width,
                                            height: selectedElement.rect.height
                                        }}
                                    />
                                )}
                            </div>
                        </div>

                        {/* Panel de elementos interactivos */}
                        {currentTemplate.interactiveElements && currentTemplate.interactiveElements.length > 0 && (
                            <div className={styles.interactiveElementsPanel}>
                                <h4>🎯 Elementos Interactivos Disponibles</h4>
                                <div className={styles.elementsList}>
                                    {currentTemplate.interactiveElements.map((element, index) => (
                                        <div
                                            key={index}
                                            className={styles.interactiveElement}
                                            onClick={() => {
                                                setSelectedElement({
                                                    element: null,
                                                    rect: element.rect,
                                                    selector: `[data-element-index="${index}"]`,
                                                    name: `${element.elementType} ${index + 1}`
                                                });
                                            }}
                                        >
                                            <div className={styles.elementIcon}>
                                                {element.elementType === 'button' && '🔘'}
                                                {element.elementType === 'link' && '🔗'}
                                                {element.elementType === 'input' && '📝'}
                                                {element.elementType === 'image' && '🖼️'}
                                            </div>
                                            <div className={styles.elementInfo}>
                                                <strong>{element.elementType}</strong>
                                                <span className={styles.elementText}>
                                                    {element.textContent || element.placeholder || element.href || 'Sin texto'}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                </div>
                <div className={styles.selectorControls}>
                    {selectedElement && (
                        <div className={styles.selectorForm}>
                            <div
                                style={{
                                    display: 'flex',
                                    gap: '10px'
                                }}
                            >

                                <input
                                    type="text"
                                    placeholder="Nombre del selector (ej: precio, título, botón)"
                                    value={newSelector.name}
                                    onChange={(e) => setNewSelector(prev => ({ ...prev, name: e.target.value }))}
                                    className={styles.selectorInput}
                                />

                                <select
                                    value={newSelector.type}
                                    onChange={(e) => setNewSelector(prev => ({ ...prev, type: e.target.value }))}
                                    className={styles.selectorSelect}
                                >
                                    <option value="text">exto</option>
                                    <option value="click">Hacer clic</option>
                                    <option value="wait">Esperar</option>
                                    <option value="condition">Condición</option>
                                </select>
                            </div>

                            <textarea
                                placeholder="Prompt/Condición (ej: debe contener '€', debe ser visible, etc.)"
                                value={newSelector.prompt}
                                onChange={(e) => setNewSelector(prev => ({ ...prev, prompt: e.target.value }))}
                                className={styles.selectorTextarea}
                                rows={3}
                            />

                            <div className={styles.selectorActions}>
                                <button onClick={addSelector} className={styles.addButton}>
                                    <IconPlus /> Añadir Selector
                                </button>
                                <button
                                    onClick={() => setSelectedElement(null)}
                                    className={styles.cancelButton}
                                >
                                    <IconClose /> Cancelar
                                </button>
                            </div>
                        </div>
                    )}

                    <div className={styles.selectorsList}>
                        {currentTemplate.selectors.map(selector => (
                            <div key={selector.id} className={styles.selectorItem}>
                                <div className={styles.selectorInfo}>
                                    <strong>{selector.name}</strong>
                                    <span className={styles.selectorType}>{selector.type}</span>
                                    <span className={styles.selectorPath}>{selector.selector}</span>
                                </div>
                                <button
                                    onClick={() => removeSelector(selector.id)}
                                    className={styles.removeButton}
                                >
                                    <IconTrash />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };



    const TemplateState = () => {
        const [editingStep, setEditingStep] = useState(null);
        const [newStep, setNewStep] = useState({
            name: '',
            type: 'action', 
            action: '',
            parameters: {},
            conditions: [],
            templateId: null 
        });

        const addStep = () => {
            if (!newStep.name.trim() || !newStep.templateId) return;

            const step = {
                id: uuidv4(),
                ...newStep,
                order: template.steps ? template.steps.length : 0
            };

            setTemplate(prev => ({
                ...prev,
                steps: [...(prev.steps || []), step]
            }));

            setNewStep({
                name: '',
                type: 'action',
                action: '',
                parameters: {},
                conditions: [],
                templateId: null
            });
        };

        const removeStep = (id) => {
            setTemplate(prev => ({
                ...prev,
                steps: (prev.steps || []).filter(s => s.id !== id)
            }));
        };

        const updateStep = (id, updates) => {
            setTemplate(prev => ({
                ...prev,
                steps: (prev.steps || []).map(s => s.id === id ? { ...s, ...updates } : s)
            }));
        };

        const moveStep = (id, direction) => {
            setTemplate(prev => {
                const steps = [...(prev.steps || [])];
                const index = steps.findIndex(s => s.id === id);
                if (index === -1) return prev;

                const newIndex = direction === 'up' ? index - 1 : index + 1;
                if (newIndex < 0 || newIndex >= steps.length) return prev;

                [steps[index], steps[newIndex]] = [steps[newIndex], steps[index]];
                return { ...prev, steps };
            });
        };

        const saveTemplate = () => {
        };

        return (
            <div className={styles.templateContainer}>
                <div className={styles.templateContent}>
                    <div className={styles.templateInfoContent}>
                        <input
                            type="text"
                            placeholder="Nombre del template"
                            value={template.name}
                            onChange={(e) => setTemplate(prev => ({ ...prev, name: e.target.value }))}
                            className={styles.templateNameInput}
                        />
                        <textarea
                            placeholder="Descripción del template"
                            value={template.description}
                            onChange={(e) => setTemplate(prev => ({ ...prev, description: e.target.value }))}
                            className={styles.templateDescriptionInput}
                            rows={3}
                        />
                    </div>

                    <div className={styles.templatesOverview}>
                        <h4>Resumen de Plantillas</h4>
                        <div className={styles.templatesSummary}>
                            {template.templates.map((templateStep, index) => (
                                <div key={templateStep.id} className={styles.templateSummary}>
                                    <div className={styles.templateSummaryHeader}>
                                        <span className={styles.templateNumber}>{index + 1}</span>
                                        <strong>{templateStep.name}</strong>
                                    </div>
                                    <div className={styles.templateSummaryStats}>
                                        <span>URL: {templateStep.url}</span>
                                        <span>Selectores: {templateStep.selectors.length}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.stepsContainer}>
                        <h4>Pasos del scraping ({(template.steps || []).length})</h4>

                        <div className={styles.stepsList}>
                            {(template.steps || []).map((step, index) => {
                                const associatedTemplate = template.templates.find(t => t.id === step.templateId);
                                return (
                                    <div key={step.id} className={styles.stepItem}>
                                        <div className={styles.stepHeader}>
                                            <span className={styles.stepNumber}>{index + 1}</span>
                                            <strong>{step.name}</strong>
                                            <span className={styles.stepType}>{step.type}</span>
                                            {associatedTemplate && (
                                                <span className={styles.stepTemplate}>
                                                    {associatedTemplate.name}
                                                </span>
                                            )}
                                        </div>

                                        <div className={styles.stepActions}>
                                            <button onClick={() => setEditingStep(step.id)}>
                                                <IconEdit />
                                            </button>
                                            {template.steps.length > 1 && (
                                                <>
                                                    <button onClick={() => moveStep(step.id, 'up')} disabled={index === 0}>
                                                        ↑
                                                    </button>
                                                    <button onClick={() => moveStep(step.id, 'down')} disabled={index === (template.steps || []).length - 1}>
                                                        ↓
                                                    </button>
                                                </>
                                            )}
                                            <button onClick={() => removeStep(step.id)}>
                                                <IconTrash />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className={styles.addStepForm}>
                            <div
                                style={{
                                    display: 'flex',
                                    gap: '10px'
                                }}
                            >
                                <select
                                    value={newStep.type}
                                    onChange={(e) => setNewStep(prev => ({ ...prev, type: e.target.value }))}
                                    className={styles.stepSelect}
                                >
                                    <option value="action">Acción</option>
                                    <option value="condition">Condición</option>
                                    <option value="loop">Bucle</option>
                                    <option value="variable">Variable</option>
                                </select>
                                <input
                                    type="text"
                                    placeholder="Nombre del paso"
                                    value={newStep.name}
                                    onChange={(e) => setNewStep(prev => ({ ...prev, name: e.target.value }))}
                                    className={styles.stepInput}
                                />

                            </div>

                            <select
                                value={newStep.templateId || ''}
                                onChange={(e) => setNewStep(prev => ({ ...prev, templateId: e.target.value }))}
                                className={styles.stepSelect}
                            >
                                <option value="">Seleccionar plantilla</option>
                                {template.templates.map(t => (
                                    <option key={t.id} value={t.id}>{t.name}</option>
                                ))}
                            </select>

                        </div>
                    </div>

                    <div className={styles.templateActions}>
                        <button
                            onClick={() => onStatusChange('selector')}
                            className={styles.backButton}
                        >
                            <IconArrowLeft />
                        </button>
                        <button onClick={addStep} className={styles.addStepButton}>
                            <IconPlus /> Añadir
                        </button>
                        <button onClick={saveTemplate} className={styles.saveButton}>
                            Guardar
                        </button>
                        
                        <button
                            onClick={() => onStatusChange('example')}
                            className={styles.executeButton}
                            disabled={(template.steps || []).length === 0}
                        >
                            <IconPlay /> Ejecutar
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const ExampleState = () => {
        const executeScraping = async () => {
            setIsExecuting(true);
            const startTime = Date.now();

            try {
                await new Promise(resolve => setTimeout(resolve, 2000));

                const allResults = [];

                template.templates.forEach(templateStep => {
                    templateStep.selectors.forEach(selector => {
                        allResults.push({
                            id: uuidv4(),
                            template: templateStep.name,
                            selector: selector.name,
                            value: `Valor extraído de ${selector.name} en ${templateStep.name}`,
                            status: 'success',
                            timestamp: new Date().toISOString()
                        });
                    });
                });

                setScrapingResults(allResults);
                setExecutionTime((Date.now() - startTime) / 1000);

            } catch (error) {
                console.error('Error executing scraping:', error);
            } finally {
                setIsExecuting(false);
            }
        };

        return (
            <div className={styles.exampleContainer}>
                <div className={styles.exampleContent}>
                    <div className={styles.templatesExecutionSummary}>
                        <h4>Resumen de Ejecución</h4>
                        <div className={styles.executionSummary}>
                            <div className={styles.summaryItem}>
                                <strong>Plantillas:</strong> {template.templates.length}
                            </div>
                            <div className={styles.summaryItem}>
                                <strong>Total Selectores:</strong> {template.templates.reduce((acc, t) => acc + t.selectors.length, 0)}
                            </div>
                            <div className={styles.summaryItem}>
                                <strong>Pasos Configurados:</strong> {(template.steps || []).length}
                            </div>
                        </div>
                    </div>

                    <div className={styles.resultsContainer}>
                        <h4>Resultados del Scraping ({scrapingResults.length})</h4>

                        {scrapingResults.length > 0 ? (
                            <div className={styles.resultsTable}>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Plantilla</th>
                                            <th>Selector</th>
                                            <th>Valor</th>
                                            <th>Estado</th>
                                            <th>Timestamp</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {scrapingResults.map(result => (
                                            <tr key={result.id}>
                                                <td>
                                                    <span className={styles.templateBadge}>
                                                        {result.template}
                                                    </span>
                                                </td>
                                                <td>{result.selector}</td>
                                                <td>{result.value}</td>
                                                <td>
                                                    <span className={`${styles.status} ${styles[result.status]}`}>
                                                        {result.status}
                                                    </span>
                                                </td>
                                                <td>{new Date(result.timestamp).toLocaleTimeString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className={styles.noResults}>
                                <p>No hay resultados aún. Ejecuta el scraping para ver los datos extraídos de todas las plantillas.</p>
                            </div>
                        )}
                    </div>

                    <div className={styles.exampleActions}>
                        <button onClick={() => onStatusChange('template')} className={styles.backButton}>
                            ← Volver al Template
                        </button>
                        <button onClick={() => onStatusChange('loading')} className={styles.newScrapingButton}>
                            🆕 Nuevo Scraping
                        </button>
                        <div className={styles.executionControls}>
                            <button
                                onClick={executeScraping}
                                disabled={isExecuting}
                                className={styles.executeButton}
                            >
                                {isExecuting ? <IconPause /> : <IconPlay />}
                                {isExecuting ? 'Ejecutando...' : 'Ejecutar Scraping'}
                            </button>

                            {executionTime > 0 && (
                                <div className={styles.executionTime}>
                                    Tiempo de ejecución: {executionTime.toFixed(2)}s
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderCurrentState = () => {
        switch (status) {
            case 'loading':
                return <LoadingState />;
            case 'selector':
                return <SelectorState />;
            case 'template':
                return <TemplateState />;
            case 'example':
                return <ExampleState />;
            default:
                return <LoadingState />;

        }
    };

    return (
        <div className={styles.scrapingContainer}>
            {renderCurrentState()}
            <div className={styles.statusIndicator}>
                <div className={styles.statusSteps}>
                    <div
                        className={`${styles.statusStep} ${status === 'loading' ? styles.active : ''}`}
                        onClick={() => onStatusChange('loading')}
                    >
                        1. Plantillas
                    </div>
                    <div
                        className={`${styles.statusStep} ${status === 'selector' ? styles.active : ''}`}
                        onClick={() => onStatusChange('selector')}
                    >
                        2. Selectores
                    </div>
                    <div
                        className={`${styles.statusStep} ${status === 'template' ? styles.active : ''}`}
                        onClick={() => onStatusChange('template')}
                    >
                        3. Configuración
                    </div>
                    <div
                        className={`${styles.statusStep} ${status === 'example' ? styles.active : ''}`}
                        onClick={() => onStatusChange('example')}
                    >
                        4. Ejecutar
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScrapingContainer;