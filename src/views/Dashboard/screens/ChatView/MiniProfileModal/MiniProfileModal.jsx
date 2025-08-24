import React from 'react';
import styles from './MiniProfileModal.module.css';
import { setAsset,setFatherNewAsset, setIdFatherNewAsset } from '../../../../../slices/assetsSlices';
import { setContact, setFatherIdNewContact, setFatherNewContact } from '../../../../../slices/contactsSlices';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const MiniProfileModal = ({ name, email, imageUrl, index,showMiniProfileModal,item}) => {

  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  const {agentId,chatId} = useParams()

    const handleEvent = () => {
                if("name" in item){
                   dispatch(setAsset(item));
                   dispatch(setFatherNewAsset(chatId ? 'chatId' : agentId ? 'agentId' :  'chat'))
                   navigate(`/admin/assets/${item._id}`,{ state: { backgroundLocation: location } });
                   dispatch(setIdFatherNewAsset(chatId ? {agentId,chatId} : agentId ))
                  }else if("contactName" in item){
                    dispatch(setContact(item));
                    dispatch(setFatherNewContact(chatId ? 'chatId' : agentId ? 'agentId' :  'chat'));
                    dispatch(setFatherIdNewContact(chatId ? {agentId,chatId} : agentId ))
                    navigate(`/admin/contacts/${item._id}`,{ state: { backgroundLocation: location } });
                  }
    }
     
  return (
    <div onClick={handleEvent} className={styles.container}>
      <img src={imageUrl} alt={name} className={styles.avatar} />
      <div>
        <p className={styles.name}>{name}</p>
        <p className={styles.email}>{email ? email : item && "category" in item ? 'Descripción' : item && "contactName" in item ? 'Email adress, dirección' : ""}</p>
      </div>
    </div>
  );
};

export default MiniProfileModal;
