import styles from './actionHeader.module.css';



import { ReactComponent as IconSucess } from '../assets/icon-sucess.svg';
import { ReactComponent as IconDelete } from '../assets/icon-delete.svg';
import { ReactComponent as IconChernUp } from '../assets/icon-chern-up.svg';
import { ReactComponent as IconPlay } from '../assets/icon-play.svg';
import { ReactComponent as IconArrowDown } from '../assets/icon-arrow-down.svg';

const ActionHeader = ({
    icon,
    title,
    subtitle,
}) => {
    return (
        <div className={styles.container}   >
            <div className={styles.infoContainer}>

                <div className={styles.info}>
                    <div className={styles.icon}>
                        {icon}
                    </div>
                    <b>
                        {title}
                    </b>
                </div>
                <div className={styles.subtitle}>
                    <div className={styles.icon}>
                        <IconArrowDown />
                    </div>
                    <span>
                        {subtitle}
                    </span>
                </div>
                <button className={styles.play}>
                    <IconPlay />
                    Test
                </button>
            </div>
            <div className={styles.buttons}>
                {true ? (
                    <button>
                        <IconSucess />
                    </button>
                ) : (
                    <button>
                        <IconDelete />
                    </button>
                )}
                <button>
                    <IconChernUp />
                </button>
            </div>

        </div>
    )
}

export default ActionHeader;    