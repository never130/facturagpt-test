import { useState } from 'react';
import styles from './DatabaseTableCard.module.css';
import { ReactComponent as ManyCoinIcon } from '../assets/manyCoinIcon.svg';
import { ReactComponent as HeaderTableIcon1 } from '../assets/headerTableIcon1.svg';
import { formatAgoDate } from '../../../../../../../utils/agoDateUtil';

import { exportTable } from '../../../../../../../actions/user'
import { ReactComponent as TableLockOpen } from '../../../../../assets/tableLockOpen.svg';
import { ReactComponent as TableLockClose } from '../../../../../assets/tableLockClose.svg';

export default function DatabaseTableCard({
  tableName = "Nombre de la Tabla",
  category = "Público",
  isPrivate = true,
  storageSize = "1 GB",
  authorName = "Aythen",
  timeAgo = "Hace un año",
  tags = ["Etiqueta 1", "Etiqueta 2"],
  onEdit,
  onAddRelation,
  onAddRecord,
  onMoreOptions,
  onRemoveTag,
  onAddTag,
  table,
  processTableSelection,
  processTableSelectionProps,
  dispatch,
  activeSelectIndex,
  setActiveSelectIndex,
  index,
  deleteTableAndUpdateView,
  deleteTableAndUpdateViewProps,
  selectRef,
  t,
  setShowDeleteTableModal,
  setEditTable
}) {
  const [currentTags, setCurrentTags] = useState(table?.tagsSection?.length > 0 ? table.tagsSection.map(tag => tag.name) : tags);

  const handleRemoveTag = (index) => {
    const newTags = currentTags.filter((_, i) => i !== index);
    setCurrentTags(newTags);
    onRemoveTag?.(index);
  };


  const handleExportTable = () => {
    console.log('exporting table', table)
    dispatch(exportTable(table))
  }

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <div className={styles.mainContent}>
          <div className={styles.flexContainer}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
              <div className={styles.iconContainer}>
                <ManyCoinIcon />
              </div>

              <div className={styles.infoSection}>
                <div className={styles.tableName}>
                  <div className={styles.tableNameText}>
                    <p>{table.name}</p>
                  </div>
                </div>

                <div className={styles.categorySection}>
                  <div className={styles.categoryLabel}>
                    <p>{t(table.type)}</p>
                  </div>
                  <div className={styles.privateSection}>
                    <div className={styles.lockIcon}>
                      {table.accessPermitType === "private" ?
                        // <svg fill="none" preserveAspectRatio="none" viewBox="0 0 7 9">
                        //   <path d="M3.5 0C4.7078 0 5.68728 0.906064 5.6875 2.02344V2.83301H6.125C6.6079 2.83301 6.99983 3.19585 7 3.64258V7.69043C7 8.13729 6.608 8.5 6.125 8.5H0.875C0.392005 8.5 0 8.13729 0 7.69043V3.64258C0.000165616 3.19585 0.392107 2.83301 0.875 2.83301H1.3125V2.02344C1.31272 0.906065 2.29219 2.15691e-06 3.5 0ZM3.5 0.80957C2.77517 0.80957 2.1876 1.35289 2.1875 2.02344V2.83301H4.8125V2.02344C4.8124 1.35289 4.22483 0.809571 3.5 0.80957Z" fill="#71717A" />
                        // </svg> 
                        <TableLockClose />
                        :
                       <TableLockOpen />
                      }
                    </div>
                    <div className={styles.privateText}>
                      <p>{ table.accessPermitType === "public" ? t("public") : t("private")}</p>
                    </div>
                  </div>

                </div>

                <div className={styles.storageSection}>
                  <div className={styles.storageText}>
                    <p style={{ margin: '0px' }}>{storageSize}</p>
                  </div>
                  <div className={styles.infoIcon}>
                    <svg fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
                      <path d="M5 0.9375C4.19651 0.9375 3.41107 1.17576 2.743 1.62215C2.07492 2.06855 1.55422 2.70302 1.24674 3.44535C0.939258 4.18767 0.858807 5.00451 1.01556 5.79255C1.17231 6.5806 1.55923 7.30447 2.12738 7.87262C2.69553 8.44077 3.4194 8.82769 4.20745 8.98444C4.99549 9.14119 5.81233 9.06074 6.55465 8.75326C7.29698 8.44578 7.93145 7.92508 8.37785 7.257C8.82424 6.58893 9.0625 5.80349 9.0625 5C9.06136 3.92291 8.63299 2.89026 7.87136 2.12863C7.10974 1.36701 6.07709 0.938637 5 0.9375ZM4.84375 2.8125C4.93646 2.8125 5.02709 2.83999 5.10417 2.8915C5.18126 2.94301 5.24134 3.01621 5.27682 3.10187C5.3123 3.18752 5.32158 3.28177 5.30349 3.3727C5.28541 3.46363 5.24076 3.54715 5.17521 3.61271C5.10965 3.67826 5.02613 3.72291 4.9352 3.74099C4.84427 3.75908 4.75002 3.7498 4.66437 3.71432C4.57871 3.67884 4.50551 3.61876 4.454 3.54167C4.40249 3.46459 4.375 3.37396 4.375 3.28125C4.375 3.15693 4.42439 3.0377 4.51229 2.94979C4.6002 2.86189 4.71943 2.8125 4.84375 2.8125ZM5.3125 7.1875C5.14674 7.1875 4.98777 7.12165 4.87056 7.00444C4.75335 6.88723 4.6875 6.72826 4.6875 6.5625V5C4.60462 5 4.52513 4.96708 4.46653 4.90847C4.40792 4.84987 4.375 4.77038 4.375 4.6875C4.375 4.60462 4.40792 4.52513 4.46653 4.46653C4.52513 4.40792 4.60462 4.375 4.6875 4.375C4.85326 4.375 5.01223 4.44085 5.12944 4.55806C5.24665 4.67527 5.3125 4.83424 5.3125 5V6.5625C5.39538 6.5625 5.47487 6.59542 5.53347 6.65403C5.59208 6.71263 5.625 6.79212 5.625 6.875C5.625 6.95788 5.59208 7.03737 5.53347 7.09597C5.47487 7.15458 5.39538 7.1875 5.3125 7.1875Z" fill="#343330" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.actionSection}>
              <div className={styles.topActions}>
                <div className={styles.authorSection}>
                  <div className={styles.authorInfo}>
                    <div className={styles.authorName}>
                      <p>{authorName}</p>
                    </div>
                    <div className={styles.starIcon}>
                      <svg fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
                        <path
                          d="M6 1.5L6.7151 4.15591C6.80235 4.48 6.846 4.64205 6.9321 4.77453C7.0083 4.89175 7.10825 4.99168 7.2255 5.0679C7.35795 5.154 7.52 5.19765 7.8441 5.2849L10.5 6L7.8441 6.7151C7.52 6.80235 7.35795 6.846 7.2255 6.9321C7.10825 7.0083 7.0083 7.10825 6.9321 7.2255C6.846 7.35795 6.80235 7.52 6.7151 7.8441L6 10.5L5.2849 7.8441C5.19765 7.52 5.154 7.35795 5.0679 7.2255C4.99168 7.10825 4.89175 7.0083 4.77453 6.9321C4.64205 6.846 4.48 6.80235 4.15591 6.7151L1.5 6L4.15591 5.2849C4.48 5.19765 4.64205 5.154 4.77453 5.0679C4.89175 4.99168 4.99168 4.89175 5.0679 4.77453C5.154 4.64205 5.19765 4.48 5.2849 4.15591L6 1.5Z"
                          fill="#10A37F"
                          stroke="#10A37F"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className={styles.timeInfo}>
                    <p>{table.createdAt ? formatAgoDate({ dateString: table.createdAt, t }) : t("just_now")}</p>
                  </div>
                </div>
                {/* aca es el boton de editar */}
                <button className={styles.actionButton} onClick={() => { setEditTable(index) }}>
                  <div className={styles.actionButtonBorder} />
                  <div className={styles.editIcon}>
                    <svg fill="none" preserveAspectRatio="none" viewBox="0 0 13 13">
                      <path d="M9.62217 1.08333C9.3208 1.08238 9.02224 1.14131 8.74384 1.25671C8.46544 1.3721 8.21274 1.54166 8.00042 1.75554L1.70896 8.04646C1.62826 8.12729 1.57517 8.23156 1.55729 8.34438L1.08983 11.29C1.07636 11.3745 1.0831 11.461 1.1095 11.5424C1.1359 11.6238 1.18121 11.6978 1.24173 11.7583C1.30224 11.8188 1.37623 11.8641 1.45763 11.8905C1.53903 11.9169 1.62553 11.9236 1.71004 11.9102L4.65833 11.4427C4.77115 11.4248 4.87542 11.3717 4.95625 11.291L11.2445 4.99958C11.5653 4.6785 11.7836 4.26949 11.8719 3.82428C11.9603 3.37908 11.9145 2.91768 11.7406 2.49846C11.5666 2.07923 11.2723 1.72102 10.8947 1.46912C10.5171 1.21723 10.0733 1.08297 9.61946 1.08333H9.62217ZM4.31167 10.4L2.275 10.725L2.6 8.68996L7.14458 4.14483L8.85733 5.85758L4.31167 10.4ZM10.4785 4.23367L9.62271 5.09167L7.90833 3.37729L8.76471 2.52146C8.99536 2.3013 9.30196 2.17845 9.62081 2.17845C9.93967 2.17845 10.2463 2.3013 10.4769 2.52146C10.5894 2.63384 10.6787 2.7673 10.7396 2.91419C10.8004 3.06109 10.8318 3.21855 10.8318 3.37756C10.8318 3.53658 10.8004 3.69404 10.7396 3.84093C10.6787 3.98783 10.5894 4.12128 10.4769 4.23367H10.4785Z" fill="black" />
                    </svg>
                  </div>
                </button>

                <button className={styles.addRelationButton} onClick={onAddRelation}>
                  <div className={styles.actionButtonBorder} />
                  <div className={styles.addRelationIcon}>
                    <svg fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
                      <path
                        d="M5.25 9.91667H4.08333C3.30979 9.91667 2.56792 9.60938 2.02094 9.0624C1.47396 8.51541 1.16667 7.77355 1.16667 7C1.16667 6.22645 1.47396 5.48459 2.02094 4.93761C2.56792 4.39062 3.30979 4.08333 4.08333 4.08333H5.25"
                        stroke="black"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.16667"
                        fill="none"
                      />
                      <path
                        d="M8.75 4.08333H9.91667C10.6902 4.08333 11.4321 4.39062 11.9791 4.93761C12.526 5.48459 12.8333 6.22645 12.8333 7C12.8333 7.77355 12.526 8.51541 11.9791 9.0624C11.4321 9.60938 10.6902 9.91667 9.91667 9.91667H8.75"
                        stroke="black"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.16667"
                        fill="none"
                      />
                      <path
                        d="M4.66667 7H9.33333"
                        stroke="black"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.16667"
                        fill="none"
                      />
                    </svg>
                  </div>
                  <div className={styles.addRelationText}>
                    <p>Añadir relación</p>
                  </div>
                </button>

                <button onClick={() => processTableSelection(
                  table,
                  dispatch,
                  processTableSelectionProps.setShowPopupNewContact,
                  processTableSelectionProps.setShowPopup,
                  processTableSelectionProps.setActiveTable,
                  processTableSelectionProps.setShowNewContact,
                  processTableSelectionProps.setShowNewAsset,
                  processTableSelectionProps.setShowNewBill,
                  processTableSelectionProps.createData)
                } className={styles.addRecordButton} >
                  <div className={styles.addRecordIcon}>
                    <svg fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
                      <path
                        d="M2.91667 7H11.0833"
                        stroke="white"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.16667"
                        fill="none"
                      />
                      <path
                        d="M7 2.91667V11.0833"
                        stroke="white"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.16667"
                        fill="none"
                      />
                    </svg>
                  </div>
                  <div className={styles.addRecordText}>
                    <p> {`${t("new")} ${table.type !== "blank" ? t(table.type) : t("element")} `}</p>
                  </div>
                </button>

                <button onClick={() => { setActiveSelectIndex(index === activeSelectIndex ? null : index) }} className={styles.moreOptionsButton} >
                  <div className={styles.actionButtonBorder} />
                  <div className={styles.moreOptionsIcon}>
                    <svg fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
                      <path
                        d="M7 7.58333C7.32217 7.58333 7.58333 7.32217 7.58333 7C7.58333 6.67783 7.32217 6.41667 7 6.41667C6.67783 6.41667 6.41667 6.67783 6.41667 7C6.41667 7.32217 6.67783 7.58333 7 7.58333Z"
                        stroke="black"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.16667"
                        fill="none"
                      />
                      <path
                        d="M11.0833 7.58333C11.4055 7.58333 11.6667 7.32217 11.6667 7C11.6667 6.67783 11.4055 6.41667 11.0833 6.41667C10.7612 6.41667 10.5 6.67783 10.5 7C10.5 7.32217 10.7612 7.58333 11.0833 7.58333Z"
                        stroke="black"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.16667"
                        fill="none"
                      />
                      <path
                        d="M2.91667 7.58333C3.23883 7.58333 3.5 7.32217 3.5 7C3.5 6.67783 3.23883 6.41667 2.91667 6.41667C2.5945 6.41667 2.33333 6.67783 2.33333 7C2.33333 7.32217 2.5945 7.58333 2.91667 7.58333Z"
                        stroke="black"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.16667"
                        fill="none"
                      />
                    </svg>
                  </div>
                </button>

                {activeSelectIndex === index && (
                  <div className={styles.selectContainer} ref={selectRef}>
                    <div
                      onClick={() =>
                        setShowDeleteTableModal(index)
                      }>
                      {t("delete")}
                    </div>
                    <div

                      onClick={() =>
                        // setShowDeleteTableModal(index)
                        handleExportTable()
                      }>
                      {t("exportar")}
                    </div>
                  </div>
                )}
              </div>

              <div className={styles.tagsSection}>
                {table.selectedTags.map((tag, index) => (
                  <div key={index} className={styles.tag} style={{ backgroundColor: tag.color + '50' }}>
                    <div className={styles.tagText}>
                      <p style={{ color: tag.color }}>{tag.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}