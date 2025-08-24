import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { fetchMetadataPDF, fetchPDF, getPdfBase64 } from '../../../../utils/pdfUtils';
import styles from './SharePDF.module.css'
const SharePDF = () => {
    const { id } = useParams();
    const [pdfUrl, setPdfUrl] = useState(null);
    const [pdfName, setPdfName] = useState(null);
    const [pdfType, setPdfType] = useState(null);
    const [currentId, setCurrentId] = useState(id?.replace(/^"|"$/g, ""));

    const [loadingPdf, setLoadingPdf] = useState(false);
  const [errorLoadingPdf, setErrorLoadingPdf] = useState(false);

  useEffect(() => {
    setCurrentId(id);
  }, [id]);




    const fetchPdfAndSetId = async () => {
        setLoadingPdf(false);
        setErrorLoadingPdf(false);
        setPdfUrl(null);
        setPdfName(null);
        setPdfType(null);
        if (currentId) {
          const cleanId = currentId.replace(/^"|"$/g, ""); 

          const pdf = await getPdfBase64(cleanId); 
          const url = await fetchPDF(cleanId); 
          const metadataFiles = await fetchMetadataPDF(cleanId); 
          const originalFilename = metadataFiles?.filename;
          const parts = originalFilename?.split("-");
          const realFilename = parts?.slice(1).join("-");
          if (!url) {
            setErrorLoadingPdf(true);
          }
          setLoadingPdf(true);
          setTimeout(() => {
            setPdfUrl(pdf?.data?.pdfBase64);
            setPdfName(realFilename);
            setPdfType(metadataFiles?.type);
            setLoadingPdf(false);
          }, 3000);
        }
      };
      useEffect(() => {
        fetchPdfAndSetId();
      }, [currentId]);
    
  return (
    <div className={styles.sharePDFContainer}>
          <embed
              src={`${pdfUrl}`}
              type="application/pdf"

            />
    </div>
  )
}

export default SharePDF