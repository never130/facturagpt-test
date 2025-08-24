import styles from "./InvoicePanel.module.css";
import InvoiceForm from "../../components/InvoiceForm/InvoiceForm.jsx";
import Preview from "../../components/Preview/Preview.jsx";
import { useState, useEffect, useRef } from "react";
import Factura from "../../assets/facturaEjemplo.png";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import SkeletonScreen from "../../components/SkeletonScreen/SkeletonScreen.jsx";
import SelectLocation from "../../components/SelectLocation/SelectLocation.jsx";

import CreateNotePopup from "../../components/CreateNotePopup/CreateNotePopup.jsx";

import { getOneDocsById } from "@src/actions/docs";
import { updateContactId } from "../../../../actions/docs.js";
import { useTranslation } from "react-i18next";

const company = {
  email: "coolmail@mail.com",
  phone: "341-59-15",
  website: "www.domain.com",
  address:
    "Pasaje Barcelona núm. 8, (08130), Santa Perpetua De Mogoda, Barcelona, Cataluña",
  cnae: "1234",
};

export default function InvoicePanel() {
  const dispatch = useDispatch();
  const [t] = useTranslation("InvoiceForm");
  const [fileUploaded, setFileUploaded] = useState(false);
  const [showSelectLocation, setShowSelectLocation] = useState(false);
  const { user } = useSelector((state) => state.user);
  const [hasNote, setHasNote] = useState(false);
  const [noteColor, setNoteColor] = useState("tagGreen");
  const [editingNote, setEditingNote] = useState(false);
  const [editorContentFinal, setEditorContentFinal] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const { id } = useParams();



  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const [leftWidth, setLeftWidth] = useState(window.innerWidth / 3);
  const isResizing = useRef(false); 
  const startX = useRef(0); 

  const handleMouseDown = (e) => {
    isResizing.current = true;
    startX.current = e.clientX;
    document.body.style.cursor = "ew-resize";
    document.body.style.userSelect = "none";
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };


  const handleMouseMove = (e) => {
    if (!isResizing.current) return;

    const offset = startX.current - e.clientX; 
    const newWidth = leftWidth + (offset / window.innerWidth) * 2000; 

    if (newWidth > 200 && newWidth < 700) {
      setLeftWidth(newWidth); 
    }
  };


  const handleMouseUp = () => {
    isResizing.current = false;
    document.body.style.cursor = "auto";
    document.body.style.userSelect = "auto";
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); 

  const isMobile = windowWidth <= 768;

  const handleFileChangeInvoice = (event) => {
    if (event.target.files.length > 0) {
      setFileUploaded(true);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const [file, setFile] = useState(null);

  const handleDrop = async(event) => {
    
    event.preventDefault();

    if (event.dataTransfer.files.length > 0) {
      setFileUploaded(true);
      setShowSelectLocation(true);
    }
  };

  const handleAddNote = () => {
    setHasNote(true);
  };

  const handleLabelClick = () => {
    setShowSelectLocation(true);
  };

  const [stateDoc, setStateDoc] = useState({});
  const [stateAsset, setStateAsset] = useState({});
  const [stateContact, setStateContact] = useState({});

  useEffect(() => {

    const fn = async () => {
      setFileUploaded(true);

      const response = await dispatch(
        getOneDocsById({
          docId: id,
        })
      );

      
      if (response.payload) {
        setStateDoc(response.payload.doc);
        setStateAsset(response.payload.assets || []);
        setStateContact(response.payload.contact);
      }
    };

    if (id) {
      fn();
    }else{
      setFileUploaded(false)
    }
  }, [id]);

  const [mobileSelectedDocument, setMobileSelectedDocument] = useState(false);
  const [showInfoMobileBill, setShowInfoMobileBill] = useState(false);
  const [createdNote, setCreatedNote] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [showSelectCurrencyPopup, setShowSelectCurrencyPopup] = useState(false);
  const [symbolSelected, setSymbolSelected] = useState("$");
  const [selectedFileS3, setSelectedFileS3] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [swiped, setSwiped] = useState(false);

  const [initialSubTotal, setInitialSubTotal] = useState(
    isNaN(Number(stateDoc?.total)) ? 0 : Number(stateDoc?.total)
  );
  useEffect(() => {
    setInitialSubTotal(
      isNaN(Number(stateDoc?.total)) ? 0 : Number(stateDoc?.total)
    );
  }, [stateDoc?.total]); 

  const [approveDocument, setApproveDocument] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);

  const [selectedPdf, setSelectedPdf] = useState(null);
  useEffect(() => {
    if (selectedPdf) {
      const fileName = selectedPdf.split("/").pop();
      const pdfUrl = require(`../../assets/pdfs/${fileName}`);

      setPdfUrl(pdfUrl);
    }
  }, [selectedPdf]);

  const key = selectedFileS3?.Key;
  const fullFileName = key?.split("/").pop();
  const [fileNameS3, setFileNameS3] = useState(null);
  const underscoreIndex = fullFileName?.indexOf("_");

  useEffect(() => {
    setFileNameS3(
      underscoreIndex !== -1
        ? fullFileName?.slice(underscoreIndex + 1)
        : fullFileName
    );
  }, [selectedFileS3]);
  const { userFiles } = useSelector((state) => state.scaleway);
  const [selectedFile, setSelectedFile] = useState(null);
  useEffect(() => {
    if (userFiles && id) {
      let found = userFiles.find(file => file.Key.includes(id));
      
      if (!found) found = userFiles.find(file => file?.ETag?.includes(id));
      if (!found) {
        setSelectedFile(null);
        return;
      }
  
      let title = found.Key.split("/").pop(); 
  
      if (title.includes("FILE-")) {
        const parts = title.split("_");
        if (parts.length > 1) {
          title = parts.slice(1).join("_");
        }
        
      }
  
      setSelectedFile((prev) => ({
        ...found,
        title,
      }));
  
    }
  }, [userFiles, id]);
  
  
useEffect(() => {
  document.body.style.overflow = 'hidden';
  return () => {
    document.body.style.overflow = '';
  };
}, []);

  return (
    <>
      {!fileUploaded ? (
        <SkeletonScreen
          handleDragOver={handleDragOver}
          handleDrop={handleDrop}
          handleFileChange={handleFileChangeInvoice}
          inputId="InvoiceInput"
          labelText={t("labelText")}
          helperText={t("helperText")}
          showInput={true}
          enableLabelClick={true}
          onLabelClick={handleLabelClick}
          file={file}
        />
      ) : (
   
        <>

<div style={{ flex: 1, background: "lightgray" }}>
            <Preview
              companyInfo={company}
              document={Factura}
              handleAddNote={handleAddNote}
              setEditingNote={setEditingNote}
              editingNote={editingNote}
              setShowInfoMobileBill={setShowInfoMobileBill}
              setMobileSelectedDocument={setMobileSelectedDocument}
              setCreatedNote={setCreatedNote}
              createdNote={createdNote}
              noteColor={noteColor}
              editorContentFinal={editorContentFinal}
              setEditorContentFinal={setEditorContentFinal}
              setSelectedCurrency={setSelectedCurrency}
              selectedCurrency={selectedCurrency}
              setSwiped={setSwiped}
              swiped={swiped}
              setHasNote={setHasNote}
              approveDocument={approveDocument}
              setApproveDocument={setApproveDocument}
              setSelectedPdf={setSelectedPdf}
              selectedPdf={selectedPdf}
              pdfUrl={pdfUrl}
              stateDoc={stateDoc}
              setStateDoc={setStateDoc}
              initialSubTotal={initialSubTotal}
              setInitialSubTotal={setInitialSubTotal}
              selectedFileS3={selectedFileS3}
            />
          </div>
         
    
          {showSelectLocation && (
            <SelectLocation onClose={() => setShowSelectLocation(false)} />
          )}
          <div
            style={{
              width: "5px",
              cursor: "col-resize",
            }}
            onMouseDown={handleMouseDown}
          ></div>
         
         <div style={{ width: `${leftWidth}px` }}>
            <InvoiceForm
              handleAddNote={handleAddNote}
              noteColor={noteColor}
              setEditingNote={setEditingNote}
              idFile={id}
              showInfoMobileBill={showInfoMobileBill}
              setShowInfoMobileBill={setShowInfoMobileBill}
              createdNote={createdNote}
              editorContentFinal={editorContentFinal}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              stateContact={stateContact}
              setStateContact={setStateContact}
              stateAsset={stateAsset}
              setStateAsset={setStateAsset}
              stateDoc={stateDoc}
              setStateDoc={setStateDoc}
              setSelectedCurrency={setSelectedCurrency}
              selectedCurrency={selectedCurrency}
              setShowSelectCurrencyPopup={setShowSelectCurrencyPopup}
              showSelectCurrencyPopup={showSelectCurrencyPopup}
              setSymbolSelected={setSymbolSelected}
              selectedFileS3={selectedFileS3}
              setFileNameS3={setFileNameS3}
              fileNameS3={fileNameS3}
              setSelectedFileS3={setSelectedFileS3}
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
            />
          </div>

          {hasNote && (
            <CreateNotePopup
              hasNote={hasNote}
              setHasNote={setHasNote}
              noteColor={noteColor}
              setNoteColor={setNoteColor}
              setCreatedNote={setCreatedNote}
              editorContentFinal={editorContentFinal}
              setEditorContentFinal={setEditorContentFinal}
              setEditingNote={setEditingNote}
              editingNote={editingNote}
              isAnimating={isAnimating}
              setIsAnimating={setIsAnimating}
            />
          )}
        </>
      )}
    </>
  );

}
