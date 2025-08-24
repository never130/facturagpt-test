import React from 'react'
import styles from '../CardExplore/CardExplore.module.css';
import { ReactComponent as StarExplore } from "../../../../assets/starExplore.svg"
import { ReactComponent as ShieldExplore } from "../../../../assets/shieldExplore.svg"
import { ReactComponent as CirclesExplore } from "../../../../assets/circlesExplore.svg"
import { ReactComponent as ChatIconMarketplace } from "../../../../assets/chatIconMarketplace.svg"
import { ReactComponent as AutomateIconMarketplace } from "../../../../assets/automateIconMarketplace.svg"
import { ReactComponent as PadlockMarketplace } from "../../../../assets/padlockMarketplace.svg"
import { ReactComponent as StarMarketplace } from "../../../../assets/starMarketplace.svg"
import { ReactComponent as ImageDefaultMarketplace } from "../../../../assets/imageDefaultMarketplace.svg"
import { ReactComponent as ContactsIconMarketplace } from "../../../../assets/contactsIconMarketplace.svg"
import { ReactComponent as AssetsIconMarketplace } from "../../../../assets/assetsIconMarketplace.svg"
import { ReactComponent as DocsIconMarketplace } from "../../../../assets/docsIconMarketplace.svg"
import ImageEmpty  from "../../../../assets/ImageEmpty.svg"

import { useTranslation } from "react-i18next";
import Button from '../../../../components/Button/Button';
import { setShowModal } from "../../../../../../slices/userSlices";
import { useDispatch } from "react-redux";

const DocumentCard = ({document}) => {
    const [t] = useTranslation("ChatView");
    const dispatch = useDispatch();
  return (
        <div className={styles.documentCard}  onClick={() => {
            dispatch(
              setShowModal({
                modal: "infoExploreCommunity",
                type: "document",
                selectedOptionCommunity: document,
              })
            );
          }}>
            <div className={styles.documentCardImage}>
                {document?.image ? <img src={document?.image} alt="ImageEmpty" /> : <div className={styles.imageDefault}></div>}
            </div>
            <div className={styles.documentCardContent}>
                <p className={styles.titleDocumentCard}>{document?.title || '.txt'}</p>
                <div className={styles.categoryConceptContainer}>
                    <p>{document?.category || t('category')}</p>
                    <span>{document?.concept || t('concept')}</span>
                </div>
                <div className={styles.textContainer}>
            <span className={styles.colorGrey}>{t(`${t('usedBy')} 99 ${t('users')}`)}</span>
            <StarMarketplace />
            {/* <span>{review || t('noRatings')}</span> */}
          </div>
                <div className={styles.buttonsContainer}>
                    <Button headerStyle={{borderRadius:"999px"}}>{t('saveTemplate')}</Button>
                    <Button headerStyle={{borderRadius:"999px",fontWeight:"bold"}} type='white'>{t('buyTemplate')} <div className={styles.priceDocumentCard}>{t('price')}</div></Button>
                </div>
            </div>
    </div>
  )
}

export default DocumentCard