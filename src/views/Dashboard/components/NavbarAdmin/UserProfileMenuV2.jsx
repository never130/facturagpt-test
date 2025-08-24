import React, { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
// import { ReactComponent as DashboardBlackIcon } from "../../assets/DashboardBlackIcon.svg";
// import { ReactComponent as SettingBlackIcon } from "../../assets/SettingBlackIcon.svg";
// import { ReactComponent as LogoutBlackIcon } from "../../assets/LogoutBlackIcon.svg";
import { ReactComponent as LunaDarkMode } from "../../assets/lunaDarkMode.svg";
import { ReactComponent as StarPlus } from "../../assets/starPlus.svg";

// IconDashboard
// IconCommunity
// IconBotss
// IconWorkspace
import { ReactComponent as IconDashboard } from "../../assets/iconDashboard.svg";
import { ReactComponent as IconCommunity } from "../../assets/iconCommunity.svg";
import { ReactComponent as IconBotss } from "../../assets/iconBotss.svg";
import { ReactComponent as IconWorkspace } from "../../assets/iconWorkspace.svg";

import { ReactComponent as IconVerify } from "../../assets/iconVerify.svg";
import { ReactComponent as IconSettings } from "../../assets/IconSettings.svg";
import { ReactComponent as IconHelp } from "../../assets/IconHelp.svg";
// import { ReactComponent as IconLogout } from "../../assets/iconLogout.svg";

// import { ReactComponent as IconBots } from "../HomeExplorer/assets/icon-bots.svg";
// import { ReactComponent as IconExploreCommunity } from "../HomeExplorer/assets/icon-explore-community.svg";
// import { IconSettings, IconHelp } from "./icons";
import { MdLightMode } from 'react-icons/md'
import styles from './UserProfileMenuV2.module.css'
import ProfileModalTemplate from '../ProfileModalTemplate/ProfileModalTemplate'
import { updateAccount, createVariable, selectedWorkspaceUserId } from '../../../../actions/user'
import { setShowModal } from '../../../../slices/userSlices'
import { setTheme } from '../../../../slices/themeSlices'
import ImageEmpty from "../../assets/ImageEmpty.svg";
import { setSelectedWorkspaceId } from '../../../../slices/workspaces';
import { getSelectedWorkspace, getWorkspacesByIdAction } from '../../../../actions/workspaces';
import SkeletonScreen from '../SkeletonScreen/SkeletonScreen';

const UserProfileMenuV2 = ({ isOpen, onClose, triggerRef }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.user)
  const theme = useSelector((state) => state.theme.theme) || 'light'

  const menuRef = useRef(null)
  const [selectedWorkspace, setSelectedWorkspace] = useState('workspace1')
  const [imageError, setImageError] = useState(false)

  const onToggleTheme = async (theme) => {
    try {
      dispatch(setTheme(theme));
      localStorage.setItem('theme', theme);
      const data = await dispatch(createVariable({ variableData: { type: "theme", title: "theme", description: theme } }));
    } catch (e) {
      console.error("Error setting theme:", e);
    }
  }

  // Workspaces hardcodeados para demo con iconos SVG exactos
  const allWorkspaces = [
    { 
      id: 'workspace1', 
      name: 'Workspace', 
      icon: (
        <IconWorkspace />
      ), 
      role: '+ Rol' 
    },
    { 
      id: 'workspace2', 
      name: 'Workspace', 
      icon: (
        <IconWorkspace />
      ), 
      role: '+ Rol' 
    },
    { 
      id: 'workspace3', 
      name: 'Workspace', 
      icon: (
        <IconWorkspace />
      ), 
      role: '+ Rol' 
    },
    { 
      id: 'workspace4', 
      name: 'Workspace 99', 
      icon: (
        <IconWorkspace />
      ), 
      role: '+ Rol' 
    },
  ]

  

  // const workspaces = [
  //   ...allWorkspaces.filter(w => w.id === selectedWorkspace),
  //   ...allWorkspaces.filter(w => w.id !== selectedWorkspace)
  // ]


  const allMenuOptions = [
    {
      id: 'bots',
      icon: (
        <IconBotss />
      ),
      text: 'Tus Bots',
      action: () => {
        navigate('/admin/bots')
        onClose()
      }
    },
    {
      id: 'community',
      icon: (
        <IconCommunity />
      ),
      text: 'Explore Community',
      action: () => {
        onClose()
      }
    },
    {
      id: 'dashboard',
      icon: (
       <IconDashboard />
      ),
      text: 'Dashboard',
      shortcut: 'Alt + H',
      action: () => {
        navigate('/admin/home')
        onClose()
      }
    },
    {
      id: 'settings',
      icon: <IconSettings />,
      text: 'Ajustes',
      shortcut: 'Alt + S',
      action: () => {
        dispatch(setShowModal('settings'))

        let basePath = location.pathname;
        basePath = basePath.replace(/\/settings\/[^\/]+/, "");
        basePath = basePath.replace(/\/$/, "");
        const newPath = `${basePath}/settings/general`;
        navigate(newPath);
      }
    },
    {
      id: 'help',
      icon: <IconHelp />,
      text: 'Ayuda',
      action: () => {
        onClose()
      }
    },
    {
      id: 'theme',
      icon: theme === 'dark' ? (
        <svg width="22" height="22" viewBox="0 0 18 18" fill="red" xmlns="http://www.w3.org/2000/svg" size="18" stroke="" class="noFill_vR4gn"><path d="M3.93652 8.81528C3.93652 11.7148 6.28703 14.0653 9.18652 14.0653C11.3957 14.0653 13.2862 12.7007 14.0611 10.7686C13.4565 11.0116 12.7948 11.1486 12.1032 11.1486C9.20367 11.1486 6.85319 8.79807 6.85319 5.89857C6.85319 5.21021 6.98814 4.54475 7.22898 3.94238C5.29904 4.7184 3.93652 6.60773 3.93652 8.81528Z" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" fill="transparent" stroke="currentColor"></path></svg>
      ) : (
        <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" class="noFill_vR4gn" height="18" width="18" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0a.996.996 0 0 0 0-1.41l-1.06-1.06zm1.06-10.96a.996.996 0 0 0 0-1.41.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36a.996.996 0 0 0 0-1.41.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"></path></svg>
      ),
      // <MdLightMode size={18} className={styles.noFill}/> : <LunaDarkMode className={styles.noFill}/>,
      text: theme === 'dark' ? 'Modo claro' : 'Modo oscuro',
      shortcut: 'Alt + J',
      action: () => {
        onToggleTheme(theme === 'dark' ? 'light' : 'dark')
        onClose()
      }
    },
    {
      id: 'upgrade',
      icon: <StarPlus className={styles.plusStar}/>,
      text: 'Upgrade plan',
      action: () => {
        dispatch(setShowModal('plus'))
      },
      highlight: true
    },
    {
      id: 'logout',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M16 17L21 12L16 7" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M21 12H9" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      text: 'Log Out',
      action: () => {
        onClose()
      }
    }
  ]

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen, onClose, menuRef, triggerRef]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isOpen) return

      if (e.altKey) {
        e.preventDefault()
        const option = allMenuOptions.find(opt => opt.shortcut === `Alt + ${e.key.toUpperCase()}`)
        if (option) {
          option.action()
        }
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [isOpen, allMenuOptions])


  const { workspaces, selectedWorkspaceId } = useSelector(
    (state) => ({
      workspaces: state.workspace.workspaces,
      selectedWorkspaceId: state.workspace.selectedWorkspaceId,
    }),
    shallowEqual
  );

  const handleSaveUpgrade = async (workspace,workspaceId) => {
    await dispatch(selectedWorkspaceUserId({ workspaceId: workspaceId }));
    await dispatch(setSelectedWorkspaceId(workspaceId));
    //await dispatch(setSelectWorkspace(workspace));
    await dispatch(getSelectedWorkspace())
  };

  const newWorkspace = () => {
    let basePath = location.pathname;

    basePath = basePath.replace(/\/settings\/[^\/]+/, '');

    basePath = basePath.replace(/\/$/, '');

    const newPath = `${basePath}/settings/newWorkspace`;

    navigate(newPath);
  }
  if (!isOpen) {
    return null;
  }


  return (
    <div style={{
      position: 'fixed',
      top: '0px',
      right: '-9px',
      zIndex: 9999
    }}>
      <div ref={menuRef} className={styles.menuContainer} data-theme={theme}>
        {/* Header con información del usuario */}
        <div className={styles.userHeader}>
          <div className={styles.userAvatar}>
            <ProfileModalTemplate
              image={user?.profileImage}
              handleContactData={({ name, newValue }) => {
                if (name === 'profileImage' && user) {
                  dispatch(updateAccount({
                    data: {
                      id: user.id || user._id,
                      profileImage: newValue
                    }
                  }))
                }
              }}
              id={user?._id}
              initials={true}
              letters={user?.nombre?.split(' ').map(word => word[0] || 'U').slice(0, 2)}
              customStyle={{
                height: "48px",
                width: "48px"
              }}
              camStyles={{
                padding: "0"
              }}
            />
          </div>
          <div className={styles.userInfo}>
            <h3 className={styles.userName}>{user?.nombre || 'Usuario'}</h3>
            <p className={styles.userEmail}>{user?.email || 'usuario@email.com'}</p>
          </div>
        </div>

        {/* Separador de 15px */}
        <div className={styles.userHeaderSeparator}></div>

        {/* Sección de Workspace */}
        <div className={styles.workspaceSection}>
          <h4 className={styles.sectionTitle}>Switch Workspace</h4>
          <div className={styles.workspaceList}>

          {workspaces && workspaces.length > 0 ?[...workspaces]
              .sort((a, b) =>
                a._id === selectedWorkspaceId
                  ? -1
                  : b._id === selectedWorkspaceId
                    ? 1
                    : 0
              ).map((workspace) => (
               <div
                 className={`${styles.workspaceItem} ${selectedWorkspaceId === workspace._id ? styles.selected : ''}`}
                 onClick={() =>  workspace?.currentMember?.status !== "pending" &&
                  handleSaveUpgrade(workspace,workspace._id)}
               >
                 <div className={styles.workspaceIcon}>
                 <img src={workspace?.image || ImageEmpty} alt="" />
                 </div>
                 <div className={styles.workspaceInfo}>
                   <span className={styles.workspaceNamece}>{workspace.title || t('workspaceName')}</span>
                   <span className={styles.workspaceRole}>{workspace?.currentMember?.role?.title || workspace?.currentMember?.role?.type}</span>
                 </div>
                 {selectedWorkspaceId === workspace._id && (
                   <div className={styles.checkmark}>
                    <IconVerify />
                   </div>
                 )}
               </div>
             )): (
              <div className={styles.SkeletonScreenContainer}>
                <SkeletonScreen
                  labelText={t("workspacesNotFound")}
                  helperText={t("workspacesListedHere")}
                  showInput={true}
                  enableLabelClick={false}
                />
              </div>)}
            <div className={styles.newWorkspaceItem} onClick={newWorkspace}>

              <div className={styles.workspaceIcon}>+</div>
              <span className={styles.workspaceName}>New Workspace</span>
            </div>
          </div>
        </div>

        {/* Opciones del menú */}
        <div className={styles.menuSection}>
          {allMenuOptions.map((option) => (
            <button
              key={option.id}
              className={`${styles.menuItem} ${option.highlight ? styles.highlighted : ''}`}
              onClick={option.action}
            >
              <div className={styles.menuItemContent}>
                <span className={styles.menuIcon}>{option.icon}</span>
                <span className={styles.menuText}>{option.text}</span>
              </div>
              {option.shortcut && (
                <span className={styles.shortcut}>{option.shortcut}</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default UserProfileMenuV2 