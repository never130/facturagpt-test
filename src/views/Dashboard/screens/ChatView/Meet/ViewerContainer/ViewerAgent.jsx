import React from 'react';
import styles from './ViewerAgent.module.css';


import { ReactComponent as IconPdf } from "./assets/icon-pdf.svg";
import { ReactComponent as IconLock } from "./assets/icon-lock.svg";
import { ReactComponent as IconEdit } from "./assets/icon-edit.svg";
import { ReactComponent as IconCog } from "./assets/icon-cog.svg";
import { ReactComponent as IconMagic } from "./assets/icon-magic.svg";
import { ReactComponent as IconChernDown } from "./assets/icon-chern-down.svg";
import { ReactComponent as IconClose } from "./assets/icon-close.svg";
import { ReactComponent as IconStripe } from "./assets/icon-stripe.svg";
import { ReactComponent as IconStar } from "./assets/icon-star.svg";
import { ReactComponent as IconEtiqueta } from "./assets/icon-etiqueta.svg";
import { ReactComponent as IconOpenAi } from "./assets/icon-openai.svg";
import { ReactComponent as IconGemini } from "./assets/icon-gemini.svg";
import { ReactComponent as IconClaude } from "./assets/icon-claude.svg";
import { ReactComponent as IconQA } from "./assets/icon-qa.svg";



// Componente principal
const AgentCard = () => {
  const avatarCount = 5;
  const rating = 4.5;

  return (
 
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
                          Nombre del Agente
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
                        {/* <LockIcon /> */}
                        <IconLock />
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
                          {/* <StarIcon /> */}
                          <IconStar />
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
                        {/* <VerifiedIcon /> */}
                        <IconEtiqueta />
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
                        {/* <EditIcon /> */}
                        <IconEdit />
                        <div className={styles.editText}>
                          <p className={styles.publicText}>Editar</p>
                        </div>
                      </div>
                    </div>
                    <div className={styles.moreButton}>
                      <div className={styles.editButtonBorder} />
                      {/* <MoreIcon /> */}
                      <IconCog />
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
                <div className={styles.avatarGroup}>
                  <div className={styles.avatarList}>
                    {Array.from({ length: avatarCount }, (_, i) => (
                      <div key={i} className={styles.avatarItem}>
                        <div className={styles.avatarBorder} />
                      </div>
                    ))}
                    <div className={styles.avatarItem}>
                      <div className={styles.avatarBorder} />
                    </div>
                  </div>
                  <div className={styles.statsContainer}>
                    <div className={styles.statsRow}>
                      <div className={styles.statItem}>
                        <div className={styles.statLabel}>
                          <p className={styles.publicText}>Modelos: Todos</p>
                        </div>
                        <div className={styles.statBadgeContent}>
                          <div className={styles.statBadge}>
                            {/* <ModelIcon /> */}
                            <IconOpenAi />
                            <IconGemini />
                            <IconClaude />
                            <div style={{ width: '16px', height: '16px', backgroundColor: '#ccc' }} />
                            <div style={{ width: '16px', height: '16px', backgroundColor: '#ccc' }} />
                          </div>
                        </div>
                      </div>
                      <div className={styles.statItem}>
                        <div className={styles.statLabel}>
                          <p className={styles.publicText}>Respuestas programadas: </p>
                        </div>
                        <div className={styles.statBadgeContent}>
                          <div className={`${styles.statBadge} ${styles.statBadgeWhite}`}>
                            <div className={styles.statValue}>
                              <p className={styles.agentNameText}>99</p>
                            </div>
                            {/* <ResponseIcon /> */}
                            {/* icon response */}
                            <IconQA />
                          </div>
                        </div>
                      </div>
                      <div className={styles.statItem}>
                        <div className={styles.statLabel}>
                          <p className={styles.publicText}>Workflows:</p>
                        </div>
                        <div className={styles.statBadgeContent}>
                          <div className={styles.statBadge}>
                            <div className={styles.statValue}>
                              <p className={styles.agentNameText}>99</p>
                            </div>
                            {/* <WorkflowIcon /> */}
                            icon workflow
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
                          {/* <RatingStarIcon /> */}
                          <IconStar />
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
                                {/* <svg
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
                                </svg> */}
                                <IconStar />
                              </div>
                            </div>
                          ))}
                          <div className={styles.starItemHalf}>
                            <div className={styles.starInner}>
                              {/* <svg
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
                              </svg> */}
                              <IconStar />
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
  );
};

export default AgentCard;