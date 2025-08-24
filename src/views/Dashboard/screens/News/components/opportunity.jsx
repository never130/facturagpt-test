import React from 'react'
import styles from './index.module.css'

import { ReactComponent as IconArrow } from '../assets/icon-arrow.svg'
import { ReactComponent as IconAlert } from '../assets/icon-alert.svg'
import { ReactComponent as IconView } from '../assets/icon-view.svg'
import { ReactComponent as IconQuestion } from '../assets/icon-question.svg'
import { ReactComponent as IconPeriodico } from '../assets/icon-periodico.svg'
import { ReactComponent as IconCog } from '../assets/icon-cog.svg'
import { ReactComponent as IconMagic } from '../assets/icon-magic.svg'

const Opportunity = () => {
  return (
    <div className={styles.opportunityContainer}>
      <div className={styles.opportunityLeft}>
        <div className={styles.opportunityLeftTitle}>
          <IconMagic />
          AI Overview
        </div>
        <p>

          La palabra felix se escribe sin tile, ya que es una palabra aguada terminada en vocal por lo tanto la forma correcta es
        </p>
        <ul>
          <li>
            <div>
              <IconQuestion />
            </div>
            <span>
              Noticias última hora
            </span>
            <button>
              <IconArrow />
            </button>
          </li>
          <li>
            <div>
              <IconQuestion />
            </div>
            <span>
              Noticias última hora
            </span>
            <button>
              <IconArrow />
            </button>
          </li>
          <li>
            <div>
              <IconQuestion />
            </div>
            <span>
              Noticias última hora
            </span>
            <button>
              <IconArrow />
            </button>
          </li>
        </ul>
        <div className={styles.opportunityLeftFooter}>
          <span>
            Las respuestas de la IA pueden contener errores. Más información
          </span>
          <div>
            <button>
              <IconAlert />
            </button>
            <button>
              <IconView />
            </button>
          </div>
        </div>
      </div>
      <div className={styles.opportunityRight}>
        <ul>
          <li>
            <div className={styles.opportunityInfoContainer}>
              <div className={styles.opportunityInfo}>
                <b>

                  Feliz - Deinición WordReference
                </b>
                <p>

                  felix “ ajd que disfruta de felicidades o las
                  ocasiona lorem ipsum dolor err
                </p>

              </div>
              <div className={styles.opportunityImage}>
                image
              </div>
            </div>
            <div className={styles.opportunityInfoFooter}>
              <label>
                <IconPeriodico />
                elperiodico.es
              </label>
              <div className={styles.opportunityInfoFooterButtons}>
                <span>

                  Hace 1 hora
                </span>
                <div>
                  <button>
                    <IconCog />
                  </button>
                  <button>
                    <IconMagic />
                  </button>
                  <button>
                    <IconView />
                  </button>
                </div>
              </div>
            </div>
            <ul>
              <li>
                BMW
              </li>
              <li>
                Sedán
              </li>
              <li>
                Automático
              </li>
              <li>
                Diesel
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Opportunity