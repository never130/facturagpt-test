import React from 'react'
import styles from './index.module.css'

import { ReactComponent as IconPlay } from '../assets/icon-play.svg'
import { ReactComponent as IconView } from '../assets/icon-view.svg'
import { ReactComponent as IconAlert } from '../assets/icon-alert.svg'
import { ReactComponent as IconDownload } from '../assets/icon-download.svg'
import { ReactComponent as IconUpload } from '../assets/icon-upload.svg'
import { ReactComponent as IconMagic } from '../assets/icon-magic.svg'
import { ReactComponent as IconYoutube } from '../assets/icon-youtube.svg'
import { ReactComponent as IconCog } from '../assets/icon-cog.svg'

const Video = () => {
  return (
    <div className={styles.videoContainer}>
      <div className={styles.video}>
        <div className={styles.videoPlay}>
          <div>
          <IconPlay />
          </div>
        </div>
      <div className={styles.buttons}>
        <span>
          00:00
        </span>
        <button>
          <IconView />
        </button>
        <button>
          <IconDownload />
        </button>
        <button>
          <IconUpload />
        </button>
        <button>
          <IconMagic />
        </button>
        <button>
          <IconCog />
        </button>
      </div>
      </div>

      <div className={styles.info}>
        <b>
        Comparativa SUV 2024: Kia Sportage vs Hyundai Tucson
        </b>
        <ul>
          <li>
            Siguiendo
          </li>
          <li>
            Seguir
          </li>
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
    </div>
  )
}

export default Video