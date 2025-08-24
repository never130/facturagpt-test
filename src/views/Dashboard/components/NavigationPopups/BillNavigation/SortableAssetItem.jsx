import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ReactComponent as GrabIcon } from "../../../assets/grabIcon.svg";
import styles from './BillNavigation.module.css';
import { useTranslation } from "react-i18next";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { ReactComponent as PencilForPopup } from "../../../assets/pencilForPopup.svg";
import ProfileModalTemplate from "../../ProfileModalTemplate/ProfileModalTemplate";

const SortableAssetItem = ({ asset, index,typeContainer }) => {
    const { t } = useTranslation("navbarAdmin");
  const {
    attributes,
    listeners,
    setActivatorNodeRef,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: asset.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={styles.assetItem}
    >
      {typeContainer === 'popup' ? 
      asset.type === "section" ? 
      <div className={`${styles.infoParameterItem} ${asset.type === "section" ? styles.lessCategoryContainer : typeContainer === "popup" ? styles.textAndDragContainer : ""}`}>
        <GrabIcon
          ref={setActivatorNodeRef}
          {...listeners}
          {...attributes}
          style={{ cursor: "grab", margin: "0 10px", outline: "none" }}
        />
        <div className={styles.lessCategory}>
                <FaChevronUp size={12} fill={"#8E8E93"}/>
                <span>{asset.name}</span>
               <PencilForPopup/>
                </div>
      </div> : 
      <div className={`${styles.infoParameterItem} ${asset.type === "section" ? styles.lessCategoryContainer : typeContainer === "popup" ? styles.textAndDragContainer : ""}`}>
        <GrabIcon
          ref={setActivatorNodeRef}
          {...listeners}
          {...attributes}
          style={{ cursor: "grab", margin: "0 10px", outline: "none" }}
        />
          <div className={styles.textContainer}>
             <FaChevronUp size={18} fill={"#8E8E93"}/>
          <ProfileModalTemplate
          farher={"doc"}
                              type={typeContainer}
                              image={asset.image}
                              id={asset.id}
                              sticky={true}
                              customStyle={{
                                width: "50px",
                                height: "50px",
                                borderRadius: "0px",
                              }}
                            />
                            <div>

                              <div className={styles.text}>
        <span className={styles.span1}>{asset.name || `${t('article')} ${index}`  }</span>
        <span className={styles.span2}>{t('description')}</span>
                              </div>
                            </div>
        </div>
      </div> 
      : 
      <div>
      <div className={styles.infoParameterItem}>
        <GrabIcon
          ref={setActivatorNodeRef}
          {...listeners}
          {...attributes}
          style={{ cursor: "grab", margin: "0 10px", outline: "none" }}
        />
        {asset.name || t('assetName')}
      </div>
      </div>}


    </li>
  );
};

export default SortableAssetItem;
