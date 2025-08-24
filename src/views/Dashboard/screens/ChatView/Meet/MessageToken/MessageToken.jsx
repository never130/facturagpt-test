import React from 'react';
import styles from './MessageToken.module.css';
import svgPaths from './imports/svg-le9x65twvt.ts';



import { ReactComponent as IconAnthropic } from './assets/icon-anthropic.svg';
import { ReactComponent as IconClaude } from './assets/icon-claude.svg';
import { ReactComponent as IconClose } from './assets/icon-close.svg';
import { ReactComponent as IconCohere } from './assets/icon-cohere.svg';
import { ReactComponent as IconEdit } from './assets/icon-edit.svg';
import { ReactComponent as IconError } from './assets/icon-error.svg';
import { ReactComponent as IconGroq } from './assets/icon-groq.svg';
import { ReactComponent as IconLock } from './assets/icon-lock.svg';
import { ReactComponent as IconOpenAI } from './assets/icon-openai.svg';
import { ReactComponent as IconPerplexity } from './assets/icon-perplexity.svg';
import { ReactComponent as IconSuccess } from './assets/icon-success.svg';
import { ReactComponent as IconCircle } from './assets/icon-circle.svg';











// Componente para Badge de modelo


const ModelBadge = ({ text, width }) => (
  <div
    className={styles.modelBadge}
    style={{ width: width }}
  >
    <div className={styles.modelBadgeContent}>
      <div className={styles.modelBadgeText}>
        <p className={styles.modelBadgeTextSpan}>{text}</p>
      </div>
    </div>
    <div className={styles.modelBadgeBorder} aria-hidden="true" />
  </div>
);

// Componente para tarjeta de proveedor estándar


const ProviderCard = ({
  iconComponent,
  name,
  description,
  models
}) => (
  <div className={styles.providerCard}>
    <div className={styles.providerCardBorder} aria-hidden="true" />
    <div className={styles.providerCardInner}>
      <div className={styles.providerCardContent}>
        <div className={styles.providerMainInfo}>
          <div className={styles.providerInfo}>
            <div className={styles.providerName}>
              <div className={styles.providerIcon}>
                <div className={styles.providerIconInner}>
                  {iconComponent}
                </div>
                <div className={styles.providerIconBorder} aria-hidden="true" />
              </div>
              <p className={styles.providerNameText}>{name}</p>
            </div>
            <div className={styles.providerDescription}>
              <p className={styles.providerDescriptionText}>{description}</p>
            </div>
            <div className={styles.modelBadgesContainer}>
              {models?.slice(0, 2).map((model, index) => (
                <ModelBadge key={index} text={model} />
              ))}
              {models?.length > 2 && (
                <ModelBadge text={`+ ${models?.length - 2}`} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Componente para el mensaje de seguridad

// Componente principal
const MessageToken = () => {
  const providers = [
    {
      name: 'OpenAI',
      description: 'GPT-4, GPT-3.5, DALL-E, y más',
      models: ['GPT-4o', 'GPT-4o-mini', '+7'],
      icon: <div>icon j</div>
    },
    {
      name: 'Anthropic',
      description: 'Claude 3.5 Sonnet, Opus, Haiku',
      models: ['Claude 3.5 Sonnet', 'Claude 3 Opus', '+4'],
      icon: <div className="shrink-0 size-8" />
    },
    {
      name: 'Google Gemini',
      description: 'Gemini 1.5 Pro, Flash, y PaLM',
      models: ['Gemini 1.5 Pro', 'Gemini 1.5 Flash', '+3'],
      icon: <div className="shrink-0 size-[29px]" />
    },
    {
      name: 'Groq',
      description: 'Llama 3, Mixtral ultra-rápidos',
      models: ['Llama 3.1 70B', 'Llama 3.1 8B', '+2'],
      icon: <div className="bg-center bg-cover bg-no-repeat h-3 shrink-0 w-[34px]" />
    },
    {
      name: 'Perplexity',
      description: 'Modelos con acceso a internet',
      models: ['Sonar Small Online', 'Sonar Medium Online', '+1'],
      icon: <div className="bg-center bg-cover bg-no-repeat shrink-0 size-[30px]" />
    }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        <div className={styles.mainContent}>
          <div className={styles.spaceY4}>
            <div className={styles.frame} data-name="Frame">
              <div className={styles.headerTitle}>
                <p className={styles.headerTitleText}>
                  ¿Qué proveedor de IA quieres añadir?
                </p>
              </div>
              <div className={styles.headerSubtitle}>
                <p className={styles.headerSubtitleText}>
                  Selecciona el servicio de IA para el que tienes una API key
                </p>
              </div>
            </div>

            <div className={styles.callout}>
              <div className={styles.calloutInner}>
                <div className={styles.calloutContent}>
                  icon chexk
                  <div className={styles.calloutTextContainer}>
                    <div className={styles.calloutText}>
                      <p className={styles.calloutTitle}>¿Qué puedes hacer?</p>
                      <ul className={styles.calloutList}>
                        <li className={styles.calloutListItem}>2
                          <span className={styles.calloutListText}>
                            Añadir tokens de OpenAI, Anthropic, Google, Cohere, Groq y más
                          </span>
                        </li>
                        <li className={styles.calloutListItem}>
                          <span className={styles.calloutListText}>
                            Gestionar múltiples tokens por proveedor
                          </span>
                        </li>
                        <li className={styles.calloutListItem}>
                          <span className={styles.calloutListText}>
                            Validar automáticamente tus tokens
                          </span>
                        </li>
                        <li className={styles.calloutListItem}>
                          <span className={styles.calloutListText}>
                            Configurar tokens predeterminados
                          </span>
                        </li>
                        <li className={styles.calloutListItem}>
                          <span className={styles.calloutListText}>
                            Ver qué modelos están disponibles
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.calloutBorder} aria-hidden="true" />
            </div>

            {/* Primera fila de proveedores */}
            <div className={styles.providerCardRow}>
              <ProviderCard {...providers[0]} />
              <ProviderCard {...providers[1]} />
            </div>

            {/* Segunda fila de proveedores */}
            <div className={styles.providerCardRow}>
              <ProviderCard {...providers[2]} />
              <ProviderCard {...providers[3]} />
            </div>

            {/* Tercera fila de proveedores */}
            <div className={styles.providerCardRow}>
              <ProviderCard {...providers[4]} />
              <ProviderCard {...providers[5]} />
            </div>


            <div className={styles.securityMessage}>
              <div className={styles.securityMessageContent}>
                {/* <LockIcon /> */}
                icon lock
                <div className={styles.securityText}>
                  <p className={styles.securityTextSpan}>
                    Tus tokens se almacenan localmente y nunca se envían a servidores externos.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageToken;