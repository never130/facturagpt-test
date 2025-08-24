import React, { useState } from "react";
import styles from "../RightPanel.module.css";
import { useSelector } from "react-redux";
import DataItemCard from "../DataItemCard/DataItemCard";

const ContactsSection = () => {
  const { tables, contactsTable, assetsTable, docsTable, tablesFiltered } =
    useSelector((state) => state.user);
  const [selectedTags, setSelectedTags] = useState([]);
  const [tags, setTags] = useState([]);

  const handleCopy = (contact) => {
    // Lógica para copiar información del contacto
    console.log("Copiando contacto:", contact);
  };

  const handleAddTags = (contact) => {
    // Lógica para agregar tags al contacto
    console.log("Agregando tags a:", contact);
  };

  const handlePhoneClick = (contact) => {
    // Lógica para manejar clic en teléfono
    console.log("Llamando a:", contact);
  };

  const handleWebClick = (contact) => {
    // Lógica para manejar clic en sitio web
    if (contact.webSite) {
      window.open(contact.webSite, '_blank');
    }
  };

  const handleEmailClick = (contact) => {
    // Lógica para manejar clic en email
    if (contact.companyEmail) {
      window.open(`mailto:${contact.companyEmail}`);
    }
  };

  const handleRemoveTag = (contact, tagIndex) => {
    // Lógica para remover tag del contacto
    const nuevasTags = contact.selectedTags.filter(
      (_, i) => i !== tagIndex
    );
    setSelectedTags(nuevasTags);
    // Aquí podrías actualizar el estado global o hacer una llamada a la API
  };

  const handleOptionsClick = (contact) => {
    // Lógica para manejar clic en opciones
    console.log("Opciones para:", contact);
  };

  return (
    <div>
      {contactsTable.map((contact) => (
        <DataItemCard
          key={contact._id}
          data={contact}
          type="contact"
          onCopy={handleCopy}
          onAddTags={handleAddTags}
          onPhoneClick={handlePhoneClick}
          onWebClick={handleWebClick}
          onEmailClick={handleEmailClick}
          onRemoveTag={handleRemoveTag}
          onOptionsClick={handleOptionsClick}
          showPercentage={true}
          showTransactions={true}
          className={styles.contactAssetItem}
        />
      ))}
    </div>
  );
};

export default ContactsSection;
