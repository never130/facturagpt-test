import React from 'react'
import styles from './index.module.css'

import { ReactComponent as IconDelete } from '../assets/icon-delete.svg'
import { ReactComponent as IconMagic } from '../assets/icon-magic.svg'
import { ReactComponent as IconDownload } from '../assets/icon-download.svg'
import { ReactComponent as IconView } from '../assets/icon-view.svg'
import { ReactComponent as IconAlert } from '../assets/icon-alert.svg'
import { ReactComponent as IconPeriodico } from '../assets/icon-periodico.svg'
import { ReactComponent as IconCog } from '../assets/icon-cog.svg'

const Stock = () => {
  return (
    <div className={styles.stockContainer}>
      <div className={styles.stockHeader}>
        <button>
          <IconDelete />
        </button>
        <button>
          <IconMagic />
        </button>
        <button>
          <IconDownload />
        </button>
        <button>
          <IconView />
        </button>
        <button>
          <IconAlert />
        </button>
      </div>
      <div className={styles.stockInfo}>
        <b>
          Audi A4 2019 - Oportunidad Única
        </b>
        <span>
          €28,500
        </span>
      </div>
      <div className={styles.stockDescription}>
        <p>
          Audi A4 con mantenimiento completo, único propietario, precio negociable
        </p>
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
          <li>
            Color
          </li>
          <li>
            Neumático
          </li>
        </ul>
        <div className={styles.stockFooter}>
          <span>
            Hace 15 minutos
          </span>
          <div>
            <IconPeriodico />
            autocasion.com
          </div>
        </div>
      </div>
    </div>
  )
}

export default Stock