import { MdAttachFile, MdEditNote } from 'react-icons/md';
import styles from './ActionButtons.module.css';
import { FaUsers } from 'react-icons/fa';
import { LuGitPullRequestArrow } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import { setShowModal } from '../../../../../../slices/userSlices';
import { useDispatch } from 'react-redux';

const ActionButtons = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const actions = [
        {icon: <MdEditNote color='var(--_10a37f-background)' size={24} /> ,label: 'Nueva Transacción', primary: false },
        {icon: <FaUsers color='var(--_10a37f-background)' size={22}/> , label: 'Nuevo Contacto', primary: false },
        { icon: <MdAttachFile color='var(--_10a37f-background)' size={22}/>, label: 'Subir Documento', primary: false },
        {icon: <LuGitPullRequestArrow color='var(--_10a37f-background)' size={22}/> , label: 'Automatiza', primary: false }
    ];

    return (
        <div className={styles.actionButtons}>
            {actions.map((action, index) => (
                <button onClick={action.action}
                    key={index}
                    className={`${styles.actionBtn} ${action.primary ? styles.primary : ''}`}
                >
                 {action.icon} {action.label} {action.shortCut && <span className={styles.shortcut}>{action.shortCut}</span>}
                </button>
            ))}
        </div>
    );
};

export default ActionButtons;