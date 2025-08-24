import React, { useRef, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRealTimeUpdate } from './useRealTimeUpdate';
import { saveAppFiles } from '../../../../../../actions/docs';
import Editor from '@monaco-editor/react';
import styles from './MonacoEditor.module.css';
import { setAppFileContent, setAppSelectedLines } from '../../../../../../slices/docsSlices';

const activateMonacoJSXHighlighter = async (monacoEditor, monaco, language) => {
  try {
    const { default: traverse } = await import("@babel/traverse");
    const { parse } = await import("@babel/parser");
    const {
      default: MonacoJSXHighlighter,
      JSXTypes,
      makeBabelParse,
    } = await import("monaco-jsx-highlighter");

    const isTSX = language === 'tsx';
    const parseJSX = makeBabelParse(parse, isTSX);


    const monacoJSXHighlighter = new MonacoJSXHighlighter(
      monaco,
      parseJSX,
      traverse,
      monacoEditor
    );

    let disposeJSXHighlighting = monacoJSXHighlighter.highlightOnDidChangeModelContent();
    
    let disposeJSXCommenting = monacoJSXHighlighter.addJSXCommentCommand();

    JSXTypes.JSXText.options.inlineClassName = "JSXElement.JSXText.tastyPizza";
    JSXTypes.JSXIdentifier.options.inlineClassName = "JSXElement.JSXIdentifier";
    JSXTypes.JSXAttribute.options.inlineClassName = "JSXElement.JSXAttribute";
    JSXTypes.JSXAttributeValue.options.inlineClassName = "JSXElement.JSXAttributeValue";
    JSXTypes.JSXExpression.options.inlineClassName = "JSXElement.JSXExpression";
    JSXTypes.JSXClosingElement.options.inlineClassName = "JSXElement.JSXClosingElement";
    JSXTypes.JSXSelfClosingElement.options.inlineClassName = "JSXElement.JSXSelfClosingElement";
    JSXTypes.JSXFragment.options.inlineClassName = "JSXElement.JSXFragment";
    JSXTypes.JSXOpeningElement.options.inlineClassName = "JSXElement.JSXOpeningElement";
    JSXTypes.JSXClosingFragment.options.inlineClassName = "JSXElement.JSXClosingFragment";
    JSXTypes.JSXOpeningFragment.options.inlineClassName = "JSXElement.JSXOpeningFragment";

    return {
      monacoJSXHighlighter,
      disposeJSXHighlighting,
      disposeJSXCommenting,
      toggleJSXHighlighting: () => {
        if (disposeJSXHighlighting) {
          disposeJSXHighlighting();
          disposeJSXHighlighting = null;
          return false;
        }
        disposeJSXHighlighting = monacoJSXHighlighter.highlightOnDidChangeModelContent();
        return true;
      },
      toggleJSXCommenting: () => {
        if (disposeJSXCommenting) {
          disposeJSXCommenting();
          disposeJSXCommenting = null;
          return false;
        }
        disposeJSXCommenting = monacoJSXHighlighter.addJSXCommentCommand();
        return true;
      }
    };
  } catch (error) {
    console.error('Error activating JSX Highlighter:', error);
    return null;
  }
};

const MonacoEditor = ({ 
  value, 
  onChange, 
  language = 'javascript', 
  placeholder = 'Escribe tu código aquí...',
  disabled = false,
  onKeyDown,
  autoFocus = false,
  height = '400px',
  onDoubleClick,
  autoHeight = false,
  filePath = null, 
  onFileUpdate = null, 
  currentProject = null,
}) => {
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const jsxHighlighterRef = useRef(null);
  const saveTimeoutRef = useRef(null);
  const dispatch = useDispatch();
  const appFiles = useSelector(state => state.docs.app.files);

  const updateFileInRealTime = useRealTimeUpdate(filePath, value, onFileUpdate);

  const saveFileWithDebounce = useCallback((content) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      const filesToSave = { ...appFiles };
      filesToSave[filePath] = content;
      
      dispatch(saveAppFiles({
        files: filesToSave,
        appId: currentProject
    }));
      
      saveTimeoutRef.current = null;
    }, 5000); 
  }, [filePath, appFiles, dispatch]);

  const handleEditorDidMount = useCallback(async (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    
    const monacoLanguage = getMonacoLanguage(language);
    const currentModel = editor.getModel();
    if (currentModel && currentModel.getLanguageId() !== monacoLanguage) {
      console.log('🚀 Configurando lenguaje inicial:', monacoLanguage);
      const newModel = monaco.editor.createModel(value || '', monacoLanguage);
      editor.setModel(newModel);
    }
    
    if (language === 'jsx' || language === 'tsx') {
      console.log('🎨 Activando JSX Highlighter para:', language);
      const jsxHighlighter = await activateMonacoJSXHighlighter(editor, monaco, language);
      if (jsxHighlighter) {
        jsxHighlighterRef.current = jsxHighlighter;
        console.log('✅ JSX Highlighter activado correctamente');
      }
    }
    
    if (autoFocus) {
      editor.focus();
    }

    if (onDoubleClick) {
      editor.onMouseDown((e) => {
        if (e.event.detail === 2) { 
          onDoubleClick(e);
        }
      });
    }

    editor.onDidChangeCursorSelection((e) => {
      const selection = e.selection;
      const startLine = selection.startLineNumber;
      const endLine = selection.endLineNumber;
      
      if (startLine !== endLine || selection.startColumn !== selection.endColumn) {
        dispatch(setAppSelectedLines({
          startLine,
          endLine,
          startColumn: selection.startColumn,
          endColumn: selection.endColumn
        }));
      } else {
        dispatch(setAppSelectedLines(null));
      }
    });

    editor.updateOptions({
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      fontSize: 14,
      fontFamily: "'Monaco', 'Ubuntu Mono', 'Consolas', monospace",
      lineNumbers: 'on',
      roundedSelection: false,
      scrollbar: {
        vertical: autoHeight ? 'hidden' : 'visible',
        horizontal: 'visible',
        verticalScrollbarSize: 8,
        horizontalScrollbarSize: 8
      },
      theme: 'vs-light',
      wordWrap: 'on',
      automaticLayout: true,
      tabSize: 2,
      insertSpaces: true,
      detectIndentation: false,
      overviewRulerBorder: false,
      hideCursorInOverviewRuler: true,
      overviewRulerLanes: 0
    });

    monaco.editor.setTheme('vs-light');
  }, [language, value, autoFocus, onDoubleClick, dispatch, autoHeight]);

  const handleEditorChange = (value, event) => {
    const newValue = value || '';
    
    if (onChange) {
      onChange(newValue);
    }
    
    if (filePath) {
      updateFileInRealTime(newValue);
    }
    
    if (filePath) {
      saveFileWithDebounce(newValue);
    }
    
    if (autoHeight && editorRef.current) {
      const lineCount = editorRef.current.getModel().getLineCount();
      const lineHeight = editorRef.current.getOption(monaco.editor.EditorOption.lineHeight);
      const newHeight = Math.max(lineCount * lineHeight + 20, 100); 
      editorRef.current.getContainerDomNode().style.height = `${newHeight}px`;
      editorRef.current.layout();
    }
  };

  const handleEditorKeyDown = (event) => {
    if (onKeyDown) {
      onKeyDown(event);
    }
  };

  useEffect(() => {
    if (autoHeight && editorRef.current) {
      const lineCount = editorRef.current.getModel().getLineCount();
      const lineHeight = editorRef.current.getOption(monaco.editor.EditorOption.lineHeight);
      const newHeight = Math.max(lineCount * lineHeight + 20, 100);
      editorRef.current.getContainerDomNode().style.height = `${newHeight}px`;
      editorRef.current.layout();
    }
  }, [value, autoHeight]);

  useEffect(() => {
    if (editorRef.current && autoFocus) {
      setTimeout(() => {
        editorRef.current.focus();
        const model = editorRef.current.getModel();
        if (model) {
          const lastLine = model.getLineCount();
          const lastColumn = model.getLineMaxColumn(lastLine);
          editorRef.current.setPosition({ lineNumber: lastLine, column: lastColumn });
        }
      }, 100);
    }
  }, [autoFocus]);

  useEffect(() => {
    if (editorRef.current && monacoRef.current) {
      const monacoLanguage = getMonacoLanguage(language);
      const currentModel = editorRef.current.getModel();
      const currentValue = editorRef.current.getValue();
      
      if (currentModel && currentModel.getLanguageId() !== monacoLanguage) {
        console.log('🔄 Cambiando lenguaje de', currentModel.getLanguageId(), 'a', monacoLanguage);
        
        if (jsxHighlighterRef.current) {
          if (jsxHighlighterRef.current.disposeJSXHighlighting) {
            jsxHighlighterRef.current.disposeJSXHighlighting();
          }
          if (jsxHighlighterRef.current.disposeJSXCommenting) {
            jsxHighlighterRef.current.disposeJSXCommenting();
          }
          jsxHighlighterRef.current = null;
        }
        
        const currentPosition = editorRef.current.getPosition();
        const currentSelection = editorRef.current.getSelection();
        
        const newModel = monacoRef.current.editor.createModel(value || '', monacoLanguage);
        editorRef.current.setModel(newModel);
        
        if ((language === 'jsx' || language === 'tsx') && !jsxHighlighterRef.current) {
          console.log('🎨 Reactivando JSX Highlighter para:', language);
          activateMonacoJSXHighlighter(editorRef.current, monacoRef.current, language)
            .then((jsxHighlighter) => {
              if (jsxHighlighter) {
                jsxHighlighterRef.current = jsxHighlighter;
                console.log('✅ JSX Highlighter reactivado correctamente');
              }
            })
            .catch((error) => {
              console.error('Error reactivando JSX Highlighter:', error);
            });
        }
        
        if (currentPosition && currentPosition.lineNumber > 0 && currentPosition.column > 0) {
          const model = editorRef.current.getModel();
          if (model && currentPosition.lineNumber <= model.getLineCount()) {
            editorRef.current.setPosition(currentPosition);
            if (currentSelection) {
              editorRef.current.setSelection(currentSelection);
            }
          } else {
            editorRef.current.setPosition({ lineNumber: 1, column: 1 });
          }
        } else {
          editorRef.current.setPosition({ lineNumber: 1, column: 1 });
        }
      } else if (currentValue !== value) {
        const currentPosition = editorRef.current.getPosition();
        
        editorRef.current.setValue(value || '');
        
        if (currentPosition && currentPosition.lineNumber > 0 && currentPosition.column > 0) {
          const model = editorRef.current.getModel();
          if (model && currentPosition.lineNumber <= model.getLineCount()) {
            editorRef.current.setPosition(currentPosition);
          } else {
            editorRef.current.setPosition({ lineNumber: 1, column: 1 });
          }
        } else {
          editorRef.current.setPosition({ lineNumber: 1, column: 1 });
        }
      }
    }
  }, [filePath, value, language]);

  useEffect(() => {
    return () => {
      if (jsxHighlighterRef.current) {
        if (jsxHighlighterRef.current.disposeJSXHighlighting) {
          jsxHighlighterRef.current.disposeJSXHighlighting();
        }
        if (jsxHighlighterRef.current.disposeJSXCommenting) {
          jsxHighlighterRef.current.disposeJSXCommenting();
        }
        jsxHighlighterRef.current = null;
      }
      
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = null;
      }
    };
  }, []);

  const getMonacoLanguage = (fileLanguage) => {
    switch (fileLanguage) {
      case 'jsx':
        return 'javascript';
      case 'tsx':
        return 'typescript';
      case 'js':
        return 'javascript';
      case 'ts':
        return 'typescript';
      case 'css':
        return 'css';
      case 'scss':
        return 'scss';
      case 'html':
        return 'html';
      case 'json':
        return 'json';
      case 'md':
        return 'markdown';
      case 'xml':
        return 'xml';
      case 'sql':
        return 'sql';
      case 'yaml':
        return 'yaml';
      case 'yml':
        return 'yaml';
      case 'py':
        return 'python';
      case 'php':
        return 'php';
      case 'java':
        return 'java';
      case 'c':
        return 'c';
      case 'cpp':
        return 'cpp';
      case 'cs':
        return 'csharp';
      case 'rb':
        return 'ruby';
      case 'go':
        return 'go';
      case 'rs':
        return 'rust';
      case 'swift':
        return 'swift';
      case 'kt':
        return 'kotlin';
      case 'sh':
        return 'shell';
      case 'bash':
        return 'shell';
      case 'zsh':
        return 'shell';
      case 'fish':
        return 'shell';
      case 'ps1':
        return 'powershell';
      case 'bat':
        return 'batch';
      case 'cmd':
        return 'batch';
      case 'ini':
        return 'ini';
      case 'toml':
        return 'toml';
      case 'lock':
        return 'json';
      case 'log':
        return 'plaintext';
      case 'txt':
        return 'plaintext';
      default:
        return 'javascript';
    }
  };

  return (
    <div className={styles.monacoContainer}>
      <Editor
        height={height}
        defaultLanguage={getMonacoLanguage(language)}
        language={getMonacoLanguage(language)}
        value={value}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        onKeyDown={handleEditorKeyDown}
        options={{
          readOnly: disabled,
          placeholder: placeholder,
          wordWrap: 'on',
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 14,
          fontFamily: "'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace",
          lineNumbers: 'on',
          roundedSelection: false,
          automaticLayout: true,
          tabSize: 2,
          insertSpaces: true,
          detectIndentation: false,
          theme: 'vs-light'
        }}
        theme="vs-light"
      />
    </div>
  );
};

export default MonacoEditor; 