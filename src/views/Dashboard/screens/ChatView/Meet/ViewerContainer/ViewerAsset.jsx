import svgPaths from "./imports/svg-7pib7k087v.ts";
// import { imgGroup } from "../imports/svg-xw2pb";
import styles from "./ViewerAsset.module.css";
import ToolbarSection from "./components/ToolbarSection";

// export const imgGroup = "data:image/svg+xml,%3Csvg%20preserveAspectRatio%3D%22none%22%20width%3D%22100%25%22%20height%3D%22100%25%22%20overflow%3D%22visible%22%20style%3D%22display%3A%20block%3B%22%20viewBox%3D%220%200%2015%2015%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%3Cg%20id%3D%22clip0_429_11046%22%3E%0A%3Cpath%20id%3D%22Vector%22%20d%3D%22M14.5455%200H0V14.5455H14.5455V0Z%22%20fill%3D%22var(--fill-0%2C%20black)%22%2F%3E%0A%3C%2Fg%3E%0A%3C%2Fsvg%3E%0A";

import { ReactComponent as IconPdf } from "./assets/icon-pdf.svg";
import { ReactComponent as IconLock } from "./assets/icon-lock.svg";
import { ReactComponent as IconEdit } from "./assets/icon-edit.svg";
import { ReactComponent as IconCog } from "./assets/icon-cog.svg";
import { ReactComponent as IconMagic } from "./assets/icon-magic.svg";
import { ReactComponent as IconChernDown } from "./assets/icon-chern-down.svg";
import { ReactComponent as IconClose } from "./assets/icon-close.svg";
import { ReactComponent as IconStripe } from "./assets/icon-stripe.svg";



export default function ContactCard() {
  return (
        <div className={styles.cardContent}>
          
          {/* Header Section */}
          <div className={styles.headerSection}>
            <div className={styles.headerRow}>
              <div className={styles.headerContent}>
                
                {/* Left Content */}
                <div className={styles.leftContent}>
                  {/* Asset Icon */}
                  <div className={styles.assetIcon} />
                  
                  {/* Asset Info */}
                  <div className={styles.assetInfo}>
                    <div className={styles.assetTitleRow}>
                      <div className={styles.assetTitle}>
                        <p className={styles.assetTitleP}>Asset_name</p>
                      </div>
                    </div>
                    <div className={styles.assetDescription}>
                      <p className={styles.assetDescriptionP}>Descripción</p>
                    </div>
                    <div className={styles.assetType}>
                      <p className={styles.assetTypeP}>
                        Tipo de activo - Tipo de Categoría - Código
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Actions */}
                <div className={styles.rightActions}>
                  
                  {/* Price Section */}
                  <div className={styles.priceSection}>
                    <div className={styles.pvpLabel}>
                      <div className={styles.pvpText}>
                        <p className={styles.pvpTextP}>PVP</p>
                      </div>
                      <div className={styles.priceValue}>
                        <div className={styles.priceAmount}>
                          <p className={styles.priceAmountP}>0,00</p>
                        </div>
                        <div className={styles.priceCurrency}>
                          <p className={styles.priceCurrencyP}>EUR</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className={styles.actionButtons}>
                    <div className={styles.editButton}>
                      <div
                        aria-hidden="true"
                        className={styles.editButtonBorder}
                      />
                      <div className={styles.editButtonInner}>
                        {/* <EditIcon /> */}
                        <IconEdit />
                        <div className={styles.editText}>
                          <p className={styles.editTextP}>Editar</p>
                        </div>
                      </div>
                    </div>

                    <div className={styles.moreButton}>
                      <div
                        aria-hidden="true"
                        className={styles.moreButtonBorder}
                      />
                      {/* <MoreIcon /> */}
                      <IconCog />
                    </div>
                  </div>

                  {/* Etiqueta Badge */}
                  <div className={styles.etiquetaBadge}>
                    <div className={styles.etiquetaText}>
                      <p className={styles.etiquetaTextP}>Etiqueta 1</p>
                    </div>
                    <div className={styles.etiquetaClose}>
                      <div className={styles.etiquetaCloseText}>
                        <p className={styles.etiquetaCloseTextP}>×</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Toolbar Section */}
          <ToolbarSection />

          {/* Footer Info */}
          <div className={styles.footerInfo}>
                    <div className={styles.footerText}>
                      <div className={styles.footerItem}>
                        <p className={styles.footerItemP}>Proveedor: Tú</p>
                      </div>
                      <div className={styles.footerItem}>
                        <p className={styles.footerItemP}>Transacciones: 0</p>
                      </div>
                      <div className={styles.footerItem}>
                        <p className={styles.footerItemP}>Balance total: (0,00) - 0,00 EUR</p>
                      </div>
                    </div>
                  </div>
        </div>
  );
}