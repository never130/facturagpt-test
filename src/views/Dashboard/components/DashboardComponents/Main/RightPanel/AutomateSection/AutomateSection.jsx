import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next';
import CardAutomate from '../../../../Automate/Components/CardAutomate/CardAutomate';
import AutomateDataComponent from '../../../../Automate/utils/automatesJson';

const AutomateSection = () => {
    const { t } = useTranslation();
  const { userAutomations } = useSelector((state) => state.automate);

  // Variables faltantes que necesitamos definir
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedAutomateToDelete, setSelectedAutomateToDelete] = useState(null);
  const [hideAutomate, setHideAutomate] = useState(false);
  const [roleAutomate, setRoleAutomate] = useState('');

  const [selectedOption, setSelectedOption] = useState({
    [t("alphabeticOrder")]: "A-Z",
    [t("orderByType")]: t("all"),
  });

  // Función placeholder para handleShowContentAutomate
  const handleShowContentAutomate = () => {
    // Implementar lógica aquí
  };

  // Función placeholder para handleCloseNewClient
  const handleCloseNewClient = () => {
    // Implementar lógica aquí
  };

  // Función placeholder para close
  const close = () => {
    // Implementar lógica aquí
  };

  const options = [
    {
      name: "Orden Alfabético",
      label: t("alphabeticOrder"),
      subOptions: [
        { display: "A-Z", value: "A-Z" },
        { display: "Z-A", value: "Z-A" },
      ],
    },
    {
      name: t("orderByType"),
      label: t("orderByType"),
      subOptions: [
        { display: t("all"), value: t("all") },
        { display: t("input"), value: t("input") },
        { display: t("output"), value: t("output") },
      ],
    },
    {
      name: t("orderByCategory"),
      label: t("orderByCategory"),
      subOptions: [
        { display: t("Import"), value: t("Import") },
        { display: t("ERP"), value: t("ERP") },
        { display: t("CRM"), value: t("CRM") },
        {
          display: t("PublicAdministration"),
          value: t("PublicAdministration"),
        },
        { display: t("Files"), value: t("Files") },
        { display: t("Communications"), value: t("Communications") },
        { display: t("Meetings"), value: t("Meetings") },
        { display: t("AI"), value: t("AI") },
        { display: t("HR"), value: t("HR") },
        { display: t("Logistics"), value: t("Logistics") },
        { display: t("Fintech"), value: t("Fintech") },
        { display: t("Ecommerce"), value: t("Ecommerce") },
      ],
    },
    {
      name: "date",
      label: t("date"),
      subOptions: [
        { display: t("1month"), value: "1month" },
        { display: t("3month"), value: "3month" },
        { display: t("6month"), value: "6month" },
        { display: t("1year"), value: "1year" },
      ],
    },
  ];

  // Crear una copia del array para evitar el error de solo lectura
  let filteredData = userAutomations ? [...userAutomations] : [];
  
  const data = AutomateDataComponent();

  console.log('data', data)

  return (
    <div>
      {filteredData?.length > 0 &&
        filteredData
          .sort((a, b) => {
            const order = selectedOption[t("alphabeticOrder")];
            const nameA = (
              a.inputValue ||
              a.type ||
              ""
            ).toLowerCase();
            const nameB = (
              b.inputValue ||
              b.type ||
              ""
            ).toLowerCase();
            if (order === "A-Z") return nameA.localeCompare(nameB);
            if (order === "Z-A") return nameB.localeCompare(nameA);
            return 0;
          })
          .slice(page * limit, (page + 1) * limit)
          .map((card, i) => {
            const filteredAutomation = data.find(
              (automation) => automation?.type === card?.type
            );
            return (
              <CardAutomate
                key={card.id}
                index={i}
                loadingTime={card.selectedActionFrequency || 0}
                fullContent={true}
                type={filteredAutomation?.type}
                handleShowContentAutomate={handleShowContentAutomate}
                name={filteredAutomation?.automateName}
                nameTitle={card.inputValue}
                image={filteredAutomation?.image}
                rol={filteredAutomation?.role}
                automationData={card}
                isBorders={true}
                last={i === filteredData.length - 1}
                id={card.id}
                fromWhere={"selectedAutomate"}
                searchTerm={searchTerm}
                handleCloseNewClient={handleCloseNewClient}
                showDeletePopup={showDeletePopup}
                setShowDeletePopup={setShowDeletePopup}
                setSelectedAutomateToDelete={
                  setSelectedAutomateToDelete
                }
                close={close}
                setHideAutomate={setHideAutomate}
                setRoleAutomate={setRoleAutomate}
              />
            );
          })}
    </div>
  );
};

export default AutomateSection;