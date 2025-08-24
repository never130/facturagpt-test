import React, { useState } from "react";
import styles from "../CreateParameterPopup.module.css";
import LabelParameters from "../LabelParameters";
import BasicAdvancedSelector from "../components/BasicAdvancedSelector";
import { useTranslation } from "react-i18next";
import EditableField from "../components/EditableField";
import Button from "../../Button/Button";
import DynamicTable from "../../DynamicTable/DynamicTable";
import OptionsSwitchComponent from "../../OptionsSwichComponent/OptionsSwitchComponent";

const Email = ({
  parameterData,
  handleChange,
  editingInput,
  setEditingInput,
}) => {
  const [t] = useTranslation("");
  const [emailInput, setEmailInput] = useState("");

  const handleModeChange = (mode) => {
    handleChange({ target: { name: 'mode', value: mode } });
  };

  // Función para validar formato de email
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleAddEmails = () => {
    if (!emailInput.trim()) return;

    // Separar los correos por comas y limpiar espacios
    const emails = emailInput
      .split(',')
      .map(email => email.trim())
      .filter(email => email.length > 0);

    if (emails.length === 0) return;

    // Obtener los emails existentes
    const existingEmails = parameterData.emails || [];
    
    // Filtrar emails válidos y no duplicados
    const validNewEmails = emails
      .filter(email => {
        // Validar formato de email
        if (!isValidEmail(email)) {
          console.warn(`Email inválido: ${email}`);
          return false;
        }
        
        // Verificar si ya existe
        const alreadyExists = existingEmails.some(existing => 
          existing.email.toLowerCase() === email.toLowerCase()
        );
        
        if (alreadyExists) {
          console.warn(`Email duplicado: ${email}`);
          return false;
        }
        
        return true;
      })
      .map(email => ({ email }));

    if (validNewEmails.length === 0) {
      console.warn('No se agregaron emails: todos eran inválidos o duplicados');
      return;
    }
    
    // Combinar emails existentes con nuevos emails válidos
    const updatedEmails = [...existingEmails, ...validNewEmails];
    
    // Actualizar parameterData.emails
    handleChange({ 
      target: { 
        name: 'email', 
        value: updatedEmails 
      } 
    });

    // Vaciar el campo de entrada
    setEmailInput("");
  };

  const tableHeaders = [
    { label: t(""), key: "" },
    { label: 'example@example.com', key: "email" },
  ];

  const renderRow = (item, index) => {
    return (
      <tr key={index}>
        <td><input type="checkbox" /></td>
        <td>{item.email}</td>
      </tr>
    );
  };

  return (
    <div>
      <BasicAdvancedSelector
        selectedMode={parameterData.mode}
        onModeChange={handleModeChange}
      />
        <>
         <div className={styles.addEmailContainer}>
         <EditableField
            title={t("email")}
            type="text"
            name="email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            placeholder="example@example.com, example@example.com"
          />
          <Button 
            type='white' 
            headerStyle={{borderRadius:"999px"}}
            action={handleAddEmails}
          >
            {t('addEmail')}
          </Button>
         </div>
          <DynamicTable
            columns={tableHeaders}
            data={parameterData.email || []}
            renderRow={renderRow}
            hideCheckbox={true}
            father={"pricing"}
          />
        </>
        
        {parameterData.mode !== "basic" && (
          <div className={styles.corporateEmailContainer}>
             <OptionsSwitchComponent
                    border={"none"}
                    marginLeft={"0"}
                    isChecked={parameterData?.corporateEmailOnly || false}
                    setIsChecked={(value) => {
                      if(parameterData?.corporateEmailOnly){
                        handleChange({ target: { name: 'corporateEmailOnly', value: false } })
                      } else {
                        handleChange({ target: { name: 'corporateEmailOnly', value: true } })
                      }
                      // handleChange("corporateEmailOnly", value)
                      }
                    }
                  />
                  <p>{t("corporateEmailOnly")}</p>
          </div>
        )}
    </div>
  );
};

export default Email;
