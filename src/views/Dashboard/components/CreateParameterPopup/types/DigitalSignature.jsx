import React, { useRef, useEffect, useState } from 'react'
import styles from '../CreateParameterPopup.module.css'
import BasicAdvancedSelector from '../components/BasicAdvancedSelector'
import { useTranslation } from 'react-i18next'
import EditableField from '../components/EditableField'
import Button from '../../Button/Button'

const DigitalSignature = ({ parameterData, handleChange }) => {
  const { t } = useTranslation();
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureData, setSignatureData] = useState('');

  const handleModeChange = (mode) => {
    handleChange({ target: { name: 'mode', value: mode } });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Configurar el contexto del canvas
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const startDrawing = (e) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ctx = canvas.getContext('2d');
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    // Guardar la firma como imagen base64
    const canvas = canvasRef.current;
    const signatureImage = canvas.toDataURL('image/png');
    setSignatureData(signatureImage);
    
    // Actualizar el estado del parámetro
    handleChange({ 
      target: { 
        name: 'signatureData', 
        value: signatureImage 
      } 
    });
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignatureData('');
    
    // Limpiar el estado del parámetro
    handleChange({ 
      target: { 
        name: 'signatureData', 
        value: '' 
      } 
    });
  };

  const saveSignature = () => {
    if (signatureData) {
      // La firma ya se guarda automáticamente al dibujar
      // Aquí podrías agregar lógica adicional si es necesario
      console.log('Firma guardada:', signatureData);
    }
  };

  return (
    <div>
    

        <div>
          {/* <EditableField
            title={t("signatureTitle") || "Título de Firma"}
            type="text"
            name="signatureTitle"
            value={parameterData.signatureTitle || ''}
            onChange={handleChange}
            placeholder="Título de la firma"
            toggleEdit={false}
          /> */}
          
          <div className={styles.signatureName}>
          <img 
                  src={signatureData} 
                  alt="Firma digital" 
                  style={{
                    maxWidth: '30px',
                    height: '30px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
                <p>{t('name')}</p>
          </div>
<Button headerStyle={{borderRadius:'999px',margin:"10px 0"}} type="white">{t('addYourSignature')}</Button>
          <div className={styles.signatureContainer}>
            {/* <h4>{t("drawSignature") || "Dibuja tu firma"}</h4> */}
            
            <div className={styles.canvasWrapper}>
              <canvas
                ref={canvasRef}
                width={400}
                height={200}
                style={{
                  border: '2px solid #ccc',
                  borderRadius: '8px',
                  cursor: 'crosshair',
                  backgroundColor: '#ffffff'
                }}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={(e) => {
                  e.preventDefault();
                  const touch = e.touches[0];
                  const mouseEvent = new MouseEvent('mousedown', {
                    clientX: touch.clientX,
                    clientY: touch.clientY
                  });
                  startDrawing(mouseEvent);
                }}
                onTouchMove={(e) => {
                  e.preventDefault();
                  const touch = e.touches[0];
                  const mouseEvent = new MouseEvent('mousemove', {
                    clientX: touch.clientX,
                    clientY: touch.clientY
                  });
                  draw(mouseEvent);
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  stopDrawing();
                }}
              />
            </div>
            
            {/* <div className={styles.signatureControls}>
              <Button 
                type="gray" 
                onClick={clearSignature}
                headerStyle={{
                  backgroundColor: '#f44336',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: '500',
                  marginRight: '10px'
                }}
              >
                {t("clear") || "Limpiar"}
              </Button>
              
              <Button 
                type="gray" 
                onClick={saveSignature}
                disabled={!signatureData}
                headerStyle={{
                  backgroundColor: '#4caf50',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: '500'
                }}
              >
                {t("save") || "Guardar"}
              </Button>
            </div>
            
            {signatureData && (
              <div className={styles.signaturePreview}>
                <h5>{t("signaturePreview") || "Vista previa de la firma:"}</h5>
                <img 
                  src={signatureData} 
                  alt="Firma digital" 
                  style={{
                    maxWidth: '200px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>
            )} */}
          </div>
        </div>
   
    </div>
  )
}

export default DigitalSignature