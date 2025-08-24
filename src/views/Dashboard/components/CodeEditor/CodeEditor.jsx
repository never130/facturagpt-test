import React from 'react';
import Editor from '@monaco-editor/react';

function CodeEditor() {
  const handleEditorDidMount = (editor, monaco) => {
    // Opcional: personalizar el editor después de montarlo
    console.log('Editor montado', editor);
  };

  const handleEditorChange = (value, event) => {
    console.log('Nuevo valor del código:', value);
  };

  return (
    <div style={{ height: '300px',maxHeight: '300px', borderRadius: '4px' }}>
      <Editor
        height="100%"
        defaultLanguage="javascript"
        defaultValue={`{
  "param": "file",
  "default": "file_path/example.pdf",
  "examples": {
    "document": "file_path/example.pdf"
  }
}
`}
        theme="light" // Temas: 'vs-dark', 'light', 'hc-black'
        options={{
          minimap: { enabled: true }, // desactivar minimapa si es muy pesado
          fontSize: 14,
          lineNumbers: 'on', // números de línea activados
          scrollBeyondLastLine: false,
          automaticLayout: true, // ajusta tamaño automáticamente
        //   overviewRulerBorder: false, 
        }}
        onMount={handleEditorDidMount}
        onChange={handleEditorChange}
      />
    </div>
  );
}

export default CodeEditor;