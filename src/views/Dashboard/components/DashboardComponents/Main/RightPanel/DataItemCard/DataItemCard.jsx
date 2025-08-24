import React, { useState } from "react";
import styles from "./DataItemCard.module.css";
import ImageEmpty from "../../../../../assets/ImageEmpty.svg";
import { ReactComponent as OptionDots } from "../../../../../assets/optionDots.svg";
import { ReactComponent as GreenMailIcon } from "../../../../../assets/greenMailIcon.svg";
import { ReactComponent as GreenWebIcon } from "../../../../../assets/greenWebIcon.svg";
import { ReactComponent as GreenPhoneIcon } from "../../../../../assets/greenPhoneIcon.svg";
import { ReactComponent as GrayTagIcon } from "../../../../../assets/tagNewIcon.svg";
import { ReactComponent as PdfIcon2 } from "../../../../../assets/pdfIcon2.svg";
import { ReactComponent as GreenCopyIcon } from "../../../../../assets/greenCopyIcon.svg";
import Button from "../../../../Button/Button";

const DataItemCard = ({
  data,
  type = "contact", // "contact", "asset", o "doc"
  onCopy,
  onAddTags,
  onPhoneClick,
  onWebClick,
  onEmailClick,
  onRemoveTag,
  onOptionsClick,
  showPercentage = true,
  showTransactions = true,
  customFields = {},
  className = "",
}) => {
  const [copyClipboard, setCopyClipboard] = useState(false);
  const [showAddTags, setShowAddTags] = useState(false);

  // Función para aclarar colores de tags
  const aclararColor = (hex, porcentaje = 0.7) => {
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);

    r = Math.round(r + (255 - r) * porcentaje);
    g = Math.round(g + (255 - g) * porcentaje);
    b = Math.round(b + (255 - b) * porcentaje);

    return `rgb(${r}, ${g}, ${b})`;
  };

  // Obtener campos según el tipo
  const getDisplayName = () => {
    if (type === "contact") return data.contactName;
    if (type === "asset") return data.assetName || data.name;
    if (type === "doc") return data.documentTitle || data.name || "Sin nombre";
    return data.name || "Sin nombre";
  };

  const getImage = () => {
    if (type === "contact") return data.image;
    if (type === "asset") return data.image || data.icon;
    if (type === "doc") return data.docIcon || data.icon || data.image;
    return data.image;
  };

  const getTags = () => {
    return data.selectedTags || data.tags || [];
  };

  const getPhone = () => {
    if (type === "contact") return data.companyPhoneNumber;
    if (type === "asset") return data.phone || data.contactPhone;
    return data.phone;
  };

  const getWebsite = () => {
    if (type === "contact") return data.webSite;
    if (type === "asset") return data.website || data.webSite;
    return data.website;
  };

  const getEmail = () => {
    if (type === "contact") return data.companyEmail;
    if (type === "asset") return data.email || data.contactEmail;
    return data.email;
  };

  const getPercentage = () => {
    return data.percentage || 0;
  };

  const getTransactions = () => {
    if (type === "contact") return data.transactions || 0;
    if (type === "asset") return data.usage || 0;
    return 0;
  };

  const getTotal = () => {
    if (type === "contact") return data.total || 0;
    if (type === "asset") return data.value || 0;
    return 0;
  };

  const handleCopy = () => {
    if (onCopy) {
      onCopy(data);
    }
    setCopyClipboard(true);
    setTimeout(() => setCopyClipboard(false), 2000);
  };

  const handleAddTags = () => {
    if (onAddTags) {
      onAddTags(data);
    } else {
      setShowAddTags(true);
    }
  };

  const handleRemoveTag = (tagIndex) => {
    if (onRemoveTag) {
      onRemoveTag(data, tagIndex);
    }
  };

  // Renderizado condicional para el header según el tipo
  const renderHeader = () => {
    if (type === "doc") {
      return (
        <div className={styles.header}>
          <div className={styles.headerInfo}>
            <PdfIcon2 />
            <div>
              <h3>{getDisplayName()}</h3>
              <div className={styles.headerInfoText}>
                <span>Factura</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Header original para contact y asset
    return (
      <div className={styles.header}>
        <div className={styles.headerInfo}>
          <img
            src={getImage() || ImageEmpty}
            alt={type === "contact" ? "contacto" : "activo"}
          />
          <div>
            <h3>{getDisplayName()}</h3>
            <div className={styles.headerInfoText}>
              {showTransactions && (
                <span>
                  # {type === "contact" ? "Transacciones" : "Usos"}{" "}
                  <strong>{getTransactions()}</strong>
                </span>
              )}{" "}
              <span>
                Total <strong>{getTotal()}</strong>
              </span>
            </div>
          </div>
        </div>
        <OptionDots
          style={{ transform: "rotate(90deg)", cursor: "pointer" }}
          onClick={() => onOptionsClick && onOptionsClick(data)}
        />
      </div>
    );
  };

  return (
    <div className={`${styles.dataItemCard} ${className}`}>
      {renderHeader()}

      {/* Tags Container - solo mostrar si no es doc */}
      {type !== "doc" && (
        <div className={styles.tagsContainer}>
          {getTags().map((tag, idx) => {
            const backgroundColorClaro = aclararColor(
              tag.color || "#cccccc",
              0.7
            );

            return (
              <span
                key={tag.id || idx}
                className={styles.tagItem}
                style={{
                  backgroundColor: backgroundColorClaro,
                  color: tag.color,
                }}
              >
                <p
                  style={{
                    marginRight: "6px",
                    fontWeight: "bold",
                    color: tag.color,
                  }}
                >
                  {tag.name}
                </p>
                <span
                  onClick={() => handleRemoveTag(idx)}
                  className={styles.removeTag}
                >
                  ×
                </span>
              </span>
            );
          })}
        </div>
      )}

      {/* Footer - mostrar completo si no es doc, solo porcentaje si es doc */}
      {type === "doc" ? (
        <div className={styles.docFooter}>
          pagado
          {showPercentage && (
            <div className={styles.percentageContainer}>
              <div className={styles.percentageText}>
                {getTotal()}€ - {getTotal()}€ ({getPercentage()}%)
              </div>
              <div className={styles.percentageBar}>
                <div
                  className={styles.percentageFill}
                  style={{ width: `${getPercentage()}%` }}
                ></div>
              </div>
            </div>
          )}{" "}
        </div>
      ) : (
        // Footer completo para contact y asset
        <div className={styles.footer}>
          <div className={styles.buttonContainer}>
            <Button action={handleCopy}>
              <GreenCopyIcon className={copyClipboard && styles.activeBtn} />
            </Button>
            <Button action={handleAddTags}>
              <GrayTagIcon className={showAddTags && styles.activeBtn} />
            </Button>

            {getPhone()?.length > 0 && (
              <Button
                type="border"
                action={() => onPhoneClick && onPhoneClick(data)}
              >
                <GreenPhoneIcon />
              </Button>
            )}

            {getWebsite() && (
              <Button
                type="border"
                action={() => onWebClick && onWebClick(data)}
              >
                <GreenWebIcon />
              </Button>
            )}

            {getEmail() && (
              <Button
                type="border"
                action={() => onEmailClick && onEmailClick(data)}
              >
                <GreenMailIcon />
              </Button>
            )}
          </div>

          {/* Percentage Bar */}
          {showPercentage && (
            <div className={styles.percentageContainer}>
              <div className={styles.percentageText}>
                {getTotal()}€ - {getTotal()}€ ({getPercentage()}%)
              </div>
              <div className={styles.percentageBar}>
                <div
                  className={styles.percentageFill}
                  style={{ width: `${getPercentage()}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DataItemCard;
