import React, { useState } from "react";
import styles from "../RightPanel.module.css";
import { useSelector } from "react-redux";
import DataItemCard from "../DataItemCard/DataItemCard";

const AssetsSection = () => {
  const { tables, contactsTable, assetsTable, docsTable, tablesFiltered } =
    useSelector((state) => state.user);
  const [selectedTags, setSelectedTags] = useState([]);
  const [tags, setTags] = useState([]);

  const handleCopy = (asset) => {
    // Lógica para copiar información del asset
    console.log("Copiando asset:", asset);
    // Aquí podrías copiar al portapapeles la información del asset
    navigator.clipboard.writeText(JSON.stringify(asset, null, 2));
  };

  const handleAddTags = (asset) => {
    // Lógica para agregar tags al asset
    console.log("Agregando tags a:", asset);
  };

  const handlePhoneClick = (asset) => {
    // Lógica para manejar clic en teléfono del asset
    console.log("Llamando desde asset:", asset);
  };

  const handleWebClick = (asset) => {
    // Lógica para manejar clic en sitio web del asset
    if (asset.website || asset.webSite) {
      const website = asset.website || asset.webSite;
      const formattedWebsite = website.startsWith('http://') || website.startsWith('https://')
        ? website
        : `https://${website}`;
      window.open(formattedWebsite, '_blank');
    }
  };

  const handleEmailClick = (asset) => {
    // Lógica para manejar clic en email del asset
    if (asset.email || asset.contactEmail) {
      const email = asset.email || asset.contactEmail;
      window.open(`mailto:${email}`);
    }
  };

  const handleRemoveTag = (asset, tagIndex) => {
    // Lógica para remover tag del asset
    const nuevasTags = asset.selectedTags?.filter(
      (_, i) => i !== tagIndex
    ) || [];
    setSelectedTags(nuevasTags);
    // Aquí podrías actualizar el estado global o hacer una llamada a la API
  };

  const handleOptionsClick = (asset) => {
    // Lógica para manejar clic en opciones del asset
    console.log("Opciones para asset:", asset);
  };

  // Función para obtener campos personalizados específicos de assets
  const getCustomFields = (asset) => {
    const customFields = {};
    
    if (asset.category) customFields.Categoría = asset.category;
    if (asset.location) customFields.Ubicación = asset.location;
    if (asset.status) customFields.Estado = asset.status;
    if (asset.purchaseDate) customFields['Fecha Compra'] = new Date(asset.purchaseDate).toLocaleDateString();
    if (asset.warranty) customFields.Garantía = asset.warranty;
    
    return customFields;
  };

  return (
    <div>
      {assetsTable.map((asset) => (
        <DataItemCard
          key={asset._id}
          data={asset}
          type="asset"
          onCopy={handleCopy}
          onAddTags={handleAddTags}
          onPhoneClick={handlePhoneClick}
          onWebClick={handleWebClick}
          onEmailClick={handleEmailClick}
          onRemoveTag={handleRemoveTag}
          onOptionsClick={handleOptionsClick}
          showPercentage={true}
          showTransactions={true}
          customFields={getCustomFields(asset)}
          className={styles.contactAssetItem}
        />
      ))}
    </div>
  );
};

export default AssetsSection;
