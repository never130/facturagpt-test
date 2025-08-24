import React from "react";
import styles from "./DetailsBillInputs.module.css";
import { useTranslation } from "react-i18next";
import {ReactComponent as LocationParamIcon} from '../../../assets/LocationParamIcon.svg'
const DetailsBillInputs = ({
  email,
  address,
  population,
  province,
  zipCode,
  country,
  handleChange,
  defaultInput,
  compressed,
  selectedBillIndex,
  selectedBillId,
  showCheckboxDefault=true,
  location=false,
  type,
  setType,
  typeContainer
}) => {
  const [t] = useTranslation("InfoContact");
  return (
    <div className={styles.DetailsBillInputs}>
      {location && (
         <div  className={styles.iconToggle}>
         <LocationParamIcon onClick={() => setType(type === "location" ? "bill" : "location")}/>
       </div>
      )}
     {!compressed && (
  <>
    {type === 'location' && email !== undefined && (
      <div className={styles.row}>
           {t("location")}
        <input
          type="text"
          value={email}
          placeholder={t("location")}
          onChange={(e) => handleChange("name", e.target.value)}
        />
      </div>
    )}

    {type === 'bill' && (
      <>
        {address !== undefined && (
          <div className={styles.row}>
            {t("address")}
            <input
              type="text"
              value={address}
              placeholder={t("address")}
              onChange={(e) => handleChange("address", e.target.value)}
            />
          </div>
        )}

        <div className={styles.containerColumn}>
          <div>
            {population !== undefined && (
              <div>
                {t("population")}
                <input
                  type="text"
                  value={population}
                  placeholder={t("population")}
                  onChange={(e) => handleChange("population", e.target.value)}
                />
              </div>
            )}

            {province !== undefined && (
              <div>
                {t("province")}
                <input
                  type="text"
                  value={province}
                  placeholder={t("province")}
                  onChange={(e) => handleChange("province", e.target.value)}
                />
              </div>
            )}
          </div>

          <div>
            {zipCode !== undefined && (
              <div>
                {t("zipCode")}
                <input
                  type="text"
                  value={zipCode}
                  placeholder={t("zipCode")}
                  onChange={(e) => handleChange("zipCode", e.target.value)}
                />
              </div>
            )}
            {country !== undefined && (
              <div>
                {t("country")}
                <input
                  type="text"
                  value={country}
                  placeholder={t("country")}
                  onChange={(e) => handleChange("country", e.target.value)}
                />
              </div>
            )}
          </div>
        </div>

        {showCheckboxDefault && (
          <div className={styles.defaultAddress}>
            <input
              type="checkbox"
              value={defaultInput}
              checked={defaultInput}
              onChange={(e) =>
                handleChange("default", e.target.checked, selectedBillIndex, selectedBillId)
              }
            />
            <span>{t("defaultAddress")}</span>
          </div>
        )}
      </>
    )}
  </>
)}


      {compressed && (
        typeContainer === "popup" ? 
        
        ( <>
         
            <div className={styles.row} style={{fontSize:"12px"}}>
              {t('address')}
              <input style={{padding:"4px",fontSize:"12px"}}
                type="text"
                value={address}
                onChange={(e) => handleChange("address", e.target.value)}
              />
            </div>
         
          <div className={styles.row} style={{display:"flex", gap:"10px", fontSize:"12px"}}> 
             <div className={styles.row}>
              {t('population')}
              <input style={{padding:"4px",fontSize:"12px"}}
                type="text"
                value={population}
                onChange={(e) => handleChange("population", e.target.value)}
              />
            </div>
          <div className={styles.row}>
              {t('zipCode')}
              <input style={{padding:"4px",fontSize:"12px"}}
                type="text"
                value={zipCode}
                onChange={(e) => handleChange("zipCode", e.target.value)}
              />
            </div>
           
            </div>
          
          <div className={styles.row} style={{display:"flex", gap:"10px",fontSize:"12px"}}> 
            <div className={styles.row}>
              {t('province')}
              <input style={{padding:"4px",fontSize:"12px"}}
                type="text"
                value={province}
                onChange={(e) => handleChange("province", e.target.value)}
              />
            </div>
            <div className={styles.row}>
              {t('country')}
              <input style={{padding:"4px",fontSize:"12px"}}
                type="text"
                value={country}
                onChange={(e) => handleChange("country", e.target.value)}
              />
            </div>
             </div>
         
        </>) 

        :

        ( <>
          {email !== undefined && (
            <div className={styles.row}>
              <input
                type="text"
                value={email}
                placeholder={t('emailAddress')}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </div>
          )}

          {zipCode !== undefined && (
            <div className={styles.row}>
              <input
                type="text"
                value={zipCode}
                placeholder={t('zipCode')}
                onChange={(e) => handleChange("zipCode", e.target.value)}
              />
            </div>
          )}

          {country !== undefined && (
            <div className={styles.row}>
              {t('CountryResidence')}
              <input
                type="text"
                value={country}
                placeholder={t('country')}
                onChange={(e) => handleChange("country", e.target.value)}
              />
            </div>
          )}
        </>)
       
      )}
    </div>
  );
};

export default DetailsBillInputs;
