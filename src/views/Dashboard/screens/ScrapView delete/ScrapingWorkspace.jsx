import React, { useState } from 'react';
// import { Plus, Play, Edit2, Trash2, Eye, Code, Settings } from 'lucide-react';
// import { Button } from './ui/button';
// import { Input } from './ui/input';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
// import { Badge } from './ui/badge';
// import { Textarea } from './ui/textarea';
// import { ScrapingLayer, ScrapingSelector, ScrapingVariable } from '../App';
import styles from './ScrapingWorkspace.module.css';
import { ReactComponent as IconStar } from './assets/icon-star.svg';
import { ReactComponent as IconPlay } from './assets/icon-play.svg';
import { ReactComponent as IconLayer } from './assets/icon-layer.svg';
import { ReactComponent as IconTrash } from './assets/icon-trash.svg';
import { ReactComponent as IconPlus } from './assets/icon-plus.svg';
import { ReactComponent as IconEdit } from './assets/icon-edit.svg';

const SelectorDialog = ({ selector, layerType, onSave }) => {
  const [name, setName] = useState(selector?.name || '');
  const [selectorValue, setSelectorValue] = useState(selector?.selector || '');
  const [type, setType] = useState(selector?.type || 'text');

  const handleSave = () => {
    if (name && selectorValue) {
      onSave({ name, selector: selectorValue, type });
      setName('');
      setSelectorValue('');
      setType('text');
    }
  };


//   return(
//     <div>
//         eijduki
//     </div>
//   )
  return (
    <div className={styles.dialogContent}>
      <div>
        <div>
          {selector ? 'Editar Selector' : 'Nuevo Selector'}
        </div>
      </div>
      
      <div className={styles.formGroup}>
        <label>Nombre del campo</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="ej: titulo, precio, descripcion"
          className={styles.formInput}
        />
      </div>

      <div className={styles.formGroup}>
        <label>Tipo de datos</label>
        <select 
          value={type} 
          onChange={(e) => setType(e.target.value)}
          className={styles.formSelect}
        >
          <option value="text">Texto</option>
          <option value="link">Enlace</option>
          <option value="image">Imagen</option>
          <option value="table">Tabla</option>
          <option value="number">Número</option>
          <option value="date">Fecha</option>
        </select>
      </div>

      <div className={styles.formGroup}>
        <label>
          {layerType === 'pdf' ? 'Prompt de IA' : 'Selector CSS'}
        </label>
        {layerType === 'pdf' ? (
          <textarea
            value={selectorValue}
            onChange={(e) => setSelectorValue(e.target.value)}
            placeholder="ej: Extrae todos los precios de la tabla de productos"
            rows={3}
            className={styles.formTextarea}
          />
        ) : (
          <input
            value={selectorValue}
            onChange={(e) => setSelectorValue(e.target.value)}
            placeholder="ej: .price, #title, h1"
            className={styles.formInput}
          />
        )}
        <div className={styles.hint}>
          {layerType === 'pdf' 
            ? 'Describe en lenguaje natural qué información quieres extraer'
            : 'Usa selectores CSS para identificar elementos específicos'
          }
        </div>
      </div>

      <div className={styles.dialogActions}>
        <div asChild>
          <button variant="outline">Cancelar</button>
        </div>
        <div asChild>
          <button onClick={handleSave}>Guardar</button>
        </div>
      </div>
    </div>
  );
//   return (
//     <DialogContent className={styles.dialogContent}>
//       <DialogHeader>
//         <DialogTitle>
//           {selector ? 'Editar Selector' : 'Nuevo Selector'}
//         </DialogTitle>
//       </DialogHeader>
      
//       <div className={styles.formGroup}>
//         <label>Nombre del campo</label>
//         <Input
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           placeholder="ej: titulo, precio, descripcion"
//         />
//       </div>

//       <div className={styles.formGroup}>
//         <label>Tipo de datos</label>
//         <Select value={type} onValueChange={(value) => setType(value)}>
//           <SelectTrigger>
//             <SelectValue />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="text">Texto</SelectItem>
//             <SelectItem value="link">Enlace</SelectItem>
//             <SelectItem value="image">Imagen</SelectItem>
//             <SelectItem value="table">Tabla</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>

//       <div className={styles.formGroup}>
//         <label>
//           {layerType === 'pdf' ? 'Prompt de IA' : 'Selector CSS'}
//         </label>
//         {layerType === 'pdf' ? (
//           <Textarea
//             value={selectorValue}
//             onChange={(e) => setSelectorValue(e.target.value)}
//             placeholder="ej: Extrae todos los precios de la tabla de productos"
//             rows={3}
//           />
//         ) : (
//           <Input
//             value={selectorValue}
//             onChange={(e) => setSelectorValue(e.target.value)}
//             placeholder="ej: .price, #title, h1"
//           />
//         )}
//         <div className={styles.hint}>
//           {layerType === 'pdf' 
//             ? 'Describe en lenguaje natural qué información quieres extraer'
//             : 'Usa selectores CSS para identificar elementos específicos'
//           }
//         </div>
//       </div>

//       <div className={styles.dialogActions}>
//         <DialogTrigger asChild>
//           <Button variant="outline">Cancelar</Button>
//         </DialogTrigger>
//         <DialogTrigger asChild>
//           <Button onClick={handleSave}>Guardar</Button>
//         </DialogTrigger>
//       </div>
//     </DialogContent>
//   );
};

const VariableDialog = ({ variable, onSave }) => {
  const [name, setName] = useState(variable?.name || '');
  const [value, setValue] = useState(variable?.value || '');
  const [type, setType] = useState(variable?.type || 'static');

  const handleSave = () => {
    if (name && value) {
      onSave({ name, value, type });
      setName('');
      setValue('');
      setType('static');
    }
  };



  return (
    <div className={styles.dialogContent}>
      <div>
        <div>
          {variable ? 'Editar Variable' : 'Nueva Variable'}
        </div>
      </div>
      
      <div className={styles.formGroup}>
        <label>Nombre de la variable</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="ej: fecha_actual, usuario_id"
          className={styles.formInput}
        />
      </div>

      <div className={styles.formGroup}>
        <label>Tipo de variable</label>
        <select 
          value={type} 
          onChange={(e) => setType(e.target.value)}
          className={styles.formSelect}
        >
          <option value="texto">Texto</option>
          <option value="numero">Número</option>
          <option value="uuid">UUID</option>
          <option value="tabla">Tabla</option>
          <option value="static">Estático</option>
          <option value="dynamic">Dinámico</option>
          <option value="prompt">Prompt IA</option>
        </select>
      </div>

      <div className={styles.formGroup}>
        <label>Valor</label>
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={
            type === 'texto' ? 'Texto de ejemplo' :
            type === 'numero' ? '123.45' :
            type === 'uuid' ? 'Se generará automáticamente' :
            type === 'tabla' ? 'Configuración de tabla JSON' :
            type === 'static' ? 'Valor fijo' :
            type === 'dynamic' ? 'Expresión JavaScript' :
            'Prompt para IA'
          }
          rows={3}
          className={styles.formTextarea}
        />
      </div>

      <div className={styles.dialogActions}>
        <div asChild>
          <button variant="outline">Cancelar</button>
        </div>
        <div asChild>
          <button onClick={handleSave}>Guardar</button>
        </div>
      </div>
    </div>
  );

//   return (
//     <DialogContent className={styles.dialogContent}>
//       <DialogHeader>
//         <DialogTitle>
//           {variable ? 'Editar Variable' : 'Nueva Variable'}
//         </DialogTitle>
//       </DialogHeader>
      
//       <div className={styles.formGroup}>
//         <label>Nombre de la variable</label>
//         <Input
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           placeholder="ej: fecha_actual, usuario_id"
//         />
//       </div>

//       <div className={styles.formGroup}>
//         <label>Tipo de variable</label>
//         <Select value={type} onValueChange={(value) => setType(value)}>
//           <SelectTrigger>
//             <SelectValue />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="static">Estático</SelectItem>
//             <SelectItem value="dynamic">Dinámico</SelectItem>
//             <SelectItem value="prompt">Prompt IA</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>

//       <div className={styles.formGroup}>
//         <label>Valor</label>
//         <Textarea
//           value={value}
//           onChange={(e) => setValue(e.target.value)}
//           placeholder={
//             type === 'static' ? 'Valor fijo' :
//             type === 'dynamic' ? 'Expresión JavaScript' :
//             'Prompt para IA'
//           }
//           rows={3}
//         />
//       </div>

//       <div className={styles.dialogActions}>
//         <DialogTrigger asChild>
//           <Button variant="outline">Cancelar</Button>
//         </DialogTrigger>
//         <DialogTrigger asChild>
//           <Button onClick={handleSave}>Guardar</Button>
//         </DialogTrigger>
//       </div>
//     </DialogContent>
//   );
};

export const ScrapingWorkspace = ({
  activeLayer,
  onUpdateLayer,
  onExecuteScraping,
  isProcessing,
  uploadedFile,
  onClosePreview
}) => {
  const [previewMode, setPreviewMode] = useState('selectors');

  // Si no hay capa activa pero hay un archivo subido, mostrar solo el preview
  if (!activeLayer && uploadedFile) {
    return (
      <div className={styles.workspace}>
        <div className={styles.documentPreview}>
          <div className={styles.previewHeader}>
            <h4>Vista previa del documento</h4>
            <div className={styles.previewActions}>
              <div className={styles.fileInfo}>
                <span>{uploadedFile.fileName}</span>
                <span>{(uploadedFile.fileSize / 1024 / 1024).toFixed(2)} MB</span>
              </div>
              <button 
                className={styles.closePreview}
                onClick={onClosePreview}
                title="Cerrar preview"
              >
                ×
              </button>
            </div>
          </div>
          <div className={styles.previewContent}>
            {uploadedFile.previewUrl && (
              <iframe
                src={uploadedFile.previewUrl}
                title="PDF Preview"
                width="100%"
                height="250"
                style={{ 
                  border: '1px solid var(--border)', 
                  borderRadius: '8px',
                  backgroundColor: 'var(--background)'
                }}
              />
            )}
          </div>
          <div className={styles.previewFooter}>
            <p>Selecciona una capa en el sidebar para configurar el scraping de este documento</p>
          </div>
        </div>
      </div>
    );
  }

  if (!activeLayer) {
    return (
      <div className={styles.workspace}>
        <div className={styles.emptyState}>
            {/* icon settings */}
          <IconStar />  
          {/* <Settings size={48} className={styles.emptyIcon} /> */}
          <h3>Selecciona una capa para configurar</h3>
          <p>Elige una capa del sidebar para ver y editar sus selectores y variables</p>
        </div>
      </div>
    );
  }

  const addSelector = (selectorData) => {
    const newSelector = {
      ...selectorData,
      id: Date.now().toString()
    };
    onUpdateLayer(activeLayer.id, {
      selectors: [...activeLayer.selectors, newSelector]
    });
  };

  const updateSelector = (selectorId, selectorData) => {
    const updatedSelectors = activeLayer.selectors.map(s =>
      s.id === selectorId ? { ...selectorData, id: selectorId } : s
    );
    onUpdateLayer(activeLayer.id, { selectors: updatedSelectors });
  };

  const deleteSelector = (selectorId) => {
    const updatedSelectors = activeLayer.selectors.filter(s => s.id !== selectorId);
    onUpdateLayer(activeLayer.id, { selectors: updatedSelectors });
  };

  const addVariable = (variableData) => {
    const newVariable = {
      ...variableData,
      id: Date.now().toString()
    };
    onUpdateLayer(activeLayer.id, {
      variables: [...activeLayer.variables, newVariable]
    });
  };

  const deleteVariable = (variableId) => {
    const updatedVariables = activeLayer.variables.filter(v => v.id !== variableId);
    onUpdateLayer(activeLayer.id, { variables: updatedVariables });
  };

  return (
    <div className={styles.workspace}>
      <div className={styles.workspaceHeader}>
        <div className={styles.layerInfo}>
          <h3>{activeLayer.name}</h3>
          {/* <Badge variant={activeLayer.type === 'pdf' ? 'secondary' : 'default'}>
            {activeLayer.type.toUpperCase()}
            </Badge> */}
          <label>
            {activeLayer.type.toUpperCase()}
          </label>
        </div>
        
        <button
          onClick={() => onExecuteScraping(activeLayer.id)}
          disabled={isProcessing || activeLayer.selectors.length === 0}
          className={styles.executeButton}
        >
            <IconPlay />
            {/* icon play */}
          {/* <Play size={16} /> */}
          {isProcessing ? 'Procesando...' : 'Ejecutar Scraping'}
        </button>
      </div>

      {/* Preview del contenido según tipo de capa */}
      {activeLayer.type === 'pdf' ? (
        <div className={styles.documentPreview}>
          <div className={styles.previewHeader}>
            <h4>Vista previa del documento</h4>
            <div className={styles.previewActions}>
              <div className={styles.fileInfo}>
                <span>{
                  uploadedFile?.fileName
                  || activeLayer?.name
                  || (typeof activeLayer?.url === 'string' && /^(https?:\/\/|data:)/.test(activeLayer.url)
                        ? (activeLayer.url.split('/').pop() || 'Documento')
                        : 'Documento')
                }</span>
                <span>{uploadedFile?.fileSize ? `${(uploadedFile.fileSize / 1024 / 1024).toFixed(2)} MB` : 'PDF'}</span>
              </div>
              {uploadedFile && (
                <button 
                  className={styles.closePreview}
                  onClick={onClosePreview}
                  title="Cerrar preview"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div className={styles.previewContent}>
            {(uploadedFile?.previewUrl || activeLayer.url) ? (
              <iframe
                src={uploadedFile?.previewUrl || activeLayer.url}
                title="PDF Preview"
                width="100%"
                height="250"
                style={{ 
                  border: '1px solid var(--border)', 
                  borderRadius: '8px',
                  backgroundColor: 'var(--background)'
                }}
              />
            ) : (
              <div className={styles.noPreview}>
                <p>📄 PDF cargado</p>
                <p>Preview no disponible</p>
              </div>
            )}
          </div>
        </div>
      ) : activeLayer.type === 'web' ? (
        <div className={styles.documentPreview}>
          <div className={styles.previewHeader}>
            <h4>Vista previa de la página</h4>
            <div className={styles.previewActions}>
              <div className={styles.fileInfo}>
                <span>{activeLayer.url}</span>
                <span>Web</span>
              </div>
              <a
                href={activeLayer.url}
                target="_blank"
                rel="noreferrer noopener"
                className={styles.closePreview}
                title="Abrir en nueva pestaña"
              >
                ↗
              </a>
            </div>
          </div>
          <div className={styles.previewContent}>
            {activeLayer.url && (
              <>
                <iframe
                  src={activeLayer.url}
                  title="Website Preview"
                  width="100%"
                  height="250"
                  style={{ 
                    border: '1px solid var(--border)', 
                    borderRadius: '8px',
                    backgroundColor: 'var(--background)'
                  }}
                />
                <div className={styles.previewFooter}>
                  <p>Si la web no carga dentro del panel, puede que bloquee la incrustación. Usa el botón ↗ para abrirla en una pestaña nueva.</p>
                </div>
              </>
            )}
          </div>
        </div>
      ) : null}

      <div className={styles.tabContainer}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${previewMode === 'selectors' ? styles.tabActive : ''}`}
            onClick={() => setPreviewMode('selectors')}
          >
            {/* icon code */}
            <IconLayer />
            {/* <Code size={16} /> */}
            Selectores ({activeLayer.selectors.length})
          </button>
          <button
            className={`${styles.tab} ${previewMode === 'variables' ? styles.tabActive : ''}`}
            onClick={() => setPreviewMode('variables')}
          >
            {/* icon settings */}
            <IconLayer />
            {/* <Settings size={16} /> */}
            Variables ({activeLayer.variables.length})
          </button>
        </div>
      </div>

      <div className={styles.workspaceContent}>
        {previewMode === 'selectors' && (
          <div className={styles.selectorsList}>
            <div className={styles.sectionHeader}>
              <h4>Selectores de datos</h4>
              {/* <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus size={16} />
                    Agregar Selector
                  </Button>
                </DialogTrigger>
                <SelectorDialog
                  layerType={activeLayer.type}
                  onSave={addSelector}
                />
              </Dialog> */}
              <button onClick={() => addSelector()}>
                <IconPlus />
              </button>
            </div>

            <SelectorDialog onSave={addSelector} />

            {activeLayer.selectors.map((selector) => (
              <div key={selector.id} className={styles.selectorCard}>
                <div className={styles.selectorHeader}>
                  <div className={styles.selectorName}>{selector.name}</div>
                  {/* <Badge variant="outline">{selector.type}</Badge> */}
                  <div className={styles.selectorActions}>
                    {/* <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Edit2 size={14} />
                        </Button>
                      </DialogTrigger>
                      <SelectorDialog
                        selector={selector}
                        layerType={activeLayer.type}
                        onSave={(data) => updateSelector(selector.id, data)}
                      />
                    </Dialog> */}
                    <button onClick={() => updateSelector(selector.id, selector)}>
                        <IconEdit />
                    </button>
                    <button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteSelector(selector.id)}
                    >
                        <IconTrash />
                        {/* icon trash */}
                      {/* <Trash2 size={14} /> */}
                    </button>
                  </div>
                </div>
                <div className={styles.selectorValue}>{selector.selector}</div>
              </div>
            ))}

            {activeLayer.selectors.length === 0 && (
              <div className={styles.emptyList}>
                <p>No hay selectores configurados</p>
                <p>Agrega selectores para extraer datos específicos</p>
              </div>
            )}
          </div>
        )}

        {previewMode === 'variables' && (
          <div className={styles.variablesList}>
            <div className={styles.sectionHeader}>
              <h4>Variables personalizadas</h4>
              {/* <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus size={16} />
                    Agregar Variable
                  </Button>
                </DialogTrigger>
                <VariableDialog onSave={addVariable} />
              </Dialog> */}
              {/* Icon agregar variable */}
              <button >
                <IconPlus />
              </button>
            </div>
            <div>
            <VariableDialog onSave={addVariable} />
            </div>

            {activeLayer.variables.map((variable) => (
              <div key={variable.id} className={styles.variableCard}>
                <div className={styles.variableHeader}>
                  <div className={styles.variableName}>{variable.name}</div>
                  {/* <Badge variant="outline">{variable.type}</Badge> */}
                  <button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteVariable(variable.id)}
                  >
                    <IconTrash />
                    {/*     icon trash */}
                    {/* <Trash2 size={14} /> */}
                  </button>
                </div>
                <div className={styles.variableValue}>{variable.value}</div>
              </div>
            ))}

            {activeLayer.variables.length === 0 && (
              <div className={styles.emptyList}>
                <p>No hay variables configuradas</p>
                <p>Las variables te permiten personalizar el scraping</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};