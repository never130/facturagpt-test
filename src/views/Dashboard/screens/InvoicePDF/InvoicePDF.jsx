import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { getInvoicePdf } from '../../../../actions/user'
import styles from './InvoicePDF.module.css'

const InvoicePDF = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const [pdfUrl, setPdfUrl] = useState(null)

  useEffect(() => {
    const fetchInvoicePdf = async () => {
      const response = await dispatch(getInvoicePdf({ invoiceId: id }))
      if (response.payload && response.payload) {
        setPdfUrl(response.payload.pdfBase64)
      }
    }
    fetchInvoicePdf()
  }, [id, dispatch])

  return (
    <div className={styles.InvoicePDFContainer}>
      {pdfUrl ? (
        <embed
          src={pdfUrl}
          type="application/pdf"
          width="100%"
          height="100%"
        />
      ) : (
        <p>Cargando PDF...</p>
      )}
    </div>
  )
}

export default InvoicePDF
