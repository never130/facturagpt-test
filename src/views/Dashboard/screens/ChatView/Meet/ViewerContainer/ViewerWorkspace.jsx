import React from 'react';
import styles from './ViewerWorkspace.module.css';
import svgPaths from './imports/svg-tdhjefpbew.ts';

// Componente para el hover de upload
const UploadHover = () => (
  <div className={styles.uploadHover} data-name="Upload Hover" />
);

// Componente para el avatar con opciones
const ImageAvatarWithOptions = () => (
  <div className={styles.imageAvatar} data-name="Image / Avatar With Options">
    <div className={styles.imageEmpty} data-name="Image Empty">
      <svg
        className={styles.imageEmptySvg}
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 67 67"
      >
        <g id="Image Empty">
          <path
            clipRule="evenodd"
            d={svgPaths.p1a7ab600}
            fill="var(--fill-0, #D5D7DB)"
            fillRule="evenodd"
          />
          <path d={svgPaths.p2b9e9400} fill="black" />
        </g>
      </svg>
    </div>
    <UploadHover />
  </div>
);

// Componente para el icono de estrella
const StarIcon = () => (
  <div className={styles.starIcon}>
    <svg
      className={styles.starSvg}
      fill="none"
      preserveAspectRatio="none"
      viewBox="0 0 16 16"
    >
      <g>
        <path
          d={svgPaths.p2e755ec0}
          fill="var(--fill-0, #FFCC00)"
        />
      </g>
    </svg>
  </div>
);

// Componente para el icono verificado
const VerifiedIcon = () => (
  <div className={styles.verifiedIcon}>
    <svg
      className={styles.starSvg}
      fill="none"
      preserveAspectRatio="none"
      viewBox="0 0 12 12"
    >
      <g>
        <path
          d={svgPaths.p1e083840}
          fill="var(--fill-0, #10A37F)"
          stroke="var(--stroke-0, #10A37F)"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  </div>
);

// Componente para el icono de editar
const EditIcon = () => (
  <div className={styles.editIcon}>
    <svg
      className={styles.starSvg}
      fill="none"
      preserveAspectRatio="none"
      viewBox="0 0 13 13"
    >
      <g>
        <path
          d={svgPaths.p20854400}
          fill="var(--fill-0, #8E8E93)"
        />
      </g>
    </svg>
  </div>
);

// Componente para el icono de más opciones
const MoreIcon = () => (
  <div className={styles.moreIcon}>
    <svg
      className={styles.starSvg}
      fill="none"
      preserveAspectRatio="none"
      viewBox="0 0 14 14"
    >
      <g>
        <path
          d={svgPaths.p173d3600}
          stroke="var(--stroke-0, black)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.16667"
        />
        <path
          d={svgPaths.p3a793800}
          stroke="var(--stroke-0, black)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.16667"
        />
        <path
          d={svgPaths.p37fa4800}
          stroke="var(--stroke-0, black)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.16667"
        />
      </g>
    </svg>
  </div>
);

// Componente para el icono de candado
const LockIcon = () => (
  <div className={styles.lockIcon}>
    <svg
      className={styles.lockSvg}
      fill="none"
      preserveAspectRatio="none"
      viewBox="0 0 7 9"
    >
      <path
        d={svgPaths.p2ad89200}
        fill="var(--fill-0, #71717A)"
        id="Icon/Lock"
      />
    </svg>
  </div>
);

// Componente para el icono de base de datos
const DatabaseIcon = () => (
  <div className={styles.databaseIcon}>
    <svg
      className={styles.starSvg}
      fill="none"
      preserveAspectRatio="none"
      viewBox="0 0 14 14"
    >
      <g>
        <path
          d={svgPaths.p6225000}
          stroke="var(--stroke-0, #71717A)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="10"
          strokeWidth="1.5"
        />
        <path
          d={svgPaths.p2447fa97}
          stroke="var(--stroke-0, #71717A)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="10"
          strokeWidth="1.5"
        />
        <path
          d={svgPaths.p49bf580}
          stroke="var(--stroke-0, #71717A)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="10"
          strokeWidth="1.5"
        />
      </g>
    </svg>
  </div>
);

// Componente para el icono de respuestas (16px)
const ResponseIcon16 = () => (
  <div className={styles.responseIcon}>
    <svg
      className={styles.starSvg}
      fill="none"
      preserveAspectRatio="none"
      viewBox="0 0 16 16"
    >
      <g>
        <path
          clipRule="evenodd"
          d={svgPaths.p2bfd3700}
          fill="var(--fill-0, #666666)"
          fillRule="evenodd"
        />
      </g>
    </svg>
  </div>
);

// Componente para el icono de workflows (16px)
const WorkflowIcon16 = () => (
  <div className={styles.responseIcon}>
    <svg
      className={styles.starSvg}
      fill="none"
      preserveAspectRatio="none"
      viewBox="0 0 16 16"
    >
      <g>
        <path
          clipRule="evenodd"
          d={svgPaths.p25d6ab80}
          fill="var(--fill-0, #666666)"
          fillRule="evenodd"
        />
      </g>
    </svg>
  </div>
);

// Componente para el icono de respuestas (15px)
const ResponseIcon15 = () => (
  <div className={styles.responseIcon15}>
    <svg
      className={styles.starSvg}
      fill="none"
      preserveAspectRatio="none"
      viewBox="0 0 15 15"
    >
      <g>
        <path
          clipRule="evenodd"
          d={svgPaths.p2aa9c4a0}
          fill="var(--fill-0, #666666)"
          fillRule="evenodd"
        />
        <g clipPath="url(#clip0_1_168)">
          <path
            d={svgPaths.p17773000}
            fill="var(--fill-0, #666666)"
            stroke="var(--stroke-0, #666666)"
            strokeWidth="0.15"
          />
        </g>
      </g>
      <defs>
        <clipPath id="clip0_1_168">
          <rect
            fill="white"
            height="7"
            transform="translate(8 8)"
            width="7"
          />
        </clipPath>
      </defs>
    </svg>
  </div>
);

// Componente para el icono de workflows (15px)
const WorkflowIcon15 = () => (
  <div className={styles.workflowIcon}>
    <svg
      className={styles.starSvg}
      fill="none"
      preserveAspectRatio="none"
      viewBox="0 0 15 15"
    >
      <g>
        <path
          d={svgPaths.p382a2100}
          stroke="var(--stroke-0, #666666)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
      </g>
    </svg>
  </div>
);

// Componente para el icono de rating (18px)
const RatingIcon18 = () => (
  <div className={styles.ratingIcon18}>
    <svg
      className={styles.starSvg}
      fill="none"
      preserveAspectRatio="none"
      viewBox="0 0 18 18"
    >
      <g>
        <path
          d={svgPaths.p2f62bd00}
          fill="var(--fill-0, #FFCC00)"
        />
      </g>
    </svg>
  </div>
);

// Componente principal
const WorkspaceCard = () => {
  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        <div className={styles.mainContent}>
          {/* Sección del header */}
          <div className={styles.headerSection}>
            <div className={styles.headerInner}>
              <div className={styles.headerContent}>
                <div className={styles.mainInfo}>
                  <div className={styles.avatarContainer}>
                    <ImageAvatarWithOptions />
                  </div>
                  <div className={styles.workspaceInfo}>
                    <div className={styles.workspaceNameContainer}>
                      <div className={styles.workspaceName}>
                        <p className={styles.workspaceNameText}>
                          Nombre del Workspace
                        </p>
                      </div>
                    </div>
                    <div className={styles.roleInfo}>
                      <div className={styles.roleText}>
                        <p className={styles.roleSpan}>
                          <span className={styles.roleSpan}>(Tú) </span>
                          Rol disponible
                        </p>
                      </div>
                    </div>
                    <div className={styles.metaInfo}>
                      <div className={styles.publicLabel}>
                        <p className={styles.publicText}>Público</p>
                      </div>
                      <div className={styles.privateContainer}>
                        <LockIcon />
                        <div className={styles.publicLabel}>
                          <p className={styles.publicText}>Privado</p>
                        </div>
                      </div>
                      <div className={styles.categoryLabel}>
                        <p className={styles.workspaceNameText}>
                          Categoría
                        </p>
                      </div>
                      <div className={styles.ratingUsersContainer}>
                        <div className={styles.starContainer}>
                          <StarIcon />
                          <div className={styles.ratingText}>
                            <p className={styles.workspaceNameText}>4.5</p>
                          </div>
                        </div>
                        <div className={styles.usersLabel}>
                          <p className={styles.publicText}>
                            Usado por 99 usuarios
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.actionsSection}>
                  <div className={styles.actionButtons}>
                    <div className={styles.authorContainer}>
                      <div className={styles.authorInfo}>
                        <div className={styles.authorName}>
                          <p className={styles.publicText}>Aythen</p>
                        </div>
                        <VerifiedIcon />
                      </div>
                      <div className={styles.timeLabel}>
                        <p className={styles.workspaceNameText}>
                          Hace un año
                        </p>
                      </div>
                    </div>
                    <div className={styles.editButton}>
                      <div className={styles.editButtonBorder} />
                      <div className={styles.editButtonContent}>
                        <EditIcon />
                        <div className={styles.editText}>
                          <p className={styles.publicText}>Editar</p>
                        </div>
                      </div>
                    </div>
                    <div className={styles.moreButton}>
                      <div className={styles.editButtonBorder} />
                      <MoreIcon />
                    </div>
                  </div>
                  <div className={styles.tagContainer}>
                    <div className={styles.tagText}>
                      <p className={styles.publicText}>Etiqueta 1</p>
                    </div>
                    <div className={styles.closeButton}>
                      <div className={styles.closeText}>
                        <p className={styles.publicText}>×</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sección de estadísticas */}
          <div className={styles.statsSection}>
            <div className={styles.statsSectionInner}>
              <div className={styles.statsBorder} />
              <div className={styles.statsContent}>
                <div className={styles.statsContainer}>
                  <div className={styles.statsRow}>
                    <div className={styles.statsItemsRow}>
                      <div className={styles.statItem}>
                        <div className={styles.statBadgeContainer}>
                          <div className={styles.statBadge}>
                            <div className={styles.statValue}>
                              <p className={styles.statValueText}>
                                <span className={styles.statCountText}>(10)</span>
                                <span className={styles.statValueText}>9.999</span>
                              </p>
                            </div>
                            <DatabaseIcon />
                          </div>
                        </div>
                      </div>
                      <div className={styles.statItem}>
                        <div className={styles.statBadgeContainer}>
                          <div className={styles.statBadge}>
                            <div className={styles.statValue}>
                              <p className={styles.statValueText}>
                                <span className={styles.statCountText}>(2)</span>
                                <span className={styles.statValueText}>99</span>
                              </p>
                            </div>
                            <ResponseIcon16 />
                          </div>
                        </div>
                      </div>
                      <div className={styles.statItem}>
                        <div className={styles.statBadgeContainer}>
                          <div className={styles.statBadge}>
                            <div className={styles.statValue}>
                              <p className={styles.statValueText}>
                                <span className={styles.statCountText}>(5)</span>
                                <span className={styles.statValueText}>99</span>
                              </p>
                            </div>
                            <WorkflowIcon16 />
                          </div>
                        </div>
                      </div>
                      <div className={styles.statItem}>
                        <div className={styles.statLabel}>
                          <p className={styles.publicText}>Respuestas programadas: </p>
                        </div>
                        <div className={styles.statBadgeContainer}>
                          <div className={styles.statBadge}>
                            <div className={styles.statValue}>
                              <p className={styles.statValueText}>99</p>
                            </div>
                            <ResponseIcon15 />
                          </div>
                        </div>
                      </div>
                      <div className={styles.statItem}>
                        <div className={styles.statLabel}>
                          <p className={styles.publicText}>Workflows:</p>
                        </div>
                        <div className={styles.statBadgeContainer}>
                          <div className={styles.statBadge}>
                            <div className={styles.statValue}>
                              <p className={styles.statValueText}>99</p>
                            </div>
                            <WorkflowIcon15 />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.buttonSection}>
                  <div className={styles.buttonsRow}>
                    <div className={styles.primaryButton}>
                      <div className={styles.buttonText}>
                        <p className={styles.buttonTextWhite}>Save Workspace</p>
                      </div>
                    </div>
                    <div className={styles.secondaryButton}>
                      <div className={styles.secondaryButtonBorder} />
                      <div className={`${styles.buttonText} ${styles.buttonTextDark}`}>
                        <p className={styles.buttonTextWhite}>Buy Workspace</p>
                      </div>
                      <div className={styles.priceBadgeContainer}>
                        <div className={styles.priceBadge}>
                          <div className={`${styles.statValue} ${styles.priceText}`}>
                            <p className={styles.statValueText}>Precio</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={styles.ratingSection}>
                      <div className={styles.rateButton}>
                        <div className={styles.rateButtonBorder} />
                        <div className={styles.rateButtonText}>
                          <p className={styles.rateButtonTextSpan}>Valorar</p>
                        </div>
                        <div className={styles.ratingContainer18}>
                          <RatingIcon18 />
                          <div className={styles.statValue}>
                            <p className={styles.statValueText}>4.5</p>
                          </div>
                        </div>
                      </div>
                      <div className={styles.ratingValue}>
                        <div className={styles.ratingValueText}>
                          <p className={styles.ratingValueSpan}>(4.5)</p>
                        </div>
                        <div className={styles.starsContainer}>
                          {Array.from({ length: 4 }, (_, i) => (
                            <div key={i} className={styles.starItem}>
                              <div className={styles.starInner}>
                                <svg
                                  className={styles.starSvgLarge}
                                  fill="none"
                                  preserveAspectRatio="none"
                                  viewBox="0 0 32 32"
                                >
                                  <g>
                                    <path
                                      d={svgPaths.p21f9a2f0}
                                      fill="var(--fill-0, #FFCC00)"
                                      stroke="var(--stroke-0, #E3E3E3)"
                                    />
                                  </g>
                                </svg>
                              </div>
                            </div>
                          ))}
                          <div className={styles.starItem}>
                            <div className={styles.starInner}>
                              <svg
                                className={styles.starSvgLarge}
                                fill="none"
                                preserveAspectRatio="none"
                                viewBox="0 0 32 32"
                              >
                                <g>
                                  <g>
                                    <path
                                      clipRule="evenodd"
                                      d={svgPaths.p15cef400}
                                      fill="var(--fill-0, #FFCC00)"
                                      fillRule="evenodd"
                                    />
                                    <path d={svgPaths.p13e5a900} stroke="var(--stroke-0, #E3E3E3)" />
                                  </g>
                                </g>
                              </svg>
                            </div>
                          </div>
                        </div>
                        <div className={styles.acceptButton}>
                          <div className={styles.rateButtonBorder} />
                          <div className={styles.rateButtonText}>
                            <p className={styles.rateButtonTextSpan}>Aceptar</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceCard;