// import svgPaths from "./imports/svg-64jj3qqo0k.ts";
// import { imgGroup } from "../imports/svg-blj98";
import styles from "./ViewerContact.module.css";
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



export default function AythenCard() {
  return (
    <div className={styles.aythenCard}>
      <div className={styles.cardInner}>
        <div className={styles.cardContent}>

          {/* Header Section */}
          <div className={styles.headerSection}>
            <div className={styles.headerRow}>
              <div className={styles.headerContent}>

                {/* Left Content */}
                <div className={styles.leftContent}>
                  {/* Profile Icon */}
                  <div className={styles.profileIcon} />

                  {/* Profile Info */}
                  <div className={styles.profileInfo}>
                    <div className={styles.profileTitleRow}>
                      <div className={styles.profileTitle}>
                        <p className={styles.profileTitleP}>Aythen</p>
                      </div>
                    </div>
                    <div className={styles.profileDescription}>
                      <p className={styles.profileDescriptionP}>
                        Email address, Phone number, Zip code / Postcode, Country of residence
                      </p>
                    </div>
                    <div className={styles.profileType}>
                      <p className={styles.profileTypeP}>
                        Tipo de contacto - Número Fiscal
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Actions */}
                <div className={styles.rightActions}>

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
              <div className={styles.footerTransactions}>
                <p className={styles.footerTransactionsP}>
                  Transacciones: 0
                </p>
              </div>
              <div className={styles.footerBalance}>
                <p className={styles.footerBalanceP}>
                  Balance total: (0,00) - 0,00 EUR
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}