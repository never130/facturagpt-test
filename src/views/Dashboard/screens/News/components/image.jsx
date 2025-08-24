import React from 'react'
import styles from './index.module.css' 

import { ReactComponent as IconCog } from '../assets/icon-cog.svg'
import { ReactComponent as IconMagic } from '../assets/icon-magic.svg'
import { ReactComponent as IconDownload } from '../assets/icon-download.svg'
import { ReactComponent as IconAlert } from '../assets/icon-alert.svg'
import { ReactComponent as IconView } from '../assets/icon-view.svg'
import { ReactComponent as IconYoutube } from '../assets/icon-youtube.svg'

const Image = () => {
  return (
    <div className={styles.imageContainer}>
      <div className={styles.image}>
        image
      </div>
      <div className={styles.buttons}>
        <button>
          <IconCog />
        </button>
        <button>
          <IconMagic />
        </button>
        <button>
          <IconDownload />
        </button>
        <button>
          <IconAlert />
        </button>
        <button>
          <IconView />
        </button>
      </div>
      <div className={styles.footer}>
        <span>
          Hace 15 minutos
        </span>
        <div>
          <IconYoutube />
          youtube.com
        </div>
      </div>
    </div>
  )
}

export default Image