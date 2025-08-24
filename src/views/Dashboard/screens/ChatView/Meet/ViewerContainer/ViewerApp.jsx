import React from 'react';
import styles from './ViewerApp.module.css';
import svgPaths from './imports/svg-qarxlsr89v.ts';

// Componente para el icono OpenAI
const OpenAIIcon = () => (
  <div className={styles.openaiIcon}>
    <svg
      className="block size-full"
      fill="none"
      preserveAspectRatio="none"
      viewBox="0 0 15 15"
    >
      <g clipPath="url(#clip0_1_144)">
        <path
          d={svgPaths.p1082ed00}
          fill="var(--fill-0, black)"
        />
      </g>
      <defs>
        <clipPath id="clip0_1_144">
          <rect fill="white" height="15" width="15" />
        </clipPath>
      </defs>
    </svg>
  </div>
);

// Componente para el icono de estrella
const StarIcon = () => (
  <div className={styles.starIcon}>
    <svg
      className="block size-full"
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
      className="block size-full"
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
      className="block size-full"
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
      className="block size-full"
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
      />
    </svg>
  </div>
);

// Componente para iconos de modelos en badges
const ModelIcon = () => (
  <div className={styles.iconFrame16}>
    <div className={styles.openaiIcon}>
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 15 15"
      >
        <g clipPath="url(#clip0_1_144)">
          <path
            d={svgPaths.p1082ed00}
            fill="var(--fill-0, black)"
          />
        </g>
        <defs>
          <clipPath id="clip0_1_144">
            <rect fill="white" height="15" width="15" />
          </clipPath>
        </defs>
      </svg>
    </div>
  </div>
);

// Componente para el icono de respuestas
const ResponseIcon = () => (
  <div className={styles.modelIcon}>
    <svg
      className="block size-full"
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

// Componente para el icono de workflows
const WorkflowIcon = () => (
  <div className={styles.workflowIcon}>
    <svg
      className="block size-full"
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

// Componente para la estrella de rating más grande
const RatingStarIcon = () => (
  <div className={styles.ratingIcon18}>
    <svg
      className="block size-full"
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
const AgentCard = () => {
  const avatarCount = 5;
  const rating = 4.5;

  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        <div className={styles.mainContent}>
          {/* Sección superior */}
          <div className={styles.topSection}>
            <div className={styles.topSectionInner}>
              <div className={styles.topSectionContent}>
                <div className={styles.mainInfo}>
                  <div className={styles.avatar} />
                  <div className={styles.agentInfo}>
                    <div className={styles.agentNameContainer}>
                      <div className={styles.agentName}>
                        <p className={styles.agentNameText}>
                          Nombre de la App
                        </p>
                      </div>
                    </div>
                    <div className={styles.description}>
                      <p className={styles.descriptionText}>
                        Descripción
                      </p>
                    </div>
                    <div className={styles.metaInfo}>
                      <div className={styles.publicLabel}>
                        <p className={styles.publicText}>Público</p>
                      </div>
                      <div className={styles.privateContainer}>
                        <LockIcon />
                        <div className={styles.privateLabel}>
                          <p className={styles.publicText}>Privado</p>
                        </div>
                      </div>
                      <div className={styles.categoryLabel}>
                        <p className={styles.agentNameText}>
                          Categoría
                        </p>
                      </div>
                      <div className={styles.ratingUsersContainer}>
                        <div className={styles.ratingContainer}>
                          <StarIcon />
                          <div className={styles.ratingText}>
                            <p className={styles.agentNameText}>4.5</p>
                          </div>
                        </div>
                        <div className={styles.usersLabel}>
                          <p className={styles.publicText}>Usado por 99 usuarios</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.actions}>
                  <div className={styles.actionButtons}>
                    <div className={styles.authorContainer}>
                      <div className={styles.authorInfo}>
                        <div className={styles.authorName}>
                          <p className={styles.publicText}>Aythen</p>
                        </div>
                        <VerifiedIcon />
                      </div>
                      <div className={styles.timeLabel}>
                        <p className={styles.agentNameText}>
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
                </div>
              </div>
            </div>
          </div>

          {/* Sección inferior */}
          <div className={styles.bottomSection}>
            <div className={styles.bottomSectionInner}>
              <div className={styles.bottomContent}>
           
                <div className={styles.buttonRow}>
                  <div className={styles.buttonGroup}>
                    <div className={styles.primaryButton}>
                      <div className={styles.buttonText}>
                        <p className={styles.publicText}>Save Bot</p>
                      </div>
                    </div>
                    <div className={styles.primaryButton}>
                      <div className={styles.buttonText}>
                        <p className={styles.publicText}>Try Chat</p>
                      </div>
                    </div>
                    <div className={styles.secondaryButton}>
                      <div className={styles.secondaryButtonBorder} />
                      <div className={`${styles.buttonText} ${styles.buttonTextDark}`}>
                        <p className={styles.publicText}>Buy Bot</p>
                      </div>
                      <div className={styles.statBadgeContent}>
                        <div className={styles.statBadge}>
                          <div className={styles.statValuePurple}>
                            <p className={styles.agentNameText}>Precio</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={styles.ratingSection}>
                      <div className={styles.rateButton}>
                        <div className={styles.rateButtonBorder} />
                        <div className={styles.rateButtonText}>
                          <p>Valorar</p>
                        </div>
                        <div className={styles.ratingContainer}>
                          <RatingStarIcon />
                          <div className={styles.statValue}>
                            <p className={styles.agentNameText}>4.5</p>
                          </div>
                        </div>
                      </div>
                      <div className={styles.ratingValue}>
                        <div className={styles.ratingValueText}>
                          <p className={styles.publicText}>(4.5)</p>
                        </div>
                        <div className={styles.starsContainer}>
                          {Array.from({ length: 4 }, (_, i) => (
                            <div key={i} className={styles.starItem}>
                              <div className={styles.starInner}>
                                <svg
                                  className="block size-full"
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
                          <div className={styles.starItemHalf}>
                            <div className={styles.starInner}>
                              <svg
                                className="block size-full"
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
                            <p>Aceptar</p>
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

export default AgentCard;