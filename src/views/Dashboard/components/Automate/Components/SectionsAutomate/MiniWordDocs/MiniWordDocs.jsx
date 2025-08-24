import { useState, useRef, useEffect } from "react";
import { ReactComponent as Negrita } from "../../../../../assets/Negrita.svg";
import { ReactComponent as Cursive } from "../../../../../assets/Cursive.svg";
import { ReactComponent as Subrayado } from "../../../../../assets/Subrayado.svg";
import { ReactComponent as MiddleLine } from "../../../../../assets/MiddleLine.svg";
import { ReactComponent as LeftSentence } from "../../../../../assets/LeftSentence.svg";
import { ReactComponent as CenterSentence } from "../../../../../assets/CenterSentence.svg";
import { ReactComponent as RightSentence } from "../../../../../assets/RightSentence.svg";
import { ReactComponent as ViñetaNumerica } from "../../../../../assets/ViñetaNumerica.svg";
import { ReactComponent as ViñetaSimple } from "../../../../../assets/ViñetaSimple.svg";
import { ReactComponent as CodeSimbol } from "../../../../../assets/CodeSimbol.svg";
import { ReactComponent as EmojiSimbol } from "../../../../../assets/EmojiSimbol.svg";
import { ReactComponent as StarMagic } from "../../../../../assets/StarMagic.svg";
import { ReactComponent as A } from "../../../../../assets/A.svg";
import { ReactComponent as ArrowDownGray } from "../../../../../assets/arrowDownGray.svg";
import styles from "./MiniWordDocs.module.css";
import { useDispatch } from "react-redux";
import { sendEmailNotify, imageToHtml } from "../../../../../../../actions/automate";

function MiniWordDocs({
  configuration,
  handleConfigurationChange,
  icon,
  whatsappConfiguration,
  initialContent,
  autoResize,
  customStyles
}) {
  const [formatState, setFormatState] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikeThrough: false,
    justifyLeft: false,
    justifyCenter: false,
    justifyRight: false,
    fontName: "Arial",
    fontSize: "3",
  });
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [htmlContent, setHtmlContent] = useState("");
  const [oneClickToStopReRender, setOneClickToStopReRender] = useState(true);
  const editorRef = useRef(null);
  const emojiButtonRef = useRef(null);
  const pdfInputRef = useRef(null);
  const toolbarRef = useRef(null);
  const savedSelectionRef = useRef(null);
  const imageInputRef = useRef(null);
  const currentImageTargetRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingSeconds, setLoadingSeconds] = useState(0);
  const loadingIntervalRef = useRef(null);

  // Resizer overlay state
  const containerRef = useRef(null);
  const [resizerVisible, setResizerVisible] = useState(false);
  const [overlayRect, setOverlayRect] = useState({ top: 0, left: 0, width: 0, height: 0 });
  const selectedElementRef = useRef(null);
  const dragStateRef = useRef(null);

  const formatText = (command, value = null) => {
    if (!editorRef.current) return;

    document.execCommand(command, false, value);
    editorRef.current.focus();

    updateFormatState(command, value);
  };


  const updateFormatState = (command, value) => {
    switch (command) {
      case "bold":
        setFormatState((prev) => ({ ...prev, bold: !prev.bold }));
        break;
      case "italic":
        setFormatState((prev) => ({ ...prev, italic: !prev.italic }));
        break;
      case "underline":
        setFormatState((prev) => ({ ...prev, underline: !prev.underline }));
        break;
      case "strikeThrough":
        setFormatState((prev) => ({
          ...prev,
          strikeThrough: !prev.strikeThrough,
        }));
        break;
      case "justifyLeft":
        setFormatState((prev) => ({
          ...prev,
          justifyLeft: true,
          justifyCenter: false,
          justifyRight: false,
        }));
        break;
      case "justifyCenter":
        setFormatState((prev) => ({
          ...prev,
          justifyLeft: false,
          justifyCenter: true,
          justifyRight: false,
        }));
        break;
      case "justifyRight":
        setFormatState((prev) => ({
          ...prev,
          justifyLeft: false,
          justifyCenter: false,
          justifyRight: true,
        }));
        break;
      case "fontName":
        setFormatState((prev) => ({ ...prev, fontName: value }));
        break;
      case "fontSize":
        setFormatState((prev) => ({ ...prev, fontSize: value }));
        break;
      default:
        break;
    }

    setTimeout(checkFormatState, 10);
  };

  const checkFormatState = () => {
    const currentFontName = document.queryCommandValue("fontName");

    let normalizedFontName = currentFontName.replace(/["']/g, "").toLowerCase();
    let fontNameValue = "Arial"; 
    if (
      normalizedFontName.includes("times") ||
      normalizedFontName.includes("roman")
    ) {
      fontNameValue = "Times New Roman";
    } else if (normalizedFontName.includes("courier")) {
      fontNameValue = "Courier New";
    } else if (normalizedFontName.includes("georgia")) {
      fontNameValue = "Georgia";
    } else if (normalizedFontName.includes("verdana")) {
      fontNameValue = "Verdana";
    } else if (normalizedFontName.includes("arial")) {
      fontNameValue = "Arial";
    }
    setFormatState({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
      strikeThrough: document.queryCommandState("strikeThrough"),
      justifyLeft: document.queryCommandState("justifyLeft"),
      justifyCenter: document.queryCommandState("justifyCenter"),
      justifyRight: document.queryCommandState("justifyRight"),
      fontName: fontNameValue,
      fontSize: document.queryCommandValue("fontSize") || "3",
    });

    if (editorRef.current) {
      if (whatsappConfiguration) {
        setHtmlContent(editorRef.current.innerHTML);
        handleConfigurationChange(
          "whatsAppMessage",
          editorRef.current.innerHTML
        );
      } else if (icon === "Outlook") {
        setHtmlContent(editorRef.current.innerHTML);
        handleConfigurationChange("outlookBody", editorRef.current.innerHTML);
      } else {
        setHtmlContent(editorRef.current.innerHTML);
        handleConfigurationChange("gmailBody", editorRef.current.innerHTML);
      }
    } else {
      console.warn("editorRef.current ==>", editorRef.current);
    }
  };

  const insertEmoji = (emoji) => {
    if (!editorRef.current) return;

    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(document.createTextNode(emoji));
    }
    editorRef.current.focus();
    setShowEmojiPicker(false);
  };

  const emojis = ["😀", "😂", "❤️", "👍", "🎉", "🔥", "✅", "⭐", "🚀", "💡"];

  const saveDocument = () => {
    handleConfigurationChange("htmlContent", htmlContent);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiButtonRef.current &&
        !emojiButtonRef.current.contains(event.target) &&
        showEmojiPicker
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker]);

  
  useEffect(() => {
    const handleClickInside = (event) => {
      if (editorRef.current && editorRef.current.contains(event.target)) {
        checkFormatState();
      }
    };

    const editorElement = editorRef.current;
    if (editorElement) {
      editorElement.addEventListener("click", handleClickInside);
    }

    return () => {
      if (editorElement) {
        editorElement.removeEventListener("click", handleClickInside);
      }
    };
  }, [editorRef]);

  useEffect(() => {
    if (whatsappConfiguration) {
      if (
        configuration?.whatsAppMessage &&
        JSON.stringify(configuration?.whatsAppMessage) !==
          JSON.stringify(htmlContent) &&
        oneClickToStopReRender
      ) {
        setHtmlContent(configuration?.whatsAppMessage);
        editorRef.current.innerHTML = configuration?.whatsAppMessage;
      }
    } else if (icon === "Outlook") {
      if (
        configuration?.outlookBody &&
        JSON.stringify(configuration?.outlookBody) !==
          JSON.stringify(htmlContent) &&
        oneClickToStopReRender
      ) {
        setHtmlContent(configuration?.outlookBody);
        editorRef.current.innerHTML = configuration?.outlookBody;
      }
    } else {
      if (
        configuration?.gmailBody &&
        JSON.stringify(configuration?.gmailBody) !==
          JSON.stringify(htmlContent) &&
        oneClickToStopReRender
      ) {
        setHtmlContent(configuration?.gmailBody);
        editorRef.current.innerHTML = configuration?.gmailBody;
      }
    }
  }, [
    configuration?.gmailBody,
    configuration?.whatsAppMessage,
    configuration?.outlookBody,
  ]);

  const [turnSize, setTurnSize] = useState(false);
  const [turnFont, setTurnFont] = useState(false);
  const [turnColor, setTurnColor] = useState(false);
  const [showTextColorPopup, setShowTextColorPopup] = useState(false);
  const [showBgColorPopup, setShowBgColorPopup] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (isLoading) {
      if (loadingIntervalRef.current) {
        clearInterval(loadingIntervalRef.current);
      }
      loadingIntervalRef.current = setInterval(() => {
        setLoadingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (loadingIntervalRef.current) {
        clearInterval(loadingIntervalRef.current);
        loadingIntervalRef.current = null;
      }
    }
    return () => {
      if (loadingIntervalRef.current) {
        clearInterval(loadingIntervalRef.current);
        loadingIntervalRef.current = null;
      }
    };
  }, [isLoading]);

  // Temporal stub until backend is wired: dispatch(imageToHtml(base64Pdf))
  // Returns a resolved object with HTML content
  // const imageToHtml = (base64Pdf) => async (dispatchFn) => {
  //   return { html: "<div>hello world </div>" };
  // };

  const handleMagicPdfClick = () => {
    if (pdfInputRef.current) {
      pdfInputRef.current.value = "";
      pdfInputRef.current.click();
    }
  };

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });

  const handlePdfChange = async (e) => {
    try {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
      if (!isPdf) {
        alert("Por favor selecciona un archivo PDF.");
        return;
      }

      setIsLoading(true);
      setLoadingSeconds(0);

      const base64 = await fileToBase64(file);
      console.log("base64", base64);
      const { payload } = await dispatch(imageToHtml({ base64 }));
     
     console.log("payload html", payload);
      const resultHtml = (payload && payload.data && payload.data.html) || "<div>hello world </div>";

      if (editorRef.current) {
        editorRef.current.innerHTML = resultHtml;
        setHtmlContent(resultHtml);
        // Propaga el cambio a la configuración asociada
        checkFormatState();
      }
    } catch (err) {
      console.error("Error al procesar el PDF:", err);
      alert("Ocurrió un error al procesar el PDF.");
    }
    finally {
      setIsLoading(false);
    }
  };

  const handleSenEmail = () => {
    dispatch(
      sendEmailNotify({
        senderEmail: configuration?.selectedEmailCustomNotify.email,
        appPassword: configuration?.selectedEmailCustomNotify.appPassword,
        recipientEmail: configuration?.gmailTo[0],
        subject: configuration?.gmailSubject,
        htmlContent: configuration?.gmailBody,
      })
    );
  };
  
  // Image upload helpers
  const triggerImagePickerFor = (imgEl) => {
    currentImageTargetRef.current = imgEl;
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
      imageInputRef.current.click();
    }
  };

  const resizeImageTo500 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result;
        const img = new Image();
        img.onload = () => {
          const targetWidth = 500;
          const baseWidth = img.width || targetWidth;
          const scale = baseWidth ? targetWidth / baseWidth : 1;
          const targetHeight = Math.max(1, Math.round((img.height || targetWidth) * scale));
          const canvas = document.createElement('canvas');
          canvas.width = targetWidth;
          canvas.height = targetHeight;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(dataUrl);
            return;
          }
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
          let outType = 'image/png';
          if (file && /image\/jpe?g/i.test(file.type)) outType = 'image/jpeg';
          const out = canvas.toDataURL(outType);
          resolve(out);
        };
        img.onerror = reject;
        img.src = dataUrl;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleImageChange = async (e) => {
    try {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const isImg = /^image\/(png|jpe?g|svg\+xml)$/i.test(file.type) || /\.(png|jpe?g|svg)$/i.test(file.name || '');
      if (!isImg) {
        alert('Selecciona una imagen PNG, JPG o SVG.');
        return;
      }
      const targetImg = currentImageTargetRef.current;
      if (!targetImg) return;
      const rect = targetImg.getBoundingClientRect();
      const prevWidth = `${Math.round(rect.width)}px`;
      const prevHeight = `${Math.round(rect.height)}px`;

      const dataUrl = await resizeImageTo500(file);
      targetImg.src = dataUrl;
      // Mantener tamaño visual previo
      targetImg.style.width = prevWidth;
      targetImg.style.height = prevHeight;

      setTimeout(() => {
        updateOverlayPosition();
        checkFormatState();
      }, 0);
    } catch (err) {
      console.error('Error al procesar la imagen:', err);
      alert('Ocurrió un error al procesar la imagen.');
    } finally {
      currentImageTargetRef.current = null;
    }
  };
  useEffect(() => {
    if (editorRef.current && initialContent && oneClickToStopReRender) {
      editorRef.current.innerHTML = initialContent;
      setHtmlContent(initialContent);
      setOneClickToStopReRender(false); 
    }
  }, [initialContent, oneClickToStopReRender]);

  // Helpers for resizer overlay
  const getNumberFromCssValue = (value) => {
    if (!value || value === "auto") return 0;
    const parsed = parseFloat(value.toString().replace("px", ""));
    return isNaN(parsed) ? 0 : parsed;
  };

  const updateOverlayPosition = () => {
    if (!selectedElementRef.current || !containerRef.current) return;
    const targetRect = selectedElementRef.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    setOverlayRect({
      top: targetRect.top - containerRect.top,
      left: targetRect.left - containerRect.left,
      width: targetRect.width,
      height: targetRect.height,
    });
  };

  useEffect(() => {
    const onScrollOrResize = () => {
      if (resizerVisible) updateOverlayPosition();
    };
    window.addEventListener("resize", onScrollOrResize);
    const editorEl = editorRef.current;
    if (editorEl) editorEl.addEventListener("scroll", onScrollOrResize, { passive: true });
    return () => {
      window.removeEventListener("resize", onScrollOrResize);
      if (editorEl) editorEl.removeEventListener("scroll", onScrollOrResize);
    };
  }, [resizerVisible]);

  const beginDrag = (handleType, startEvent) => {
    if (!selectedElementRef.current) return;
    startEvent.preventDefault();

    const targetEl = selectedElementRef.current;
    const computed = window.getComputedStyle(targetEl);
    const initial = {
      mouseX: startEvent.clientX,
      mouseY: startEvent.clientY,
      marginTop: getNumberFromCssValue(computed.marginTop),
      marginBottom: getNumberFromCssValue(computed.marginBottom),
      marginLeft: getNumberFromCssValue(computed.marginLeft),
      widthPx: targetEl.getBoundingClientRect().width,
      heightPx: targetEl.getBoundingClientRect().height,
    };
    dragStateRef.current = { handleType, initial };

    // If resizing width on inline elements, make them inline-block to respect width
    if (handleType === "right" || handleType.endsWith("Right")) {
      const display = computed.display;
      if (display === "inline") {
        targetEl.style.display = "inline-block";
      }
    }
    if (handleType === "bottom" || handleType.endsWith("Bottom") || handleType === "topLeft" || handleType === "topRight") {
      const display = computed.display;
      if (display === "inline") {
        targetEl.style.display = "inline-block";
      }
      // Lock min height to avoid collapse
      const currentH = targetEl.getBoundingClientRect().height;
      if (!targetEl.style.minHeight) targetEl.style.minHeight = `${Math.max(1, Math.round(currentH / 4))}px`;
    }

    const onMove = (e) => {
      if (!dragStateRef.current) return;
      const { handleType: h, initial: init } = dragStateRef.current;
      const dx = e.clientX - init.mouseX;
      const dy = e.clientY - init.mouseY;

      if (h === "top") {
        const newMarginTop = Math.max(0, init.marginTop + dy);
        targetEl.style.marginTop = `${newMarginTop}px`;
      }

      if (h === "topLeft" || h === "topRight") {
        const newHeight = Math.max(10, init.heightPx - dy);
        targetEl.style.height = `${newHeight}px`;
      }

      if (h === "bottom" || h === "bottomLeft" || h === "bottomRight") {
        const newHeight = Math.max(10, init.heightPx + dy);
        targetEl.style.height = `${newHeight}px`;
      }

      if (h === "left" || h === "topLeft" || h === "bottomLeft") {
        const newMarginLeft = Math.max(0, init.marginLeft + dx);
        targetEl.style.marginLeft = `${newMarginLeft}px`;
      }

      if (h === "right" || h === "topRight" || h === "bottomRight") {
        const parentRect = targetEl.parentElement ? targetEl.parentElement.getBoundingClientRect() : null;
        const baseWidth = parentRect && parentRect.width ? parentRect.width : (editorRef.current ? editorRef.current.getBoundingClientRect().width : init.widthPx);
        const newWidthPx = Math.max(10, init.widthPx + dx);
        const percent = baseWidth > 0 ? (newWidthPx / baseWidth) * 100 : 100;
        targetEl.style.width = `${percent}%`;
      }

      updateOverlayPosition();
      checkFormatState();
    };

    const onUp = () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      dragStateRef.current = null;
      updateOverlayPosition();
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };

  const handleEditorDoubleClick = (e) => {
    if (!editorRef.current) return;
    if (!editorRef.current.contains(e.target)) return;

    // Avoid selecting the editor container itself
    let target = e.target;
    if (target === editorRef.current) {
      setResizerVisible(false);
      selectedElementRef.current = null;
      return;
    }

    // If text node, get parent element
    if (target && target.nodeType === Node.TEXT_NODE) {
      target = target.parentElement;
    }

    selectedElementRef.current = target;
    setResizerVisible(true);
    updateOverlayPosition();
  };

  const handleEditorClick = (e) => {
    setOneClickToStopReRender(false);
    // Triple click on image to replace
    if (e && e.detail === 3) {
      let target = e.target;
      if (target && target.nodeType === Node.TEXT_NODE) target = target.parentElement;
      if (target && target.tagName === 'IMG') {
        e.preventDefault();
        e.stopPropagation();
        triggerImagePickerFor(target);
        return;
      }
    }
  };

  const wrapSelectedWithLink = () => {
    const el = selectedElementRef.current;
    if (!el) return;
    let anchor = el.closest && el.closest('a');
    const currentHref = anchor ? anchor.getAttribute('href') || '' : '';
    const url = window.prompt("Introduce la URL", currentHref || "https://");
    if (!url) return;
    if (anchor) {
      anchor.href = url;
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
    } else if (el.parentNode) {
      anchor = document.createElement('a');
      anchor.href = url;
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
      el.parentNode.insertBefore(anchor, el);
      anchor.appendChild(el);
    }
    if (anchor) {
      selectedElementRef.current = anchor;
      setResizerVisible(true);
      updateOverlayPosition();
      checkFormatState();
    }
  };

  // Hide resizer when clicking outside selected element and overlay
  useEffect(() => {
    const onDocMouseDown = (e) => {
      const inEditor = editorRef.current && editorRef.current.contains(e.target);
      const overlayEl = document.getElementById("miniworddocs-resize-overlay");
      const inOverlay = overlayEl && overlayEl.contains(e.target);
      const inToolbar = toolbarRef.current && toolbarRef.current.contains(e.target);
      const isSelectedTarget = selectedElementRef.current && selectedElementRef.current.contains && selectedElementRef.current.contains(e.target);
      if (!inToolbar) {
        setShowTextColorPopup(false);
        setShowBgColorPopup(false);
      }
      if (inOverlay || inToolbar) return;
      if (inEditor) {
        if (!isSelectedTarget) {
          setResizerVisible(false);
          selectedElementRef.current = null;
        }
        return;
      }
      // Clicked completely outside
      setResizerVisible(false);
      selectedElementRef.current = null;
    };
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);

  // Selection helpers for toolbar actions
  const saveCurrentSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedSelectionRef.current = sel.getRangeAt(0).cloneRange();
    }
  };
  const restoreSavedSelection = () => {
    const range = savedSelectionRef.current;
    if (!range) return false;
    const sel = window.getSelection();
    if (!sel) return false;
    sel.removeAllRanges();
    sel.addRange(range);
    return true;
  };
  
  // Keyboard handling within editor
  const handleEditorKeyDown = (e) => {
    if (!editorRef.current) return;
    if (!editorRef.current.contains(e.target)) return;

    const selection = window.getSelection();
    const hasCtrl = e.ctrlKey || e.metaKey;
    const hasAlt = e.altKey;

    if (hasCtrl || hasAlt) {
      e.stopPropagation();
    }

    // Ctrl + Z -> Undo
    if (hasCtrl && (e.key === "z" || e.key === "Z")) {
      e.preventDefault();
      document.execCommand("undo", false, null);
      checkFormatState();
      updateOverlayPosition();
      return;
    }
    // Ctrl + Y -> Redo
    if (hasCtrl && (e.key === "y" || e.key === "Y")) {
      e.preventDefault();
      document.execCommand("redo", false, null);
      checkFormatState();
      updateOverlayPosition();
      return;
    }
    // Ctrl + A -> Select all within editor
    if (hasCtrl && (e.key === "a" || e.key === "A")) {
      e.preventDefault();
      const range = document.createRange();
      range.selectNodeContents(editorRef.current);
      selection.removeAllRanges();
      selection.addRange(range);
      return;
    }
    // Delete (Supr) behavior
    if (e.key === "Delete") {
      const sel = window.getSelection();
      if (!sel) return;
      const range = sel.rangeCount > 0 ? sel.getRangeAt(0) : null;
      if (resizerVisible && selectedElementRef.current) {
        e.preventDefault();
        const current = selectedElementRef.current;
        const next = current.nextElementSibling || current.previousElementSibling || null;
        current.remove();
        if (next) {
          selectedElementRef.current = next;
          setResizerVisible(true);
          updateOverlayPosition();
        } else {
          selectedElementRef.current = null;
          setResizerVisible(false);
        }
        checkFormatState();
        return;
      }
      if (range && !range.collapsed) {
        e.preventDefault();
        // Delete selected text and place caret at start of what was next
        range.deleteContents();
        const newRange = document.createRange();
        if (range.startContainer) {
          newRange.setStart(range.startContainer, range.startOffset);
          newRange.collapse(true);
          sel.removeAllRanges();
          sel.addRange(newRange);
        }
        checkFormatState();
        updateOverlayPosition();
        return;
      }
    }
    // Alt + D -> Duplicate
    if (hasAlt && (e.key === "d" || e.key === "D")) {
      e.preventDefault();
      if (selectedElementRef.current) {
        const current = selectedElementRef.current;
        const clone = current.cloneNode(true);
        current.parentElement.insertBefore(clone, current.nextSibling);
        selectedElementRef.current = clone;
        setResizerVisible(true);
        updateOverlayPosition();
        checkFormatState();
      } else {
        // Fallback: duplicate selected text if any
        const sel = window.getSelection();
        if (sel && sel.rangeCount > 0) {
          const range = sel.getRangeAt(0);
          if (!range.collapsed) {
            const contents = range.cloneContents();
            range.collapse(false);
            range.insertNode(contents);
          }
        }
      }
      return;
    }
  };
  
  return (
    <div ref={containerRef} className={styles.wordApp} style={{ position: "relative", height:autoResize && 'fit-content', ...customStyles }}>
      <div ref={toolbarRef} className={styles.toolbar} onMouseDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()}>
      <button
          // onClick={() => formatText("bold")}
          onClick={handleMagicPdfClick}
          className={`${styles.toolButton} ${
            formatState.bold ? styles.active : ""
          }`}
          title="Magic PDF"
        >
          <StarMagic />
        </button>
        {resizerVisible && (
          <button
            onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); }}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); wrapSelectedWithLink(); }}
            className={styles.toolButton}
            title="Enlazar (abrir en nueva pestaña)"
          >
            🔗
          </button>
        )}
        {resizerVisible && (
          <>
            <button
              onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const el = selectedElementRef.current;
                if (!el || !el.parentElement) return;
                const prev = el.previousElementSibling;
                if (prev) {
                  el.parentElement.insertBefore(el, prev);
                  updateOverlayPosition();
                  checkFormatState();
                }
              }}
              className={styles.toolButton}
              title="Mover arriba"
            >
              <ArrowDownGray style={{ transform: "rotate(180deg)" }} height={10} width={10} />
            </button>
            <button
              onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const el = selectedElementRef.current;
                if (!el || !el.parentElement) return;
                const next = el.nextElementSibling;
                if (next) {
                  el.parentElement.insertBefore(el, next.nextSibling);
                  updateOverlayPosition();
                  checkFormatState();
                }
              }}
              className={styles.toolButton}
              title="Mover abajo"
            >
              <ArrowDownGray height={10} width={10} />
            </button>
          </>
        )}
        <input
          ref={pdfInputRef}
          type="file"
          accept="application/pdf"
          onChange={handlePdfChange}
          style={{ display: "none" }}
        />
        <input
          ref={imageInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/svg+xml"
          onChange={handleImageChange}
          style={{ display: "none" }}
        />



        <div
          className={styles.toolGroup}
          id="idColorContainer"
          style={{
            height: "25px",
            padding: "0px 5px",
            position: "relative",
            alignItems: "end",
          }}
          onMouseDown={(e) => { e.stopPropagation(); }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            saveCurrentSelection();
            setShowBgColorPopup(false);
            setShowTextColorPopup((v) => !v);
          }}
        >
          <A
            height={10}
            width={10}
            style={{
              position: "absolute",
              top: "3px",
              left: "12px",
              pointerEvents: "none",
            }}
          />
          {showTextColorPopup && (
            <div className={styles.colorPopup} onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); }}>
              {["#000000", "#ff0000", "#00b050", "#0070c0", "#ffc000", "#ffffff"].map((c) => (
                <button
                  key={c}
                  className={styles.colorSwatch}
                  style={{ background: c }}
                  title={c}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (selectedElementRef.current) {
                      selectedElementRef.current.style.color = c;
                    } else {
                      if (editorRef.current) editorRef.current.focus();
                      restoreSavedSelection();
                      document.execCommand("foreColor", false, c);
                    }
                    setShowTextColorPopup(false);
                    checkFormatState();
                    updateOverlayPosition();
                  }}
                />
              ))}
            </div>
          )}
        </div>

        <div
          className={styles.toolGroup}
          id="idBgColorContainer"
          style={{
            height: "25px",
            padding: "0px 5px",
            position: "relative",
            alignItems: "end",
          }}
          onMouseDown={(e) => { e.stopPropagation(); }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            saveCurrentSelection();
            setShowTextColorPopup(false);
            setShowBgColorPopup((v) => !v);
          }}
        >
          <A
            height={10}
            width={10}
            style={{
              position: "absolute",
              top: "3px",
              left: "12px",
              pointerEvents: "none",
              fill: "#fff",
              background: "#1e1e20",
              borderRadius: "2px",
            }}
          />
          {showBgColorPopup && (
            <div className={styles.colorPopup} onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); }}>
              {["#ffff00", "#ffd966", "#c6efce", "#bdd7ee", "#ffc7ce", "#ffffff"].map((c) => (
                <button
                  key={c}
                  className={styles.colorSwatch}
                  style={{ background: c }}
                  title={c}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (selectedElementRef.current) {
                      selectedElementRef.current.style.backgroundColor = c;
                    } else {
                      if (editorRef.current) editorRef.current.focus();
                      restoreSavedSelection();
                      if (!document.execCommand("hiliteColor", false, c)) {
                        document.execCommand("backColor", false, c);
                      }
                    }
                    setShowBgColorPopup(false);
                    checkFormatState();
                    updateOverlayPosition();
                  }}
                />
              ))}
            </div>
          )}
        </div>

        <div
          className={styles.fontSelect}
          style={{
            position: "relative",
          }}
          onClick={() => {
            document.getElementById("fontSizeSelect").click();
            setTurnSize(!turnSize);
          }}
        >
          <select
            onChange={(e) => {
              formatText("fontSize", e.target.value);
              setTurnSize(false);
            }}
            className={styles.sizeSelect}
            value={formatState.fontSize}
            id="fontSizeSelect"
            onBlur={() => setTurnSize(!turnSize)}
          >
            {[1, 2, 3, 4, 5, 6, 7].map((size) => (
              <option key={size} value={size}>
                {size + 8}
              </option>
            ))}
          </select>
          <ArrowDownGray
            height={10}
            width={10}
            style={{
              transform: !turnSize ? "rotate(180deg)" : "",
              transition: "transform 0.3s ease-in-out",
              position: "absolute",
              right: "5px",
              top: "8px",
              pointerEvents: "none",
            }}
            stroke="#1e1e20"
          />
        </div>

        <div
          className={styles.fontSelect}
          style={{
            position: "relative",
          }}
          onClick={() => {
            document.getElementById("fontSelect").click();
            setTurnFont(!turnFont);
          }}
        >
          <select
            onChange={(e) => {
              formatText("fontName", e.target.value);
              setTurnFont(false);
            }}
            className={styles.fontSelect}
            value={formatState.fontName}
            id="fontSelect"
            onBlur={() => setTurnFont(!turnFont)}
          >
            <option value="Arial" style={{ fontFamily: "Arial" }}>
              Arial
            </option>
            <option
              value="Times New Roman"
              style={{ fontFamily: "Times New Roman" }}
            >
              T. New Roman
            </option>
            <option value="Courier New" style={{ fontFamily: "Courier New" }}>
              Courier New
            </option>
            <option value="Georgia" style={{ fontFamily: "Georgia" }}>
              Georgia
            </option>
            <option value="Verdana" style={{ fontFamily: "Verdana" }}>
              Verdana
            </option>
          </select>
          <ArrowDownGray
            height={10}
            width={10}
            style={{
              transform: !turnFont ? "rotate(180deg)" : "",
              transition: "transform 0.3s ease-in-out",
              position: "absolute",
              right: "5px",
              top: "8px",
              pointerEvents: "none",
            }}
            stroke="#1e1e20"
          />
        </div>

        <button
          onClick={() => formatText("bold")}
          className={`${styles.toolButton} ${
            formatState.bold ? styles.active : ""
          }`}
          title="Negrita"
        >
          <Negrita />
        </button>
        <button
          onClick={() => formatText("italic")}
          className={`${styles.toolButton} ${
            formatState.italic ? styles.active : ""
          }`}
          title="Cursiva"
        >
          <Cursive />
        </button>
        <button
          onClick={() => formatText("underline")}
          className={`${styles.toolButton} ${
            formatState.underline ? styles.active : ""
          }`}
          title="Subrayado"
        >
          <Subrayado />
        </button>
        <button
          onClick={() => formatText("strikeThrough")}
          className={`${styles.toolButton} ${
            formatState.strikeThrough ? styles.active : ""
          }`}
          title="Tachado"
        >
          <MiddleLine />
        </button>

        <button
          onClick={() => formatText("justifyLeft")}
          className={`${styles.toolButton} ${
            formatState.justifyLeft ? styles.active : ""
          }`}
          title="Alinear a la izquierda"
        >
          <LeftSentence />
        </button>
        <button
          onClick={() => formatText("justifyCenter")}
          className={`${styles.toolButton} ${
            formatState.justifyCenter ? styles.active : ""
          }`}
          title="Centrar"
        >
          <CenterSentence />
        </button>
        <button
          onClick={() => formatText("justifyRight")}
          className={`${styles.toolButton} ${
            formatState.justifyRight ? styles.active : ""
          }`}
          title="Alinear a la derecha"
        >
          <RightSentence />
        </button>

        <button
          onClick={() => formatText("insertOrderedList")}
          className={styles.toolButton}
          title="Viñeta numérica"
        >
          <ViñetaNumerica />
        </button>

        <button
          onClick={() => formatText("insertUnorderedList")}
          className={styles.toolButton}
          title="Viñeta simple"
        >
          <ViñetaNumerica />
        </button>

        <button
          onClick={() => {    
            const isCodeBlock =
              document.queryCommandValue("formatBlock") === "pre";

            if (isCodeBlock) {
              formatText("formatBlock", "<p>");
            } else {
              formatText("formatBlock", "<pre>");
            }
          }}
          className={`${styles.toolButton} ${
            document.queryCommandValue("formatBlock") === "pre"
              ? styles.active
              : ""
          }`}
          title="Formato código"
        >
          <CodeSimbol />
        </button>

        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className={styles.toolButton}
          title="Insertar emoji"
        >
          <EmojiSimbol />
        </button>
        {showEmojiPicker && (
          <div className={styles.emojiPickerPopup}>
            {emojis.map((emoji, index) => (
              <button
                key={index}
                onClick={() => insertEmoji(emoji)}
                className={styles.emojiButton}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
        <button
          onClick={() => handleSenEmail()}
          className={styles.toolButton}
          title="Guardar"
        >
          A
        </button>
      </div>
      {isLoading && (
        <div className={styles.loadingRow}>
          <span className={styles.loadingDot}></span>
          <span className={styles.loadingText}>Procesando PDF... {loadingSeconds}s</span>
        </div>
      )}

      <div
        ref={editorRef}
        className={`${styles.editor} ${autoResize && styles.autoResize}`}
        contentEditable={true}
        onInput={checkFormatState}
        suppressContentEditableWarning={true}
        onClick={handleEditorClick}
        onKeyDown={handleEditorKeyDown}
        onDoubleClick={handleEditorDoubleClick}
        style={{ display: isLoading ? 'none' : 'block' }}
      ></div>

      {resizerVisible && (
        <div
          id="miniworddocs-resize-overlay"
          className={styles.resizeOverlay}
          style={{ top: overlayRect.top, left: overlayRect.left, width: overlayRect.width, height: overlayRect.height }}
        >
          <div className={styles.resizeBox}></div>
          {/* Edge handles */}
          <div className={`${styles.resizeHandle} ${styles.top}`}
            onMouseDown={(e) => beginDrag("top", e)}
            title="Ajustar margin-top"
          />
          <div className={`${styles.resizeHandle} ${styles.right}`}
            onMouseDown={(e) => beginDrag("right", e)}
            title="Ajustar width (%)"
          />
          <div className={`${styles.resizeHandle} ${styles.bottom}`}
            onMouseDown={(e) => beginDrag("bottom", e)}
            title="Ajustar altura (abajo)"
          />
          <div className={`${styles.resizeHandle} ${styles.left}`}
            onMouseDown={(e) => beginDrag("left", e)}
            title="Ajustar margin-left"
          />
          {/* Corner handles */}
          <div className={`${styles.resizeHandle} ${styles.topLeft}`}
            onMouseDown={(e) => beginDrag("topLeft", e)}
          />
          <div className={`${styles.resizeHandle} ${styles.topRight}`}
            onMouseDown={(e) => beginDrag("topRight", e)}
          />
          <div className={`${styles.resizeHandle} ${styles.bottomLeft}`}
            onMouseDown={(e) => beginDrag("bottomLeft", e)}
          />
          <div className={`${styles.resizeHandle} ${styles.bottomRight}`}
            onMouseDown={(e) => beginDrag("bottomRight", e)}
          />
        </div>
      )}
    </div>
  );
}

export default MiniWordDocs;
