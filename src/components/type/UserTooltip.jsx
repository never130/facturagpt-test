import React from 'react';
import BaseTooltip from './BaseTooltip';
import userStyles from './UserTooltip.module.css';

const UserItem = ({ name, details, highlighted = false }) => {
  return (
    <div className={`${userStyles.userItem} ${highlighted ? userStyles.userItemHighlighted : ''}`}>
      <div className={userStyles.userContent}>
        <div className={userStyles.userInner}>
          <div className={userStyles.avatar}></div>
          <div className={userStyles.userInfo}>
            <div className={userStyles.userName}>
              <div className={userStyles.nameText}>
                {name}
              </div>
            </div>
            <div className={userStyles.userDetails}>
              {details}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



const UserTooltip = ({ className }) => {
  return (
    <BaseTooltip className={className}>
      <div className={userStyles.userContainer}>
        <UserItem 
          name="Nombre de la Cuenta" 
          details="Email adress, Dirección, Población, Provincia, Código Postal, País" 
        />
        <UserItem 
          name="Nombre de la Cuenta" 
          details="Email adress, Dirección, Población, Provincia, Código Postal, País" 
          highlighted
        />
        <UserItem 
          name="Nombre de la Cuenta" 
          details="Email adress, Dirección, Población, Provincia, Código Postal, País" 
        />
      </div>
    </BaseTooltip>
  );
};

export default UserTooltip;