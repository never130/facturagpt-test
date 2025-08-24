import React ,{ useEffect, useRef,useState  } from "react";
import ModalBlackBgTemplate from "../../ModalBlackBgTemplate/ModalBlackBgTemplate";
import HeaderCard from "../../HeaderCard/HeaderCard";
import styles from './SeeBill.module.css';
import { useTranslation } from "react-i18next";
import useCloseOnEsc from "../../../../../utils/useClose";
import Button from "../../Button/Button";


import * as pdfjsLib from 'pdfjs-dist/build/pdf';

const workerUrl = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();


const SeeBill = ({ pdfUrl, file, setSeeBill ,setMailModal}) => {
  const { t } = useTranslation("navbarAdmin");

  const embedRef = useRef(null);
  const [dimensions, setDimensions] = useState(null);

  useEffect(() => {
    if (!file && !pdfUrl) return;

    pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

    let loadingTask;
    (async () => {
      try {
        const src = file ? URL.createObjectURL(file) : pdfUrl;
        loadingTask = pdfjsLib.getDocument(src);
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);
        const vp = page.getViewport({ scale: 1 });
        setDimensions({ width: vp.width, height: vp.height });
      } catch (e) {
        console.error('Error midiendo PDF:', e);
      }
    })();

    return () => {
      if (loadingTask) loadingTask.destroy();
      if (file) URL.revokeObjectURL(pdfUrl);
    };
  }, [file, pdfUrl]);

  useEffect(() => {
    const embed = embedRef.current;
    if (!embed || !dimensions) return;
    const w = embed.clientWidth;
    const scale = (w / dimensions.width);
    const h = dimensions.height * scale;
    
    const maxH = window.innerHeight * 0.9;
    embed.style.height = `${Math.min(h, maxH)}px`;
  }, [dimensions]);


  const src = file ? URL.createObjectURL(file) : pdfUrl;

  const close = () => {
    setSeeBill(false);
  };

  const getPdfSrc = () => {
    if (file) return `${URL.createObjectURL(file)}#toolbar=0`;
    if (pdfUrl) return `${pdfUrl}#toolbar=0`;
    return null;
  };
const onClose=() => {
  setSeeBill(false)
}
  useCloseOnEsc(onClose);
  return (
    <ModalBlackBgTemplate
      close={close}
      customStyle={{
        maxHeight: "fit-content",
        minHeight: "fit-content",
        width: "70vw",
      }}
    >
      <HeaderCard title={t('preview')} setState={setSeeBill}>

        <Button action={() => setMailModal(true)}>
          {t('sendByEmail')}
        </Button>
      </HeaderCard>

      <div className={styles.BeforeApproving}>
        {src ? (
          <embed
          ref={embedRef}
            src={`${src}#toolbar=0`}
            type="application/pdf"
            width="100%"
          />
        ) : (
          <div style={{ textAlign: "center", padding: "20px" }}>
            {t('noFileToView')}
          </div>
        )}
      </div>
    </ModalBlackBgTemplate>
  );
};

export default SeeBill;

