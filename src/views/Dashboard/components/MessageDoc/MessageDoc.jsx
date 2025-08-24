import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import html2pdf from 'html2pdf.js';
import { generateUUID, generateSectionId } from '../../../../utils/uuidGenerator';
import {
  setMessageDocsShow,
  setMessageDocsData,
  setMessageDocsDocId,
  setMessageDocsStatus,
  setMessageDocsPosition,
  setMessageDocsSize,
  setMessageDocsSelectedSection,
  resetMessageDocs,
  clearMessageDocs
} from '../../../../slices/docsSlices';
import { updateMessageByDocId } from '../../../../slices/chatSlices';
import styles from './MessageDoc.module.css';

const MessageDoc = () => {
  const dispatch = useDispatch();
  const { show, data, docId, status, position, size, selectedSectionId } = useSelector(state => state.docs.doc);

  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeDirection, setResizeDirection] = useState(null);
  const [initialSize, setInitialSize] = useState({ width: 0, height: 0 });
  const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });

  const [isEditing, setIsEditing] = useState(false);
  const [formatState, setFormatState] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
    align: 'left',
    orderedList: false,
    unorderedList: false,
    blockquote: false,
    code: false,
    fontSize: '16px',
    fontFamily: 'Arial',
    color: '#000000'
  });
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const editorRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const colorPickerRef = useRef(null);
  const cursorPositionRef = useRef(null);
  const isUserTypingRef = useRef(false);

  const emojis = [
    '😊', '😂', '🤣', '❤️', '😍', '🙌', '👍', '😒', '😘', '💪',
    '😎', '🎉', '🔥', '😅', '✨', '💯', '⭐', '🙏', '👏', '🤔',
    '😭', '🥺', '😤', '💕', '😀', '😃', '😄', '😁', '😆', '😉'
  ];

  const colors = [
    '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
    '#FFA500', '#800080', '#008000', '#FFC0CB', '#A52A2A', '#808080', '#FFFFFF'
  ];

  const fontFamilies = [
    'Arial', 'Times New Roman', 'Courier New', 'Georgia', 'Verdana', 'Helvetica'
  ];

  const fontSizes = ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px'];

  const handleSectionClick = (e) => {
    const section = e.target.closest('section');
    if (section && section.id) {
      dispatch(setMessageDocsSelectedSection(section.id));
      
      section.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
      
      section.classList.add(styles.sectionClicked);
      setTimeout(() => {
        section.classList.remove(styles.sectionClicked);
      }, 300);
    }
  };

  useEffect(() => {
    if (editorRef.current) {
      const allSections = editorRef.current.querySelectorAll('section');
      allSections.forEach(section => {
        section.classList.remove(styles.selected);
      });
      
      if (selectedSectionId) {
        const selectedSection = editorRef.current.querySelector(`#${selectedSectionId}`);
        if (selectedSection) {
          selectedSection.classList.add(styles.selected);
          
   
        }
      }
    }
  }, [selectedSectionId]);

  const getSectionInfo = (sectionId) => {
    if (editorRef.current && sectionId) {
      const section = editorRef.current.querySelector(`#${sectionId}`);
      if (section) {
        return {
          id: sectionId,
          tagName: section.tagName,
          className: section.className,
          textContent: section.textContent,
          innerHTML: section.innerHTML,
          children: section.children.length
        };
      }
    }
    return null;
  };

  const navigateSection = (direction = 'next') => {
    if (editorRef.current) {
      const sections = Array.from(editorRef.current.querySelectorAll('section'));
      const currentIndex = sections.findIndex(section => section.id === selectedSectionId);
      
      if (currentIndex !== -1) {
        let newIndex;
        if (direction === 'next') {
          newIndex = (currentIndex + 1) % sections.length;
        } else {
          newIndex = currentIndex === 0 ? sections.length - 1 : currentIndex - 1;
        }
        
        const newSection = sections[newIndex];
        if (newSection && newSection.id) {
          dispatch(setMessageDocsSelectedSection(newSection.id));
          newSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }
  };

  const handleMouseDown = (e) => {
    if (e.target.closest('.resize-handle') || e.target.closest('.controlButton')) return;

    if (e.target.closest('.content') || e.target.closest('.editor')) return;

    setIsDragging(true);
    const rect = containerRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;

      const maxX = window.innerWidth - size.width;
      const maxY = window.innerHeight - size.height;

      const boundedX = Math.max(0, Math.min(newX, maxX));
      const boundedY = Math.max(0, Math.min(newY, maxY));

      dispatch(setMessageDocsPosition({ x: boundedX, y: boundedY }));
    }

    if (isResizing) {
      const deltaX = e.clientX - initialPosition.x;
      const deltaY = e.clientY - initialPosition.y;

      let newWidth = initialSize.width;
      let newHeight = initialSize.height;
      let newX = position.x;
      let newY = position.y;

      if (resizeDirection.includes('right')) {
        newWidth = Math.max(300, initialSize.width + deltaX);
      }
      if (resizeDirection.includes('left')) {
        const widthChange = initialSize.width - deltaX;
        if (widthChange >= 300) {
          newWidth = widthChange;
          newX = position.x + deltaX;
        }
      }
      if (resizeDirection.includes('bottom')) {
        newHeight = Math.max(200, initialSize.height + deltaY);
      }
      if (resizeDirection.includes('top')) {
        const heightChange = initialSize.height - deltaY;
        if (heightChange >= 200) {
          newHeight = heightChange;
          newY = position.y + deltaY;
        }
      }

      const maxWidth = window.innerWidth - newX;
      const maxHeight = window.innerHeight - newY;

      newWidth = Math.min(newWidth, maxWidth);
      newHeight = Math.min(newHeight, maxHeight);

      newX = Math.max(0, newX);
      newY = Math.max(0, newY);

      dispatch(setMessageDocsSize({ width: newWidth, height: newHeight }));
      dispatch(setMessageDocsPosition({ x: newX, y: newY }));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeDirection(null);
  };

  const handleResizeStart = (e, direction) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeDirection(direction);
    setInitialSize({ width: size.width, height: size.height });
    setInitialPosition({ x: e.clientX, y: e.clientY });
  };

  const execCommand = (command, value = null) => {
    if (!editorRef.current) return;

    editorRef.current.focus();
    document.execCommand(command, false, value);
    updateFormatState();
  };

  const updateFormatState = () => {
    if (!editorRef.current) return;

    setFormatState({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
      strikethrough: document.queryCommandState('strikeThrough'),
      align: getAlignment(),
      orderedList: document.queryCommandState('insertOrderedList'),
      unorderedList: document.queryCommandState('insertUnorderedList'),
      blockquote: isInBlockquote(),
      code: isInCode(),
      fontSize: document.queryCommandValue('fontSize') || '16px',
      fontFamily: document.queryCommandValue('fontName') || 'Arial',
      color: document.queryCommandValue('foreColor') || '#000000'
    });
  };

  const getAlignment = () => {
    if (document.queryCommandState('justifyCenter')) return 'center';
    if (document.queryCommandState('justifyRight')) return 'right';
    if (document.queryCommandState('justifyLeft')) return 'left';
    return 'left';
  };

  const isInBlockquote = () => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return false;

    let element = selection.getRangeAt(0).commonAncestorContainer;
    while (element && element !== editorRef.current) {
      if (element.tagName === 'BLOCKQUOTE') return true;
      element = element.parentNode;
    }
    return false;
  };

  const isInCode = () => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return false;

    let element = selection.getRangeAt(0).commonAncestorContainer;
    while (element && element !== editorRef.current) {
      if (element.tagName === 'CODE') return true;
      element = element.parentNode;
    }
    return false;
  };

  const handleFormat = (type, value = null) => {
    const savedPosition = saveCursorPosition();
    
    switch (type) {
      case 'bold':
        execCommand('bold');
        break;
      case 'italic':
        execCommand('italic');
        break;
      case 'underline':
        execCommand('underline');
        break;
      case 'strikethrough':
        execCommand('strikeThrough');
        break;
      case 'align':
        execCommand(`justify${value.charAt(0).toUpperCase() + value.slice(1)}`);
        break;
      case 'orderedList':
        execCommand('insertOrderedList');
        break;
      case 'unorderedList':
        execCommand('insertUnorderedList');
        break;
      case 'blockquote':
        if (formatState.blockquote) {
          execCommand('formatBlock', '<p>');
        } else {
          execCommand('formatBlock', '<blockquote>');
        }
        break;
      case 'code':
        if (formatState.code) {
          const selection = window.getSelection();
          if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const codeElement = range.commonAncestorContainer.closest('code');
            if (codeElement) {
              const textContent = codeElement.textContent;
              const textNode = document.createTextNode(textContent);
              codeElement.parentNode.replaceChild(textNode, codeElement);
              range.selectNodeContents(textNode);
              range.collapse(false);
              selection.removeAllRanges();
              selection.addRange(range);
            }
          }
        } else {
          const selection = window.getSelection();
          if (selection.toString().length > 0) {
            const range = selection.getRangeAt(0);
            const codeElement = document.createElement('code');
            codeElement.textContent = selection.toString();
            range.deleteContents();
            range.insertNode(codeElement);
          } else {
            const codeElement = document.createElement('code');
            codeElement.textContent = 'código';
            const range = selection.getRangeAt(0);
            range.insertNode(codeElement);
            const newRange = document.createRange();
            newRange.selectNodeContents(codeElement);
            selection.removeAllRanges();
            selection.addRange(newRange);
          }
        }
        updateFormatState();
        break;
      case 'fontSize':
        execCommand('fontSize', value);
        break;
      case 'fontFamily':
        execCommand('fontName', value);
        break;
      case 'color':
        execCommand('foreColor', value);
        break;
      case 'link':
        setShowLinkDialog(true);
        break;
      case 'image':
        setShowImageDialog(true);
        break;
      case 'emoji':
        setShowEmojiPicker(!showEmojiPicker);
        break;
      case 'table':
        insertTable();
        break;
      case 'clearFormat':
        execCommand('removeFormat');
        break;
    }
    
    if (savedPosition) {
      setTimeout(() => {
        restoreCursorPosition(savedPosition);
      }, 0);
    }
  };

  const insertEmoji = (emoji) => {
    if (!editorRef.current) return;

    const savedPosition = saveCursorPosition();
    
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(document.createTextNode(emoji));
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }
    setShowEmojiPicker(false);
    updateFormatState();
    
    if (savedPosition) {
      setTimeout(() => {
        restoreCursorPosition(savedPosition);
      }, 0);
    }
  };

  const insertLink = () => {
    if (!linkUrl.trim()) return;

    const savedPosition = saveCursorPosition();
    
    const selection = window.getSelection();
    if (selection.toString().length > 0) {
      execCommand('createLink', linkUrl);
    } else {
      const linkElement = document.createElement('a');
      linkElement.href = linkUrl;
      linkElement.textContent = linkUrl;
      const range = selection.getRangeAt(0);
      range.insertNode(linkElement);
    }
    setShowLinkDialog(false);
    setLinkUrl('');
    updateFormatState();
    
    if (savedPosition) {
      setTimeout(() => {
        restoreCursorPosition(savedPosition);
      }, 0);
    }
  };

  const insertImage = () => {
    if (!imageUrl.trim()) return;

    const savedPosition = saveCursorPosition();
    
    const imgElement = document.createElement('img');
    imgElement.src = imageUrl;
    imgElement.alt = 'Imagen';
    imgElement.style.maxWidth = '100%';
    imgElement.style.height = 'auto';

    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.insertNode(imgElement);
    }
    setShowImageDialog(false);
    setImageUrl('');
    updateFormatState();
    
    if (savedPosition) {
      setTimeout(() => {
        restoreCursorPosition(savedPosition);
      }, 0);
    }
  };

  const insertTable = () => {
    const savedPosition = saveCursorPosition();
    
    const tableHTML = `
      <table style="border-collapse: collapse; width: 100%; margin: 10px 0;">
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;">Celda 1</td>
          <td style="border: 1px solid #ddd; padding: 8px;">Celda 2</td>
        </tr>
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;">Celda 3</td>
          <td style="border: 1px solid #ddd; padding: 8px;">Celda 4</td>
        </tr>
      </table>
    `;

    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = tableHTML;
      const tableElement = tempDiv.firstElementChild;
      range.insertNode(tableElement);
    }
    updateFormatState();
    
    if (savedPosition) {
      setTimeout(() => {
        restoreCursorPosition(savedPosition);
      }, 0);
    }
  };



  const saveCursorPosition = () => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      return {
        startContainer: range.startContainer,
        startOffset: range.startOffset,
        endContainer: range.endOffset !== range.startOffset ? range.endContainer : null,
        endOffset: range.endOffset !== range.startOffset ? range.endOffset : null
      };
    }
    return null;
  };

  const restoreCursorPosition = (savedPosition) => {
    if (savedPosition && editorRef.current) {
      const selection = window.getSelection();
      
      try {
        if (savedPosition.startContainer && savedPosition.startContainer.parentNode) {
          const range = document.createRange();
          range.setStart(savedPosition.startContainer, savedPosition.startOffset);
          
          if (savedPosition.endContainer && savedPosition.endOffset !== savedPosition.startOffset) {
            range.setEnd(savedPosition.endContainer, savedPosition.endOffset);
          } else {
            range.collapse(true);
          }
          
          selection.removeAllRanges();
          selection.addRange(range);
        } else {
          editorRef.current.focus();
        }
      } catch (error) {
        editorRef.current.focus();
      }
    }
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection.toString().length > 0) {
      const range = selection.getRangeAt(0);
      const container = document.createElement('div');
      container.appendChild(range.cloneContents());
      const selectedHtml = container.innerHTML;
      
      
    }
  };

  const handleEditorInput = useCallback(() => {
    if (editorRef.current) {
      isUserTypingRef.current = true;
      const content = editorRef.current.innerHTML;
      
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        cursorPositionRef.current = {
          startContainer: range.startContainer,
          startOffset: range.startOffset,
          endContainer: range.endOffset !== range.startOffset ? range.endContainer : null,
          endOffset: range.endOffset !== range.startOffset ? range.endOffset : null
        };
      }
      
      if (editorRef.current.timeoutId) {
        clearTimeout(editorRef.current.timeoutId);
      }
      
      editorRef.current.timeoutId = setTimeout(() => {
        dispatch(setMessageDocsData(content));
        
        if (docId) {
          dispatch(updateMessageByDocId({ docId, newText: content }));
        }
        
        isUserTypingRef.current = false;
      }, 1000);
    }
  }, [dispatch, docId]);

  const handleEditorFocus = () => {
    setIsEditing(true);
  };

  useEffect(() => {
    if (editorRef.current && data) {
      if (!isUserTypingRef.current && editorRef.current.innerHTML !== data) {
        const savedPosition = saveCursorPosition();
        editorRef.current.innerHTML = data;
        
        if (savedPosition) {
          setTimeout(() => {
            restoreCursorPosition(savedPosition);
          }, 0);
        }
      }
    } else if (editorRef.current && !data && !editorRef.current.innerHTML) {
      editorRef.current.innerHTML = '<div style="color: #999; font-style: italic;">Escribe aquí tu contenido...</div>';
    }
  }, [data]);

  const handleEditorBlur = () => {
    setIsEditing(false);
    updateFormatState();
  };

  const handleEditorClick = (e) => {
    e.stopPropagation();
  };

  const handleKeyDown = (e) => {
    if (e.target === editorRef.current || editorRef.current?.contains(e.target)) {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          navigateSection('next');
          break;
        case 'ArrowUp':
          e.preventDefault();
          navigateSection('prev');
          break;
        case 'Escape':
          e.preventDefault();
          dispatch(setMessageDocsSelectedSection(null));
          break;
        default:
          break;
      }
    }
  };

  const handleRefresh = () => {
    setIsEditing(false);
    setShowEmojiPicker(false);
    setShowColorPicker(false);
    setShowLinkDialog(false);
    setShowImageDialog(false);
    setLinkUrl('');
    setImageUrl('');
    
    if (editorRef.current) {
      editorRef.current.innerHTML = '';
    }
    
    dispatch(resetMessageDocs());
  };

  const handleCancel = () => {
    setIsEditing(false);
    setShowEmojiPicker(false);
    setShowColorPicker(false);
    setShowLinkDialog(false);
    setShowImageDialog(false);
    setLinkUrl('');
    setImageUrl('');
    
    dispatch(clearMessageDocs());
  };

  const handlePrint = async () => {
    if (!editorRef.current || !editorRef.current.innerHTML) return;

    try {
      const element = contentRef.current;
      const opt = {
        margin: 1,
        filename: 'document.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
      };

      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const handleToggleSize = () => {
    if (status === 'minimized') {
      dispatch(setMessageDocsStatus('expanded'));
      dispatch(setMessageDocsSize({ width: 800, height: 600 }));

      const newWidth = 800;
      const newHeight = 600;
      let newX = position.x;
      let newY = position.y;

      if (position.x + newWidth > window.innerWidth) {
        newX = Math.max(10, window.innerWidth - newWidth - 10);
      }

      if (position.y + newHeight > window.innerHeight) {
        newY = Math.max(10, window.innerHeight - newHeight - 10);
      }

      dispatch(setMessageDocsPosition({ x: newX, y: newY }));
    } else if (status === 'expanded') {
      dispatch(setMessageDocsStatus('fullscreen'));
      dispatch(setMessageDocsSize({
        width: window.innerWidth - 20,
        height: window.innerHeight - 20
      }));
      dispatch(setMessageDocsPosition({ x: 10, y: 10 }));
    } else {
      dispatch(setMessageDocsStatus('minimized'));
      dispatch(setMessageDocsSize({ width: 400, height: 300 }));
      dispatch(setMessageDocsPosition({
        x: window.innerWidth - 420,
        y: 20
      }));
    }
  };

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, dragOffset, initialSize, initialPosition, resizeDirection]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedSectionId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target)) {
        setShowColorPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);



  useEffect(() => {
    if (show && data) {
      if (editorRef.current) {
        editorRef.current.innerHTML = data;
      }
    } else if (!show) {
      setIsEditing(false);
      setShowEmojiPicker(false);
      setShowColorPicker(false);
      setShowLinkDialog(false);
      setShowImageDialog(false);
      setLinkUrl('');
      setImageUrl('');
    }
  }, [show, data]);

  useEffect(() => {
    if (editorRef.current) {
      const allSections = editorRef.current.querySelectorAll('section');
      allSections.forEach(section => {
        section.classList.remove('selected');
      });

      if (selectedSectionId) {
        const selectedSection = editorRef.current.querySelector(`#${selectedSectionId}`);
        if (selectedSection) {
          selectedSection.classList.add('selected');
          
          selectedSection.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }
      }
    }
  }, [selectedSectionId]);

  useEffect(() => {
    return () => {
      setIsEditing(false);
      setShowEmojiPicker(false);
      setShowColorPicker(false);
      setShowLinkDialog(false);
      setShowImageDialog(false);
      setLinkUrl('');
      setImageUrl('');
    };
  }, []);

  if (!show) return null;

  const getStatusIcon = () => {
    switch (status) {
      case 'fullscreen':
        return '⤓'; 
      case 'expanded':
        return '⤢'; 
      default:
        return '⤢'; 
    }
  };

  return (
    <div
      ref={containerRef}
      className={`${styles.messageDocContainer} ${styles[status]}`}
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height
      }}
    >
      {/* Header */}
      <div className={styles.header} onMouseDown={handleMouseDown}>
        <div className={styles.title}>MessageDocs Editor</div>
        <div className={styles.controls}>
          
          <button
            className={styles.controlButton}
            onClick={handleToggleSize}
            title={status === 'fullscreen' ? 'Minimize' : status === 'expanded' ? 'Fullscreen' : 'Expand'}
          >
            {getStatusIcon()}
          </button>

          <button
            className={styles.controlButton}
            onClick={handleCancel}
            title="Cancel"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Editor Toolbar */}
      <div className={styles.editorToolbar}>
        {/* Text Formatting */}
        <div className={styles.toolbarGroup}>

        <button 
            className={styles.toolbarButton}
            onClick={handleRefresh}
            title="Refresh"
          >
            🔄
          </button>
          <button 
            className={styles.toolbarButton}
            onClick={handlePrint}
            title="Print"
          >
            🖨️
          </button>
          <button
            className={`${styles.toolbarButton} ${formatState.bold ? styles.active : ''}`}
            onClick={() => handleFormat('bold')}
            title="Negrita"
          >
            <strong>B</strong>
          </button>
          <button
            className={`${styles.toolbarButton} ${formatState.italic ? styles.active : ''}`}
            onClick={() => handleFormat('italic')}
            title="Cursiva"
          >
            <em>I</em>
          </button>
          <button
            className={`${styles.toolbarButton} ${formatState.underline ? styles.active : ''}`}
            onClick={() => handleFormat('underline')}
            title="Subrayado"
          >
            <u>U</u>
          </button>
          <button
            className={`${styles.toolbarButton} ${formatState.strikethrough ? styles.active : ''}`}
            onClick={() => handleFormat('strikethrough')}
            title="Tachado"
          >
            <s>S</s>
          </button>
        </div>

        {/* Alignment */}
        <div className={styles.toolbarGroup}>
          <button
            className={`${styles.toolbarButton} ${formatState.align === 'left' ? styles.active : ''}`}
            onClick={() => handleFormat('align', 'left')}
            title="Alinear izquierda"
          >
            ⬅️
          </button>
          <button
            className={`${styles.toolbarButton} ${formatState.align === 'center' ? styles.active : ''}`}
            onClick={() => handleFormat('align', 'center')}
            title="Centrar"
          >
            ↔️
          </button>
          <button
            className={`${styles.toolbarButton} ${formatState.align === 'right' ? styles.active : ''}`}
            onClick={() => handleFormat('align', 'right')}
            title="Alinear derecha"
          >
            ➡️
          </button>
        </div>

        {/* Lists and Blocks */}
        <div className={styles.toolbarGroup}>
          <button
            className={`${styles.toolbarButton} ${formatState.orderedList ? styles.active : ''}`}
            onClick={() => handleFormat('orderedList')}
            title="Lista numerada"
          >
            1️⃣
          </button>
          <button
            className={`${styles.toolbarButton} ${formatState.unorderedList ? styles.active : ''}`}
            onClick={() => handleFormat('unorderedList')}
            title="Lista con viñetas"
          >
            •️⃣
          </button>
          <button
            className={`${styles.toolbarButton} ${formatState.blockquote ? styles.active : ''}`}
            onClick={() => handleFormat('blockquote')}
            title="Cita"
          >
            💬
          </button>
          <button
            className={`${styles.toolbarButton} ${formatState.code ? styles.active : ''}`}
            onClick={() => handleFormat('code')}
            title="Código"
          >
            &lt;/&gt;
          </button>
        </div>

        {/* Font Controls */}
        <div className={styles.toolbarGroup}>
          <select
            className={styles.toolbarSelect}
            value={formatState.fontFamily}
            onChange={(e) => handleFormat('fontFamily', e.target.value)}
            title="Fuente"
          >
            {fontFamilies.map(font => (
              <option key={font} value={font}>{font}</option>
            ))}
          </select>
          <select
            className={styles.toolbarSelect}
            value={formatState.fontSize}
            onChange={(e) => handleFormat('fontSize', e.target.value)}
            title="Tamaño de fuente"
          >
            {fontSizes.map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>

        {/* Color and Media */}
        <div className={styles.toolbarGroup}>
          <button
            className={styles.toolbarButton}
            onClick={() => setShowColorPicker(!showColorPicker)}
            title="Color de texto"
            style={{ color: formatState.color }}
          >
            🎨
          </button>
          <button
            className={styles.toolbarButton}
            onClick={() => handleFormat('link')}
            title="Insertar enlace"
          >
            🔗
          </button>
          <button
            className={styles.toolbarButton}
            onClick={() => handleFormat('image')}
            title="Insertar imagen"
          >
            🖼️
          </button>
          <button
            className={styles.toolbarButton}
            onClick={() => handleFormat('table')}
            title="Insertar tabla"
          >
            📊
          </button>
          <button
            className={styles.toolbarButton}
            onClick={() => handleFormat('emoji')}
            title="Insertar emoji"
          >
            😊
          </button>
          <button
            className={styles.toolbarButton}
            onClick={() => handleFormat('clearFormat')}
            title="Limpiar formato"
          >
            🧹
          </button>
        </div>
      </div>

      {/* Color Picker */}
      {showColorPicker && (
        <div ref={colorPickerRef} className={styles.colorPicker}>
          {colors.map(color => (
            <button
              key={color}
              className={styles.colorButton}
              style={{ backgroundColor: color }}
              onClick={() => {
                handleFormat('color', color);
                setShowColorPicker(false);
              }}
              title={color}
            />
          ))}
        </div>
      )}

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div ref={emojiPickerRef} className={styles.emojiPicker}>
          {emojis.map((emoji, index) => (
            <button
              key={index}
              className={styles.emojiButton}
              onClick={() => insertEmoji(emoji)}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Link Dialog */}
      {showLinkDialog && (
        <div className={styles.dialogOverlay}>
          <div className={styles.dialog}>
            <h3>Insertar Enlace</h3>
            <input
              type="url"
              placeholder="https://ejemplo.com"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className={styles.dialogInput}
            />
            <div className={styles.dialogButtons}>
              <button onClick={insertLink} className={styles.dialogButton}>Insertar</button>
              <button onClick={() => setShowLinkDialog(false)} className={styles.dialogButton}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* Image Dialog */}
      {showImageDialog && (
        <div className={styles.dialogOverlay}>
          <div className={styles.dialog}>
            <h3>Insertar Imagen</h3>
            <input
              type="url"
              placeholder="https://ejemplo.com/imagen.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className={styles.dialogInput}
            />
            <div className={styles.dialogButtons}>
              <button onClick={insertImage} className={styles.dialogButton}>Insertar</button>
              <button onClick={() => setShowImageDialog(false)} className={styles.dialogButton}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

            {/* Editor Content */}
      <div className={styles.content} onClick={handleEditorClick}>
        <div
          ref={editorRef}
          className={styles.editor}
          contentEditable={true}
          onInput={handleEditorInput}
          onFocus={handleEditorFocus}
          onBlur={handleEditorBlur}
          onClick={(e) => {
            handleEditorClick(e);
            handleSectionClick(e);
            setTimeout(() => {
              const selection = window.getSelection();
              if (selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                cursorPositionRef.current = {
                  startContainer: range.startContainer,
                  startOffset: range.startOffset,
                  endContainer: range.endOffset !== range.startOffset ? range.endContainer : null,
                  endOffset: range.endOffset !== range.startOffset ? range.endOffset : null
                };
              }
            }, 0);
          }}
          onKeyUp={(e) => {
            updateFormatState();
            setTimeout(() => {
              const selection = window.getSelection();
              if (selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                cursorPositionRef.current = {
                  startContainer: range.startContainer,
                  startOffset: range.startOffset,
                  endContainer: range.endOffset !== range.startOffset ? range.endContainer : null,
                  endOffset: range.endOffset !== range.startOffset ? range.endOffset : null
                };
              }
            }, 0);
          }}
 
          onMouseUp={(e) => {
            updateFormatState();
            handleTextSelection();
          }}
          onSelect={handleTextSelection}
          suppressContentEditableWarning={true}
          style={{ userSelect: 'text', cursor: 'text' }}
        />
      </div>

      {/* Preview Content (hidden) */}
      <div style={{ display: 'none' }}>
        <div
          ref={contentRef}
          className={styles.htmlContent}
          dangerouslySetInnerHTML={{ __html: editorRef.current?.innerHTML || '<div class="empty-state">No content available</div>' }}
        />
      </div>

      {/* Section Selection Indicator */}
      {selectedSectionId && (
        <div className={`${styles.sectionIndicator} ${styles.show}`}>
          <div className={styles.sectionInfo}>
            <span className={styles.sectionId}>📄 {selectedSectionId.substring(0, 8)}...</span>
            <div className={styles.sectionActions}>
              <button 
                className={styles.sectionActionBtn}
                onClick={() => navigateSection('prev')}
                title="Previous Section (↑)"
              >
                ↑
              </button>
              <button 
                className={styles.sectionActionBtn}
                onClick={() => navigateSection('next')}
                title="Next Section (↓)"
              >
                ↓
              </button>
              <button 
                className={styles.sectionActionBtn}
                onClick={() => dispatch(setMessageDocsSelectedSection(null))}
                title="Clear Selection (Esc)"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resize handles */}
      <div
        className={`${styles.resizeHandle} ${styles.resizeTop}`}
        onMouseDown={(e) => handleResizeStart(e, 'top')}
      />
      <div
        className={`${styles.resizeHandle} ${styles.resizeLeft}`}
        onMouseDown={(e) => handleResizeStart(e, 'left')}
      />
      <div
        className={`${styles.resizeHandle} ${styles.resizeRight}`}
        onMouseDown={(e) => handleResizeStart(e, 'right')}
      />
      <div
        className={`${styles.resizeHandle} ${styles.resizeBottom}`}
        onMouseDown={(e) => handleResizeStart(e, 'bottom')}
      />
      <div
        className={`${styles.resizeHandle} ${styles.resizeCorner}`}
        onMouseDown={(e) => handleResizeStart(e, 'right bottom')}
      />
      <div
        className={`${styles.resizeHandle} ${styles.resizeTopLeft}`}
        onMouseDown={(e) => handleResizeStart(e, 'top left')}
      />
      <div
        className={`${styles.resizeHandle} ${styles.resizeTopRight}`}
        onMouseDown={(e) => handleResizeStart(e, 'top right')}
      />
      <div
        className={`${styles.resizeHandle} ${styles.resizeBottomLeft}`}
        onMouseDown={(e) => handleResizeStart(e, 'bottom left')}
      />
    </div>
  );
};

export default MessageDoc;
