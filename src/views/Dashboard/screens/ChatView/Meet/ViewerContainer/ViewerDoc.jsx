import svgPaths from "./imports/svg-u18o0p3h7e.ts";
// import { imgGroup } from "./imports/svg-6bpco";
import styles from "./ViewerDoc.module.css";

import ToolbarSection from "./components/ToolbarSection";

import { ReactComponent as IconPdf } from "./assets/icon-pdf.svg";
import { ReactComponent as IconLock } from "./assets/icon-lock.svg";
import { ReactComponent as IconEdit } from "./assets/icon-edit.svg";
import { ReactComponent as IconCog } from "./assets/icon-cog.svg";
import { ReactComponent as IconMagic } from "./assets/icon-magic.svg";
import { ReactComponent as IconChernDown } from "./assets/icon-chern-down.svg";
import { ReactComponent as IconClose } from "./assets/icon-close.svg";
import { ReactComponent as IconStripe } from "./assets/icon-stripe.svg";

export default function App() {
  // <div className={styles.container}>
  //   <div className={styles.documentCard}>
  //     <div className={styles.cardInner}>
  //     </div>
  //   </div>
  // </div>
  return (
    <div className={styles.cardContent}>

      {/* Header Section */}
      <div className={styles.headerSection}>
        <div className={styles.headerRow}>
          <div className={styles.headerContent}>
            <div className={styles.headerInner}>

              {/* Left Content */}
              <div className={styles.leftContent}>
                <div className={styles.leftInner}>

                  {/* Title Row */}
                  <div className={styles.titleRow}>
                    {/* <DocumentIcon /> */}
                    <IconPdf />
                    <div className={styles.titleText}>
                      <p className={styles.titleTextP}>
                        Título del Documento
                      </p>
                    </div>
                  </div>

                  {/* Created info */}
                  <div className={styles.createdInfo}>
                    <div className={styles.createdText}>
                      <p className={styles.createdTextP}>
                        Creado el [date] a las [time] por [UserName]
                      </p>
                    </div>
                  </div>

                  {/* Categories and Status */}
                  <div className={styles.categoriesRow}>

                    {/* Seleccionar Categoría */}
                    <div className={styles.categoryDropdown}>
                      <div className={styles.categoryText}>
                        <p className={styles.categoryTextP}>Seleccionar Categoría</p>
                      </div>
                      {/* icon sparkle */}
                      <IconMagic />
                      
                      {/* <SparkleIcon /> */}
                      {/* <ArrowDownIcon /> */}
                    </div>

                    {/* Concepto */}
                    <div className={styles.conceptDropdown}>
                      <div className={styles.categoryText}>
                        <p className={styles.categoryTextP}>Concepto</p>
                      </div>
                      <IconChernDown />
                      {/* <ArrowDownIcon /> */}
                    </div>

                    {/* Pagado Badge */}
                    <div className={styles.pagadoBadge}>
                      <div className={styles.pagadoInner}>
                        {/* <StatusIcon /> */}
                        <div className={styles.statusIcon}></div>
                        <div className={styles.pagadoText}>
                          <p className={styles.pagadoTextP}>Pagado</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Action Buttons */}
              <div className={styles.actionButtons}>

                {/* Button Row */}
                <div className={styles.buttonRow}>
                  <div className={styles.buttonRowInner}>

                    {/* Aprobar documento button */}
                    <div className={styles.approveButton}>
                      <IconLock />
                      {/* icon lock */}
                      <div className={styles.approveText}>
                        <p className={styles.approveTextP}>
                          Aprobar documento
                        </p>
                      </div>
                    </div>

                    {/* Editar button */}
                    <div className={styles.editButton}>
                      <div
                        aria-hidden="true"
                        className={styles.editButtonBorder}
                      />
                      <div className={styles.editButtonInner}>
                        {/* icon edit */}
                        <IconEdit />
                        <div className={styles.editText}>
                          <p className={styles.editTextP}>Editar</p>
                        </div>
                      </div>
                    </div>

                    {/* More button */}
                    <div className={styles.moreButton}>
                      <div
                        aria-hidden="true"
                        className={styles.moreButtonBorder}
                      />
                      {/* <MoreIcon /> */}
                      <IconCog />
                    </div>
                  </div>
                </div>

                {/* Etiqueta 1 */}
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
      </div>

      {/* Toolbar Section */}
      <ToolbarSection />


      {/* Footer Info */}
      <div className={styles.footerInfo}>
        <div className={styles.footerRow}>
          <div className={styles.footerItem}>
            <p className={styles.footerItemP}>
              <span>Método de Pago: </span>
              <span className={styles.footerItemLight}>
                Mastercard ****5678
              </span>
            </p>
          </div>
          <div className={styles.footerItem}>
            <p className={styles.footerItemP}>
              <span>Contactos: </span>
              <span className={styles.footerItemLight}>
                0
              </span>
            </p>
          </div>
          <div className={styles.footerItem}>
            <p className={styles.footerItemP}>
              <span>Activos: </span>
              <span className={styles.footerItemLight}>
                0
              </span>
            </p>
          </div>
          <div className={styles.footerItem}>
            <p className={styles.footerItemP}>
              Balance total:
              <span className={styles.footerItemLight}> (0,00) - 0,00 EUR</span>
            </p>
          </div>
        </div>

        <div className={styles.footerBottomRow}>
          <div className={styles.stripeBadge}>
            <div className={styles.stripeIconContainer}>
              {/* <StripeIcon /> */}
              <IconStripe />
            </div>
          </div>
          <div className={styles.refundText}>
            <p className={styles.refundTextP}>
              Refund full price
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}