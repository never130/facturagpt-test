import React, { useState } from "react";
import styles from "./ArticlesTransactions.module.css";
import optionDots from "../../assets/optionDots.svg";
import DynamicTable from "../../components/DynamicTable/DynamicTable";
import PanelTemplate from "../../components/PanelTemplate/PanelTemplate";
import { ReactComponent as Arrow } from "../../assets/ArrowLeftWhite.svg";
import KIcon from "../../assets/KIcon.svg";
import emptyimage from "../../assets/ImageEmpty.svg";
import { useSelector } from "react-redux";
import SkeletonScreen from "../../components/SkeletonScreen/SkeletonScreen";
import ClientsHeader from "../../components/ClientsHeader/ClientsHeader";
import { ReactComponent as DownloadIcon } from "../../assets/downloadIcon.svg";
import { useTranslation } from "react-i18next";

const ArticlesTransactions = () => {
  const {t} = useTranslation('ArticlesTransactions')
  const [selectedIds, setSelectedIds] = useState([]);
  const { contacts } = useSelector((state) => state.contacts);

  const tableHeaders = [
    {label:t('nameOrDescription'), key:"name"},
    {label:t('date'),key:"date"},
    {label:t('quantity'),key:"quantity"},
    {label:t('unitPrice'), key:"unitPrice"},
    {label:t('subtotal'), key:"subtotal"},
    {label:t('tax'), key:"tax"},
    {label:t('paid'), key:"paid"},
    {label:t('paymentMethod'), key:"paymentMethod"},
    "",
  ];

  const tableData = [
    {
      img: "",
      name: "Producto A",
      date: "25 Dec 2025",
      quantity: 1,
      priceUnit: "00,00EUR",
      tax: ["No", "Sí,21%"],
      state: "Pagado",
      payMethod: "Mastercard ****5678",
    },
    {
      img: "",
      name: "Producto A",
      date: "25 Dec 2025",
      quantity: 1,
      priceUnit: "00,00EUR",
      tax: ["No", "Sí,21%"],
      state: "Pagado",
      payMethod: "Mastercard ****5678",
    },
  ];

  const toggleSelection = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedIds(
      selectedIds.length === tableData.length
        ? []
        : tableData.map((_, index) => index)
    );
  };

  const renderRow = (row, index, onSelect) => (
    <tr key={index}>
      <td>
        <input
          type="checkbox"
          onChange={() => onSelect(index)}
          checked={selectedIds.includes(index)}
        />
      </td>
      <td className={styles.imgContainer}>
        <p>
          <img src={row.img || emptyimage} alt="" />
          {row.name}
        </p>
      </td>
      <td>{row.date}</td>
      <td>{row.quantity}</td>
      <td>{row.priceUnit}</td>
      <td>{row.priceUnit}</td>
      <td>
        {Array.isArray(row.tax)
          ? row.tax.map((item, i) => <p key={i}>{item}</p>)
          : row.tax}
      </td>
      <td className={styles.rowState}>{row.state}</td>
      <td>{row.payMethod}</td>
      <td className={styles.actions}>
        <div className={styles.transacciones}>
          <a href="#">stripe</a>
          <span>{t('refund')}</span>
        </div>
        <div>
          <img src={optionDots} alt="Opciones" />
        </div>
      </td>
    </tr>
  );
  const [selectedFileS3, setSelectedFileS3] = useState(null);
  const [swiped, setSwiped] = useState(false);
  const [fileNameS3, setFileNameS3] = useState(null);
  return (
    <PanelTemplate setSwiped={setSwiped} swiped={swiped}
    setSelectedFileS3={setSelectedFileS3} 
    setFileNameS3={setFileNameS3}>
      <div className={styles.container}>
        <ClientsHeader
          additionalInfo={
            <>
              <div className={styles.infoClient}>
                <div className={styles.arrowContainer}>
                  <div
                    className={styles.iconContainer}
                    onClick={() => navigate("/admin/clients")}
                  >
                    <Arrow />
                  </div>
                  <h3>
                    {contacts?.clientData?.clientName || t('documentTitle')}
                  </h3>
                </div>
                <div className={styles.clientInfo}>
                  <div className={styles.contactInfo}>
                    <span>{contacts?.code || "T001"}</span>
                    <span>{contacts?.name || "FacturaGPT"}</span>
                    <span>{contacts?.email || "info@FacturaGPT.com"}</span>
                    <span>
                      {contacts?.clientData?.codeCountry || "+34"}{" "}
                      {contacts?.clientData?.numberPhone || "600 798 012"}
                    </span>
                  </div>

                  <div className={styles.info}>
                    <p>{t('category')}</p>
                    <span>{t('spent')}</span>
                    <p>{t('date')}</p>
                    <span>25 Dec 2025</span>
                    <p>{t('assets')}</p>
                    <span>0</span>
                    <p>{t('subtotal')}</p>
                    <span>0,00</span>
                    <span>EUR</span>
                    <p>{t('vat')}</p>
                    <span>21%</span>
                    <span>No</span>
                    <p>{t('total')}</p>
                    <span>0,00</span>
                    <span>EUR</span>
                    <p>{t('state')}</p>
                    <span>{t('paid')}</span>
                  </div>
                </div>
              </div>
            </>
          }
          buttons={[
            {
              label: <>{t('editContact')}</>,
              type: "button",
              onClick: () => console.log("Crear nuevo activo"),
            },
            {
              label: <DownloadIcon />,
              headerStyle: { padding: "6px 10px" },
              type: "white",
              onClick: () => setShowNewClient(true),
            },
          ]}
          searchProps={
            {
            }
          }
          searchChildren={
            <>
              <div
                style={{ marginLeft: "5px" }}
                className={styles.searchIconsWrappers}
              >
                <img src={KIcon} alt="kIcon" />
              </div>
            </>
          }
        />

        
        {tableData.length == 0 ? (
          <SkeletonScreen
            labelText={t('noDocumentsFound')}
            helperText={t('allTransactionsListedHere')}
            showInput={true}
            enableLabelClick={false}
          />
        ) : (
          <DynamicTable
            columns={tableHeaders}
            data={tableData}
            renderRow={renderRow}
            selectedIds={selectedIds}
            onSelectAll={selectAll}
            onSelect={toggleSelection}
          />
        )}
      </div>
    </PanelTemplate>
  );
};

export default ArticlesTransactions;
