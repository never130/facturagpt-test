import React, { useState, useRef, useEffect } from 'react';
import CarouselSelector from '../FileInput/selectInfoToProcces/CarouselSelector';
import ReactDOMServer from 'react-dom/server';


import  IgualA from "../../../../assets/IgualA.svg";
import  DistintoDe from "../../../../assets/DistintoDe.svg";
import  MayorA from "../../../../assets/MayorA.svg";
import  MenorA from "../../../../assets/MenorA.svg";
import  MayorOIGualQue from "../../../../assets/MayorOIgualQue.svg";
import  MenorOIGualQue from "../../../../assets/MenorOIgualQue.svg";
import  Entre from "../../../../assets/Entre.svg";
import  NoEntre from "../../../../assets/NoEntre.svg";
import  In from "../../../../assets/En.svg";
import  NoEn from "../../../../assets/NoEn.svg";
import  Contiene from "../../../../assets/Contiene.svg";
import  NoContiene from "../../../../assets/NoContiene.svg";
import  ComienzaCon from "../../../../assets/EmpiezaCon.svg";
import  TerminaCon from "../../../../assets/TerminaCon.svg";
import  CoincideConRegex from "../../../../assets/CoincideConLaExpresionRegular.svg";
import  Antes from "../../../../assets/Antes.svg";
import  Despues from "../../../../assets/Despues.svg";
import  EnFechaEspecifica from "../../../../assets/EnFechaEspecifica.svg";
import  EntreFechas from "../../../../assets/EntreFechas.svg";
import  DiaDeLaSemana from "../../../../assets/DiaDeLaSemana.svg";
import  EsNulo from "../../../../assets/EsNulo.svg";
import  NoEsNulo from "../../../../assets/NoEsNulo.svg";
import { useTranslation } from 'react-i18next';


const MentionInput = ({
    mentionOptions = [],
  conditionalOptions = [],
  onTextChange,
  onPlainTextChange,
  textConfiguration,
  showConditionals = true,
  automateSelected
}) => {
  const [t] = useTranslation('AutomatesComponent')
  const [htmlContent, setHtmlContent] = useState('');
  const [plainText,setPlainText] = useState('')
  const editableRef = useRef(null);
  const [showMentionMenu, setShowMentionMenu] = useState(false);
const [mentionPosition, setMentionPosition] = useState({ top: 0, left: 0 });
const [mentionTriggerIndex, setMentionTriggerIndex] = useState(null);
const [mentionSearch, setMentionSearch] = useState('');
const [caretOffset, setCaretOffset] = useState(0);
const [showCarouselSelector, setShowCarouselSelector] = useState(false);
const [operatorTriggerIndex, setOperatorTriggerIndex] = useState(null);
const [operatorSearch, setOperatorSearch] = useState('');

const iconsMap = {
  "Igual a":IgualA,
  DistintoDe,
};

useEffect(() => {
  setHtmlContent(textConfiguration);
  if (editableRef.current) {
    editableRef.current.innerHTML = textConfiguration;

    const operatorElements = editableRef.current.querySelectorAll('.operator');
    operatorElements.forEach(operator => {
      const deleteBtn = operator.querySelector('div');
      if (deleteBtn) {
        deleteBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          operator.remove();
          setHtmlContent(editableRef.current.innerHTML);
        });
      }
    });
  }
}, []);



useEffect(() => {
  if(htmlContent != '') {

    onTextChange(htmlContent)
  }
    onPlainTextChange(new DOMParser().parseFromString(htmlContent, 'text/html').body.textContent || '')
    setPlainText(new DOMParser().parseFromString(htmlContent, 'text/html').body.textContent || '')
    
}, [htmlContent])

const handleInput = () => {
  const element = editableRef.current;
  if (!element) return;

  const selection = window.getSelection();
  if (!selection.rangeCount) return;
  const range = selection.getRangeAt(0);

  const preCaretRange = range.cloneRange();
  preCaretRange.selectNodeContents(element);
  preCaretRange.setEnd(range.endContainer, range.endOffset);
  const caretOffsetLocal = preCaretRange.toString().length;
  setCaretOffset(caretOffsetLocal);

  const content = element.textContent;



  const textBeforeCaret = content.slice(0, caretOffsetLocal);
  const mentionMatch = textBeforeCaret.match(/(?:^|\s)@(\w*)$/);

  if (mentionMatch) {
    setShowMentionMenu(true);
    setMentionTriggerIndex(caretOffsetLocal - mentionMatch[1].length - 1);
    setMentionSearch(mentionMatch[1]);

    const rect = range.getBoundingClientRect();
    setMentionPosition({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX });
  } else {
    setShowMentionMenu(false);
    setMentionSearch('');
    setMentionTriggerIndex(null);
  }

  const hashMatch = textBeforeCaret.match(/(?:^|\s)#(\w*)$/);
  if (hashMatch) {
    setShowCarouselSelector(true);
    setOperatorTriggerIndex(caretOffsetLocal - hashMatch[1].length - 1);
    setOperatorSearch(hashMatch[1]);
  } else {
    setShowCarouselSelector(false);
    setOperatorTriggerIndex(null);
    setOperatorSearch('');
  }

  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null);

  while (walker.nextNode()) {
    const node = walker.currentNode;
  
    if (
      node.parentElement?.closest('.mention') ||
      node.parentElement?.closest('.operator')
    ) {
      continue;
    }
  
    mentionOptions.forEach(({ title }) => {
      const regex = new RegExp(`@${title}(?!\\S)`, 'g');
      if (regex.test(node.nodeValue)) {
        if (node.parentNode) {
          const span = document.createElement('span');
          span.className = 'mention';
          span.textContent = `@${title}`;
          span.contentEditable = 'false';
  
          const parts = node.nodeValue.split(new RegExp(`@${title}(?!\\S)`));
          const frag = document.createDocumentFragment();
  
          parts.forEach((part, index) => {
            if (part) frag.appendChild(document.createTextNode(part));
            if (index < parts.length - 1) frag.appendChild(span.cloneNode(true));
          });
  
          try {
            node.parentNode.replaceChild(frag, node);
          } catch (error) {
            console.warn('Error reemplazando nodo:', error);
          }
        }
      }
    });
  }
  


  let charIndex = 0;
  const walker2 = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null);
  let node2, found = false;

  while (!found && (node2 = walker2.nextNode())) {
    const nextCharIndex = charIndex + node2.length;

    if (caretOffsetLocal <= nextCharIndex) {
      const offsetInNode = caretOffsetLocal - charIndex;

      const newRange = document.createRange();
      newRange.setStart(node2, offsetInNode);
      newRange.collapse(true);

      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(newRange);

      found = true;
    }

    charIndex += node2.length;
  }

  setHtmlContent(element.innerHTML);
};


const handleMentionSelect = (title) => {
  const element = editableRef.current;
  if (!element || mentionTriggerIndex === null) return;

  const sel = window.getSelection();
  if (!sel.rangeCount) return;

  const range = sel.getRangeAt(0);

  const content = element.textContent;
  const currentCaretOffset = caretOffset;

  const mentionStart = mentionTriggerIndex;
  const mentionEnd = currentCaretOffset;

  let charIndex = 0;
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null);
  let startNode = null, endNode = null;
  let startOffset = 0, endOffset = 0;

  while (walker.nextNode()) {
    const node = walker.currentNode;
    const nextCharIndex = charIndex + node.length;

    if (!startNode && mentionStart >= charIndex && mentionStart <= nextCharIndex) {
      startNode = node;
      startOffset = mentionStart - charIndex;
    }

    if (!endNode && mentionEnd >= charIndex && mentionEnd <= nextCharIndex) {
      endNode = node;
      endOffset = mentionEnd - charIndex;
    }

    charIndex = nextCharIndex;

    if (startNode && endNode) break;
  }

  if (startNode && endNode) {
    const deleteRange = document.createRange();
    deleteRange.setStart(startNode, startOffset);
    deleteRange.setEnd(endNode, endOffset);
    deleteRange.deleteContents();
  }

  const span = document.createElement('span');
  span.className = 'mention';
  span.setAttribute('contenteditable', 'false');
  span.textContent = `@${title}`;

  const newRange = window.getSelection().getRangeAt(0);
  newRange.insertNode(span);

  const space = document.createTextNode(' ');
  newRange.setStartAfter(span);
  newRange.collapse(true);
  newRange.insertNode(space);

  const finalRange = document.createRange();
  finalRange.setStartAfter(space);
  finalRange.collapse(true);

  sel.removeAllRanges();
  sel.addRange(finalRange);

  setShowMentionMenu(false);
  setMentionTriggerIndex(null);
  setMentionSearch('');

  setHtmlContent(element.innerHTML);
};





const handleOperatorSelect = (operatorObj) => {
  const element = editableRef.current;
  if (!element || operatorTriggerIndex === null) return;

  const { description, title } = operatorObj;
  const iconSrc = iconsMap[description];
  const sel = window.getSelection();
  if (!sel.rangeCount) return;
  const range = sel.getRangeAt(0);

  const content = element.textContent;
  const currentCaretOffset = caretOffset;

  const operatorStart = operatorTriggerIndex;
  const operatorEnd = currentCaretOffset;

  let charIndex = 0;
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null);
  let startNode = null, endNode = null;
  let startOffset = 0, endOffset = 0;

  while (walker.nextNode()) {
    const node = walker.currentNode;
    const nextCharIndex = charIndex + node.length;

    if (!startNode && operatorStart >= charIndex && operatorStart <= nextCharIndex) {
      startNode = node;
      startOffset = operatorStart - charIndex;
    }

    if (!endNode && operatorEnd >= charIndex && operatorEnd <= nextCharIndex) {
      endNode = node;
      endOffset = operatorEnd - charIndex;
    }

    charIndex = nextCharIndex;

    if (startNode && endNode) break;
  }

  if (startNode && endNode) {
    const deleteRange = document.createRange();
    deleteRange.setStart(startNode, startOffset);
    deleteRange.setEnd(endNode, endOffset);
    deleteRange.deleteContents();
  }

  const span = document.createElement('span');
  span.className = 'operator';
  span.setAttribute('contenteditable', 'false');
  span.setAttribute('data-title', title);
  span.style.display = 'inline-flex';
  span.style.alignItems = 'center';
  span.style.marginRight = '4px';
  span.style.gap = '4px';

  if (iconSrc) {
    const img = document.createElement('img');
    img.src = iconSrc;
    img.alt = title;
    img.style.width = '16px';
    img.style.height = '16px';
    span.appendChild(img);
  }

  const textNode = document.createTextNode(description);
  span.appendChild(textNode);

  const deleteBtn = document.createElement('div');
  deleteBtn.textContent = '-';
  deleteBtn.style.cursor = 'pointer';
  deleteBtn.style.color = 'white';
  deleteBtn.style.fontSize = '23px';
  deleteBtn.title = 'Eliminar operador';
  deleteBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    span.remove();
    setHtmlContent(element.innerHTML);
  });

  span.appendChild(deleteBtn);

  range.deleteContents();
  range.insertNode(span);

  const space = document.createTextNode(' ');
  range.setStartAfter(span);
  range.collapse(true);
  range.insertNode(space);

  sel.removeAllRanges();
  sel.addRange(range);

  setShowCarouselSelector(false);
  setOperatorTriggerIndex(null);
  setOperatorSearch('');
  setHtmlContent(element.innerHTML);
};



  return (
    <div style={{ width: '100%' }}>
      
      <div style={{ position: 'relative', width: '100%' }}>
  {plainText.trim() === "" && (
    <span
      style={{
        position: 'absolute',
        left: 8,
        top: 10,
        color: '#999',
        pointerEvents: 'none',
        fontSize: 14,
      }}
    >
      {t('conditionalHere')}
    </span>
  )}
  <div
    ref={editableRef}
    contentEditable
    onInput={handleInput}
    onKeyDown={(e) => {
      if (e.key === 'Enter') {
        e.preventDefault(); 
  
        const element = editableRef.current;
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
  
        const br = document.createElement('br');
        const textNode = document.createTextNode('\u00A0');
        range.deleteContents();
        range.insertNode(br);
        range.collapse(false); 
  
        const newTextNode = document.createTextNode('\u00A0');
        range.insertNode(newTextNode);
        range.setStartAfter(br);
        range.collapse(true);
  
        selection.removeAllRanges();
        selection.addRange(range);
        setHtmlContent(element.innerHTML);
      }
    }}
    style={{
      border: '1px solid #ccc',
      padding: '8px',
      borderRadius: '4px',
      width: '100%',
      background: "#F4F4F4",
      outline:'none',
      boxSizing:"border-box"
    }}
    suppressContentEditableWarning={true}
  />
</div>

{showCarouselSelector && (
  <div
    style={{
      position: 'absolute',

      background: 'white',
      border: '1px solid #ccc',
      borderRadius: '4px',
      zIndex: 1000,
      maxHeight: '150px',
      overflowY: 'auto',
      minWidth: '150px'
    }}
  >
    <CarouselSelector setShowCarousel={setShowCarouselSelector}  setSelectedOperator={handleOperatorSelect}/>
  </div>
)}

{showMentionMenu && (
  <div
    style={{
      position: 'absolute',

      background: 'white',
      border: '1px solid #ccc',
      borderRadius: '4px',
      zIndex: 1000,
      maxHeight: '150px',
      overflowY: 'auto',
      minWidth: '150px'
    }}
  >
    {mentionOptions.length >0 ? mentionOptions
      .filter(option =>
        option.title.toLowerCase().startsWith(mentionSearch.toLowerCase())
      )
      .map((option) => (
        <div
          key={option.title}
          style={{ padding: '4px 8px', cursor: 'pointer' }}
          onClick={() => handleMentionSelect(option.title)}
        >
          @{option.title}
        </div>
      )):(
        <div>{t('noFilters')}</div>
      )}
  </div>
)}



      <style>{`
        .mention {
             background:white;
          padding: 2px 4px;
    border-radius: 10px;
    color:#4F5660;
          white-space: pre;
        }
          .operator{
          background:white;
          padding: 2px 4px;
    border-radius: 10px;
    color:#4F5660;
          }
    .operator div{
    background:#6E6E80;
    height:16px;
    width:16px;
    display:flex;
    justify-content:center;
    align-items:center;
    border-radius:999px;
    color:white;
    }
    
      `}</style>
    </div>
  );
};

export default MentionInput;
