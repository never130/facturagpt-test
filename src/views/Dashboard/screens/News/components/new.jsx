import React from 'react'
import styles from './index.module.css'

import { ReactComponent as IconCog } from '../assets/icon-cog.svg'
import { ReactComponent as IconMagic } from '../assets/icon-magic.svg'
import { ReactComponent as IconView } from '../assets/icon-view.svg'
import { ReactComponent as IconPeriodico } from '../assets/icon-periodico.svg'

const New = () => {
  return (
    <div className={styles.newContainer}>
      <div className={styles.image}>
        <div className={styles.imageButtons}>
          <button>
            Seguir
          </button>
          <button>
            Siguiendo
          </button>
        </div>
      </div>
      <div className={styles.info}>
        <p>
          Cientos de comercios de barrio de Barcelona amplían ingresos con puntos de recogida de compras online
        </p>
        <label>
          <IconPeriodico />
          elperiodico.es
        </label>
        <div className={styles.infoFooter}>
          <span>
            Hace 1 hora
          </span>
          <div className={styles.infoButtons}>
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
    </div>
  )
}

export default New