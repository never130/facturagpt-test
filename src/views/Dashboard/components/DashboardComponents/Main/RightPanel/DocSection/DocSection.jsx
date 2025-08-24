import React from 'react'
import styles from '../DataItemCard/DataItemCard.module.css'
import { ReactComponent as PdfIcon2 } from "../../../../../assets/pdfIcon2.svg";
import { useSelector } from 'react-redux'
import DataItemCard from '../DataItemCard/DataItemCard';

const DocSection = () => {
    const { tables, contactsTable, assetsTable, docsTable, tablesFiltered } =
    useSelector((state) => state.user);

    console.log('docsTable',docsTable)
  return (
    <div>
      {docsTable.map((doc) => (
      <DataItemCard
      data={doc}
      type="doc"
      showPercentage={true}
      className={styles.docItem}
      />
      ))}
    </div>
  )
}

export default DocSection