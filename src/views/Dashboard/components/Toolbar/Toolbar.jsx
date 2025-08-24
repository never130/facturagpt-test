import React, { useState, useRef, useEffect } from "react";
import styles from "./Toolbar.module.css";
import bold from "../../assets/type-bold.svg";
import italic from "../../assets/type-italic.svg";
import underline from "../../assets/type-underline.svg";
import strikethrough from "../../assets/type-strikethrough.svg";
import alignLeft from "../../assets/text-align-left.svg";
import alignCenter from "../../assets/text-align-center.svg";
import alignRight from "../../assets/text-align-right.svg";
import listOrdered from "../../assets/list-ol.svg";
import listUnordered from "../../assets/list-ul.svg";
import blockquote from "../../assets/blockquote-left.svg";
import link from "../../assets/text-link.svg";
import code from "../../assets/code-slash.svg";
import emoji from "../../assets/emoji.svg";
import aiIcon from "../../assets/AI-button.svg";
import { ReactComponent as AIcon } from "../../assets/AIcon.svg";
import { ReactComponent as ArrowDown } from "../../assets/arrowDownBold.svg";

const Toolbar = ({ onContentChange, editorContent }) => {
  const editorRef = useRef(null);
  const [textFormat, setTextFormat] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
    align: "left",
    orderedList: false,
    unorderedList: false,
    blockquote: false,
    code: false,
    fontSize: "12px",
    fontFamily: "Arial",
  });
  const [showEmojiMenu, setShowEmojiMenu] = useState(false);
  const [emojiMenuPosition, setEmojiMenuPosition] = useState({
    top: 0,
    left: 0,
  });
  const emojiMenuRef = useRef(null);

  const emojis = [
    "😊",
    "😂",
    "🤣",
    "❤️",
    "😍",
    "🙌",
    "👍",
    "😒",
    "😘",
    "💪",
    "😎",
    "🎉",
    "🔥",
    "😅",
    "✨",
    "💯",
    "⭐",
    "🙏",
    "👏",
    "🤔",
    "😭",
    "🥺",
    "😤",
    "💕",
  ];

  const [colorPickerVisible, setColorPickerVisible] = useState(false);
  const [selectedColor, setSelectedColor] = useState("black");
  const [selectedRange, setSelectedRange] = useState(null);

  const colors = ["black", "red", "green", "blue", "orange"];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiMenuRef.current &&
        !emojiMenuRef.current.contains(event.target)
      ) {
        setShowEmojiMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleEmojiClick = (emoji) => {
    const editor = editorRef.current;
    const selection = window.getSelection();

    if (!selection.rangeCount) {
      const range = document.createRange();
      range.selectNodeContents(editor);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }

    const range = selection.getRangeAt(0);
    const node = document.createTextNode(emoji);
    range.insertNode(node);
    range.collapse(false);
    setShowEmojiMenu(false);
  };

  const handleFormat = (type, event) => {
    const editor = editorRef.current;
    switch (type) {
      case "bold":
        document.execCommand("bold", false, null);
        setTextFormat((prev) => ({ ...prev, bold: !prev.bold }));
        break;

      case "italic":
        document.execCommand("italic", false, null);
        setTextFormat((prev) => ({ ...prev, italic: !prev.italic }));
        break;

      case "underline":
        document.execCommand("underline", false, null);
        setTextFormat((prev) => ({ ...prev, underline: !prev.underline }));
        break;

      case "strikethrough":
        document.execCommand("strikeThrough", false, null);
        setTextFormat((prev) => ({
          ...prev,
          strikethrough: !prev.strikethrough,
        }));
        break;

      case "left":
      case "center":
      case "right":
        document.execCommand(
          "justify" + type.charAt(0).toUpperCase() + type.slice(1),
          false,
          null
        );
        setTextFormat((prev) => ({ ...prev, align: type }));
        break;

      case "orderedList":
        document.execCommand("insertOrderedList", false, null);
        setTextFormat((prev) => ({ ...prev, orderedList: !prev.orderedList }));
        break;

      case "unorderedList":
        document.execCommand("insertUnorderedList", false, null);
        setTextFormat((prev) => ({
          ...prev,
          unorderedList: !prev.unorderedList,
        }));
        break;

      case "blockquote":
        document.execCommand("formatBlock", false, "<blockquote>");
        setTextFormat((prev) => ({ ...prev, blockquote: !prev.blockquote }));
        break;

      case "link":
        const url = prompt("Ingrese la URL:");
        if (url) {
          document.execCommand("createLink", false, url);
        }
        break;

      case "code":
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);

        if (range.startContainer.parentNode.tagName === "CODE") {
          const codeElement = range.startContainer.parentNode;
          const textContent = codeElement.textContent;
          const textNode = document.createTextNode(textContent);
          codeElement.parentNode.replaceChild(textNode, codeElement);
        }
        else if (selection.toString().length === 0) {
          const code = document.createElement("code");
          code.textContent = "código";
          range.insertNode(code);
          const newRange = document.createRange();
          newRange.selectNodeContents(code);
          selection.removeAllRanges();
          selection.addRange(newRange);
        }
        else {
          const code = document.createElement("code");
          code.textContent = selection.toString();
          range.deleteContents();
          range.insertNode(code);
        }
        break;

      case "emoji":
        const buttonRect = event.currentTarget.getBoundingClientRect();
        setEmojiMenuPosition({
          top: buttonRect.bottom + window.scrollY + 5,
          left: buttonRect.left + window.scrollX,
        });
        setShowEmojiMenu(!showEmojiMenu);
        break;
    }
  };

  const formatButtons = [
    { type: "bold", icon: bold },
    { type: "italic", icon: italic },
    { type: "underline", icon: underline },
    { type: "strikethrough", icon: strikethrough },
  ];

  const alignButtons = [
    { type: "left", icon: alignLeft },
    { type: "center", icon: alignCenter },
    { type: "right", icon: alignRight },
  ];

  const listButtons = [
    { type: "orderedList", icon: listOrdered },
    { type: "unorderedList", icon: listUnordered },
    { type: "blockquote", icon: blockquote },
  ];

  const extraButtons = [
    { type: "link", icon: link },
    { type: "code", icon: code },
    { type: "emoji", icon: emoji },
  ];

  useEffect(() => {
    const checkFormats = () => {
      const selection = window.getSelection();
      if (!selection.rangeCount) return;

      const parentElement = selection.getRangeAt(0).commonAncestorContainer;
      const formats = {
        bold: document.queryCommandState("bold"),
        italic: document.queryCommandState("italic"),
        underline: document.queryCommandState("underline"),
        strikethrough: document.queryCommandState("strikethrough"),
        orderedList: document.queryCommandState("insertOrderedList"),
        unorderedList: document.queryCommandState("insertUnorderedList"),
        blockquote: false,
        code: false,
      };

      let align = "left";
      if (document.queryCommandState("justifyCenter")) align = "center";
      if (document.queryCommandState("justifyRight")) align = "right";

      let element =
        parentElement.nodeType === 3 ? parentElement.parentNode : parentElement;
      while (element && element !== editorRef.current) {
        if (element.tagName === "BLOCKQUOTE") formats.blockquote = true;
        if (element.tagName === "CODE") formats.code = true;
        element = element.parentNode;
      }

      setTextFormat((prev) => ({
        ...prev,
        ...formats,
        align,
      }));
    };

    const editor = editorRef.current;
    if (editor) {
      editor.addEventListener("mouseup", checkFormats);
      editor.addEventListener("keyup", checkFormats);
      document.addEventListener("selectionchange", checkFormats);
    }

    return () => {
      if (editor) {
        editor.removeEventListener("mouseup", checkFormats);
        editor.removeEventListener("keyup", checkFormats);
        document.removeEventListener("selectionchange", checkFormats);
      }
    };
  }, []);

  useEffect(() => {
    const handleContentChange = () => {
      if (editorRef.current && onContentChange) {
        const updatedHTML = editorRef.current.innerHTML;

        setTimeout(() => {
          onContentChange(updatedHTML); 
        }, 0);
      }
    };

    const editor = editorRef.current;
    if (editor) {
      editor.addEventListener("input", handleContentChange);
    }

    return () => {
      if (editor) {
        editor.removeEventListener("input", handleContentChange);
      }
    };
  }, [onContentChange]);

  useEffect(() => {
    const updateText = () => {
      if (editorRef.current && editorContent) {
        editorRef.current.innerHTML = editorContent;
      }
    };
    updateText();
  }, []);

  return (
    <>
      <div className={styles.editorToolbar}>
        <div className={styles.ColorPickerContainer}>
          <button
            className={styles.colorPicker}
            onClick={() => {
              const selection = window.getSelection();
              const range = selection.getRangeAt(0);
              setSelectedRange(range);
              setColorPickerVisible(!colorPickerVisible);
            }}
          >
            <div>
              A
              <div
                style={{
                  backgroundColor: selectedColor,
                  width: "20px",
                  height: "4px",
                }}
              />
            </div>
            <ArrowDown />
          </button>

          {colorPickerVisible && (
            <div className={styles.colorOptions}>
              {colors.map((color) => (
                <div
                  key={color}
                  onClick={(e) => {
                    e.stopPropagation();

                    if (selectedRange) {
                      const selectedContents = selectedRange.extractContents();
                      const span = document.createElement("span");
                      span.style.color = color;

                      const existingSpans =
                        selectedContents.querySelectorAll("span");
                      if (existingSpans.length > 0) {
                        existingSpans.forEach((span) => {
                          span.style.color = color;
                        });
                      } else {
                        span.appendChild(selectedContents);
                        selectedRange.insertNode(span);
                      }
                    }

                    setSelectedColor(color);
                    setColorPickerVisible(false);
                    onContentChange(editorRef.current.innerHTML);
                  }}
                  style={{
                    backgroundColor: color,
                    width: "15px",
                    height: "15px",
                    cursor: "pointer",
                    border: "1px solid #ccc",
                    display: "inline-block",
                    margin: "2px",
                  }}
                />
              ))}
            </div>
          )}
        </div>

        <select
          onChange={(e) => {
            const size = e.target.value;
            const editor = editorRef.current;
            const selection = window.getSelection();
            const range = selection.getRangeAt(0);
            const span = document.createElement("span");
            span.style.fontSize = size;

            const content = range.extractContents();
            span.appendChild(content);
            range.insertNode(span);

            setTextFormat((prev) => ({ ...prev, fontSize: size }));
          }}
          className={styles.formatBtn}
          value={textFormat.fontSize}
        >
          <option value="12px">12px</option>
          <option value="14px">14px</option>
          <option value="16px">16px</option>
          <option value="18px">18px</option>
          <option value="20px">20px</option>
        </select>

        <select
          onChange={(e) => {
            document.execCommand("fontName", false, e.target.value);
            setTextFormat((prev) => ({ ...prev, fontFamily: e.target.value }));
          }}
          className={styles.formatBtn}
          value={textFormat.fontFamily}
        >
          <option value="Arial">Arial</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Calibri">Calibri</option>
          <option value="Helvetica">Helvetica</option>
          <option value="Verdana">Verdana</option>
        </select>

        <div className={styles.buttonGroup}>
          {formatButtons.map(({ type, icon }) => (
            <button
              key={type}
              onClick={(e) => handleFormat(type, e)}
              className={`${styles.formatBtn} ${textFormat[type] ? styles.active : ""}`}
            >
              <img src={icon} alt={type} />
            </button>
          ))}
        </div>

        <div className={styles.buttonGroup}>
          {alignButtons.map(({ type, icon }) => (
            <button
              key={type}
              onClick={(e) => handleFormat(type, e)}
              className={`${styles.formatBtn} ${textFormat.align === type ? styles.active : ""}`}
            >
              <img src={icon} alt={type} />
            </button>
          ))}
        </div>

        <div className={styles.buttonGroup}>
          {listButtons.map(({ type, icon }) => (
            <button
              key={type}
              onClick={(e) => handleFormat(type, e)}
              className={`${styles.formatBtn} ${textFormat[type] ? styles.active : ""}`}
            >
              <img src={icon} alt={type} />
            </button>
          ))}
        </div>

        <div className={styles.buttonGroup}>
          {extraButtons.map(({ type, icon }) => (
            <button
              key={type}
              onClick={(e) => handleFormat(type, e)}
              className={`${styles.formatBtn} ${textFormat[type] ? styles.active : ""}`}
            >
              <img src={icon} alt={type} />
            </button>
          ))}
          <div>
            {showEmojiMenu && (
              <div
                ref={emojiMenuRef}
                className={styles.emojiMenu}
                style={{
                  top: "105px",
                  right: "30px",
                }}
              >
                {emojis.map((emoji, index) => (
                  <button
                    key={index}
                    onClick={() => handleEmojiClick(emoji)}
                    className={styles.emojiButton}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      <div
        ref={editorRef}
        className={styles.emailBody}
        contentEditable
        suppressContentEditableWarning
        onFocus={() => {
          if (editorRef.current.textContent === "") {
            editorRef.current.textContent = "";
          }
          const selection = window.getSelection();
          if (selection.rangeCount > 0) {
          }
        }}
      />
    </>
  );
};

export default Toolbar;
