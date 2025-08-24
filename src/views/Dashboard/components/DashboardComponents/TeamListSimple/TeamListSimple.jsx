import React, { useState } from "react";
import styles from "./TeamListSimple.module.css";
import EmptyImage from "../../../assets/ImageEmpty.svg";
import { useDispatch } from "react-redux";
import {  setAsset } from "@src/slices/assetsSlices";
import { useTranslation } from "react-i18next";
import { useNavigate,useLocation } from "react-router-dom";
import { setFatherNewAsset } from "../../../../../slices/assetsSlices";
import { setContact, setFatherNewContact } from "../../../../../slices/contactsSlices";
import { setTab } from "../../../../../slices/dashboardSlices";

const TeamListSimple = ({ teams, type,setShowNewAsset }) => {
  const { t } = useTranslation("dashboard");

  const [selectedTeam, setSelectedTeam] = useState(null);

  const location = useLocation();
  const dispatch = useDispatch()
  const navigate = useNavigate()

 
    const handleSelectTeam = (team) => {
      setSelectedTeam(team);
      if(type === 'asset'){
          dispatch(setFatherNewAsset('home'))
            dispatch(setAsset(team));
            dispatch(setTab( t('assets')))
            navigate(`/admin/assets/${team._id}`,{ state: { backgroundLocation: location } })
            
        } else if(type === 'contact'){
          dispatch(setContact(team));
          dispatch(setTab(t('contacts')))
          dispatch(setFatherNewContact('home'))
          navigate(`/admin/contacts/${team._id}`,{ state: { backgroundLocation: location } })
        }

    };


  


  const renderList = (team) => {
    if (type == 'contact') {
      return (
        <div
          key={team?.id}
          onClick={() => handleSelectTeam(team)}
          className={styles.team}
        >
          <div className={styles.imgContainer}>
            <img src={EmptyImage} alt="" />
          </div>
          <div className={styles.contentTeam}>
            <div className={styles.headerTeam}>
              <div className={styles.headerTeamLeft}>
                <p>{team?.contactName}</p>
              </div>
              <div className={styles.headerTeamRight}>
                <p>
                  {type == "contact"
                    ? `${team?.firtsPrice}€ - ${team?.secondPrice}€ (${team?.percent}%)`
                    : `${t('averageRrp')} ${team?.pvp}€`}
                </p>
                {team?.companyEmail}
                {team?.companyAddress}
              </div>
            </div>
            <div className={styles.teamDesc}>
              <p>
                <span># {t('transactions')} </span>
                {team?.contactCif}
              </p>
            </div>
          </div>
        </div>
      )
    }


    if (type == 'asset') {
      return (
        <div
          key={team?.id}
          onClick={() => handleSelectTeam(team)}
          className={styles.team}
        >
          
          
          
          
          <div className={styles.imgContainer}>
            <img src={EmptyImage} alt="" />
          </div>
          <div className={styles.contentTeam}>
            <div className={styles.headerTeam}>
              <div className={styles.headerTeamLeft}>
                <p>{team?.name}</p>
              </div>
              <div className={styles.headerTeamRight}>
                <p>
                  {type == "contact"
                    ? `${team.ref}€ - ${team?.secondPrice}€ (${team?.quantity}%)`
                    : `${t('averageRrp')} ${team?.unit}€`}
                </p>
                {team?.description}
                {team?.description}
              </div>
            </div>
            <div className={styles.teamDesc}>
              <p>
                <span># {t('transactions')} </span>
                {team?.contactCif}
              </p>
            </div>
          </div>
        </div>
      )
    }
  }

  return (
    <div className={styles.teamsContainer}>
      {teams.map((team) => (
        renderList(team)
      ))}
    </div>
  );
};

export default TeamListSimple;
