import React from 'react'
import styles from '../InfoExploreCommunity.module.css'
const Document = ({data}) => {
  return (
    <div className={styles.documentImageHeaderContainer}>
{data?.image ? <img src={data?.image} alt="document" /> : <div className={styles.documentDefault}></div>}
    </div>
  )
}

export default Document