import React from 'react'
import styles from './index.module.css'

import { ReactComponent as IconPeriodico } from '../assets/icon-periodico.svg'
import { ReactComponent as IconCog } from '../assets/icon-cog.svg'
import { ReactComponent as IconMagic } from '../assets/icon-magic.svg'
import { ReactComponent as IconView } from '../assets/icon-view.svg'
import { ReactComponent as IconLocation } from '../assets/icon-location.svg'
import { ReactComponent as IconEmail } from '../assets/icon-email.svg'
import { ReactComponent as IconPhone } from '../assets/icon-phone.svg'
import { ReactComponent as IconWeb } from '../assets/icon-web.svg'

const Web = () => {
  return (
    <div className={styles.webContainer}>
      <div className={styles.header}>
        <label>
          <IconPeriodico />
          periodico.es
        </label>
        <span>
          Hace 1 hora
        </span>
        <div className={styles.headerButtons}>
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
      <b>
        Cientos de comercios de barrio de Barcelona amplían ingresos con puntos de recogida de compras online
      </b>
      <p>
        Cientos de comercios de barrio de Barcelona amplían ingresos con puntos de recogida de compras online
      </p>
      <div className={styles.footer}>
        <button>
          <IconWeb />
        </button>
        <button>
          <IconLocation />
        </button>
        <button>
          <IconEmail />
        </button>
        <button>
          <IconPhone />
        </button>
      </div>
    </div>
  )
}

export default Web