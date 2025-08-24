import React, { useState, useEffect, useRef } from "react";
import styles from "./AssetLine.module.css";
import { ReactComponent as GrabIcon } from "../../assets/grabIcon.svg";
import { ReactComponent as UpdateIcon } from "../../assets/updateIcon.svg";
import { ReactComponent as CheckedAssetLine } from "../../assets/checkedAssetLine.svg";
import { ReactComponent as TitleFileIcon } from "../../assets/titleFileIcon.svg";
import { ReactComponent as ClipIcon } from "../../assets/clipIcon.svg";
import { ReactComponent as TitleFileThirdIcon } from "../../assets/titleFileThirdIcon.svg";
import { ReactComponent as PencilFileIcon } from "../../assets/pencilFileIcon.svg";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Button from "../Button/Button";
import { resizeImage } from "../../../../utils/resizeImage";
import ChangeImage from "../ChangeImage/ChangeImage";
import { setAsset, setFatherNewAsset, setIdFatherNewAsset } from "@src/slices/assetsSlices";
import { createAsset, updateAsset } from "../../../../actions/assets";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import NewTag from "../NewTag/NewTag";

const AssetLine = ({
  article,
  id,
  handleInputChange,
  taxQuantity,
  editingTax,
  editingDiscount,
  discountQuantity,
  expanded,
  toggleExpanded,
  index,
  endItem,
  indexSelected,
  setUpdate,
  update
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id,
    });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();
  const [t] = useTranslation("InfoBill");

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [imageAsset, setImageAsset] = useState(null);
  const placeholder = "0,00"
  const [copyClipboard, setCopyclipboard] = useState(false)
  const [editingFileTitle, setEditingFileTitle] = useState(false)
  const [showAddTags, setShowAddTags] = useState(false);
  const [selectedTags, setSelectedTags] = useState(article.selectedTags || []);
  const [tags, setTags] = useState(article.tags || []);
  const inputTitleFile = useRef(null)


  useEffect(() => {
    handleInputChange(id, "tags", tags, index)
  }, [tags])

  useEffect(() => {
    handleInputChange(id, "selectedTags", selectedTags, index)
  }, [selectedTags])




  useEffect(() => {
    if (editingFileTitle && inputTitleFile.current) {
      inputTitleFile.current.focus();
    }
  }, [editingFileTitle]);

  const handleBtnsActions = (type) => {
    if (!article) return;
    switch (type) {
      case 'clipboard':
        let initialPath = (window.location.href).split("panel").slice(0, 1).join("")
        initialPath = `${initialPath}assets/${id}`
        navigator.clipboard.writeText(initialPath)
        setCopyclipboard(true)
        setTimeout(() => {
          setCopyclipboard(false)
        }, 5000);
        break;

      case "inputFileTitle":
        setEditingFileTitle((prev) => !prev)
        break;
      default:
        console.warn('Tipo de acción no reconocido:', type);
    }
  };

  const handleUpdateAsset = () => {
    let action;
    if (article._id) {
      action = dispatch(updateAsset({
        id: article?._id,
        assetData: article,
      }));
    } else {
      action = dispatch(createAsset({
        assetData: article,
      }));
    }
  }




  useEffect(() => {
    editingTax && handleInputChange(id, "taxQuantity", taxQuantity)
  }, [taxQuantity])

  useEffect(() => {
    editingDiscount && handleInputChange(id, "DiscountQuantity", discountQuantity)
  }, [discountQuantity])

  useEffect(() => {
    article.image && setImageAsset(article.image)
  }, [])



  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const resizedImage = await resizeImage(file);
      const imageUrl = URL.createObjectURL(resizedImage);

      setImageAsset(imageUrl);

    } catch (error) {
      console.error("Error al procesar la imagen:", error);
    }
  };

  return (
    <div ref={setNodeRef} style={style} className={styles.AssetLine}>
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "transparent",
          cursor: "pointer",
          backgroundColor: "rgba(0, 0, 0, 0.001)",
        }}

      >
        <div className={styles.articleTitle}>
          <span></span>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
          </div>
        </div>
        <div>
          <div
            className={styles.articleBody}
            style={
              endItem == 0
                ? { border: "1px solid #EAECF0", borderRadius: "16px" }
                : expanded && index == 0
                  ? { border: "1px solid #EAECF0", borderRadius: "16px" }
                  : expanded
                    ? {
                      border: "1px solid #EAECF0",
                      borderBottomRightRadius: "16px",
                      borderBottomLeftRadius: "16px",
                    }
                    : indexSelected !== null &&
                      indexSelected + 1 == index &&
                      index == endItem
                      ? { border: "1px solid #EAECF0", borderRadius: "16px" }
                      : indexSelected !== null && indexSelected + 1 == index
                        ? {
                          border: "1px solid #EAECF0",
                          borderTopRightRadius: "16px",
                          borderTopLeftRadius: "16px",
                        }
                        : index == 0
                          ? {
                            border: "1px solid #EAECF0",
                            borderTopRightRadius: "16px",
                            borderTopLeftRadius: "16px",
                          }
                          : index == endItem
                            ? {
                              border: "1px solid #EAECF0",
                              borderBottomRightRadius: "16px",
                              borderBottomLeftRadius: "16px",
                            }
                            : { borderBottom: "1px solid #EAECF0" }
            }
          >
            <div className={styles.grab}>
              <button {...attributes} {...listeners}>
                <GrabIcon
                  className={styles.icon}
                  {...attributes}
                  {...listeners}
                />
              </button>
            </div>
            <div className={styles.info}>
              <div className={styles.test}>
                <div className={styles.leftInfo}>
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <ChangeImage
                      imageAsset={imageAsset}
                      setImageAsset={setImageAsset}
                      article={article}
                      customStyle={{ width: "40px", height: "40px" }}
                    />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column" }}>


                    <input
                      style={{
                        fontWeight: "bold",
                        color: "black",
                        background: "white",
                        width: "fit-content",
                      }}
                      value={article.name}
                      onChange={(e) =>
                        handleInputChange(id, "name", e.target.value, index)
                      }
                      placeholder={t("article")}
                    />
                    <textarea
                      style={{ background: "white", color: "#666666" }}
                      className={styles.light}
                      value={article.description}
                      onChange={(e) =>
                        handleInputChange(
                          id,
                          "description",
                          e.target.value,
                          index
                        )
                      }
                      placeholder={t("description")}
                    ></textarea>
                  </div>
                </div>
                <div className={styles.textRight}>
                  {update === index && <span> No guardado </span>}
                </div>
                <div className={styles.row3}>
                  <div className={styles.row3Left}>
                    <label style={{ margin: "0" }}>Cant.</label>
                    <input
                      className={styles.input}
                      onChange={(e) =>
                        handleInputChange(id, "amount", e.target.value, index)
                      }
                      type="text"
                      name=""
                      id=""
                      value={article.amount}
                      placeholder={"1"}
                      style={{
                        background: "white",
                        width: "35px",
                        color: "#717171",
                      }}
                    />
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "start",
                        alignItems: "center",
                      }}
                    >
                      <input
                        className={styles.input}
                        onChange={(e) =>
                          handleInputChange(
                            id,
                            "baseImport",
                            e.target.value,
                            index
                          )
                        }
                        type="text"
                        name=""
                        id="miInput"
                        value={article.baseImport}
                        placeholder={placeholder}
                        style={{
                          background: "white",
                          width: "35px",
                          color: "#717171",
                          padding: "0px",
                        }}
                      />
                      <span style={{ color: "#717171", fontSize: "14px" }}>
                        {"€"}
                      </span>
                    </div>
                  </div>
                  <Button
                    type="white"
                    headerStyle={{
                      textDecoration: "none",
                      border: "none",
                      color: "#717171",
                      fontSize: "14px",
                    }}
                    action={(e) => {
                      e.stopPropagation();
                      handleUpdateAsset();
                      setUpdate(false);
                    }}
                  >
                    {update === index ? (
                      <>
                        Actualizar <UpdateIcon />
                      </>
                    ) : (
                      <>
                        Guardado <CheckedAssetLine />
                      </>
                    )}
                  </Button>
                </div>

                <div>
                  <Button
                    type="white"
                    headerStyle={{
                      textDecoration: "none",
                      border: "none",
                      color: "#717171",
                      fontSize: "14px",
                      paddingLeft: " 0px",
                    }}
                    action={(e) => {
                      e.stopPropagation();
                      toggleExpanded();
                    }}
                  >
                    {t("seeParameters")}
                  </Button>
                </div>

              </div>
            </div>
          </div>
          <div
            className={`${styles.expandContainer} ${expanded ? styles.open : ""}`}
          >
            <div className={styles.expandContentRow1}>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <ChangeImage
                  imageAsset={imageAsset}
                  setImageAsset={setImageAsset}
                  article={article}
                  customStyle={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "8px",
                  }}
                />
              </div>
              <div className={styles.fileInfo}>
                <input
                  type="text"
                  placeholder={t("fileTitle")}
                  value={article?.fileTitle}
                  disabled={!editingFileTitle}
                  ref={inputTitleFile}
                  onBlur={() => handleBtnsActions("inputFileTitle")}
                  onChange={(e) => {
                    handleInputChange(
                      id,
                      "fileTitle",
                      e.target.value,
                      index
                    )
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleBtnsActions("inputFileTitle");

                    }
                  }}
                />
                <TitleFileIcon onClick={() => handleBtnsActions("inputFileTitle")} className={editingFileTitle && styles.activeBtn} />
              </div>

              <ClipIcon onClick={() => handleBtnsActions("clipboard")} className={copyClipboard && styles.activeBtn} />

              <TitleFileThirdIcon onClick={() => { setShowAddTags(true); }} />
              <PencilFileIcon onClick={() => {
                dispatch(setAsset(article));
                dispatch(setFatherNewAsset('panelWithAsset'));
                dispatch(setIdFatherNewAsset(params.id))
                navigate(`/admin/assets/${article._id}`, { state: { backgroundLocation: location } });
              }} />
            </div>
            <div className={styles.expandContentRow2}>
              <Button
                action={(e) => {
                  e.stopPropagation();
                  handleUpdateAsset();
                  setUpdate(false);
                }}
                headerStyle={{ width: "100%", height: "40px" }}
              >
                Guardar activo
              </Button>
            </div>
          </div>
        </div>

      </div>
      {showAddTags && (
        <NewTag customStyleAssetLine={{ width: "15px", height: "15px" }}
          setShowNewTagModal={setShowAddTags}
          setSelectedTags={setSelectedTags}
          selectedTags={selectedTags}
          setTags={setTags}
          tags={tags}
        />
      )}
    </div>
  );
};

export default AssetLine;
