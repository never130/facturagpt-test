import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../Button/Button';
import styles from '../CreateParameterPopup.module.css';
import LabelParameters from '../LabelParameters';
import BasicAdvancedSelector from '../components/BasicAdvancedSelector';
import EditableField from '../components/EditableField';
import DynamicTable from '../../DynamicTable/DynamicTable';
import OptionsSwitchComponent from '../../OptionsSwichComponent/OptionsSwitchComponent';

const Url = ({ parameterData, handleChange, editingInput, setEditingInput }) => {
  const [t] = useTranslation("Contacts");

  const handleModeChange = (mode) => {
    handleChange({ target: { name: 'mode', value: mode } });
  };

  const [urlInput, setUrlInput] = useState("");

  const handleAddUrls = () => {
    if (!urlInput.trim()) return;
    const urls = urlInput.split(',').map(url => url.trim());
    handleChange({ target: { name: 'url', value: urls } });
    setUrlInput("");
  };

  const tableHeaders = [
    { label: t(""), key: "" },
    { label: 'https://www.example.com', key: "url" },
  ];

  const renderRow = (item, index) => {
    return (
      <tr key={index}>
        <td><input type="checkbox" /></td>
        <td>{item}</td>
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
          title={t("url")}
          type="text"
          name="url"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="https://www.example.com"
        />
        <Button 
          type='white' 
          headerStyle={{borderRadius:"999px"}}
          action={handleAddUrls}
        >
          {t('addUrl')}
        </Button>
       </div>
        <DynamicTable
          columns={tableHeaders}
          data={parameterData.url || []}
          renderRow={renderRow}
          hideCheckbox={true}
          father={"pricing"}
        />
      </>
    {parameterData.mode !== "basic" && (
    <>
      <div className={styles.corporateEmailContainer}>
         <OptionsSwitchComponent
                border={"none"}
                marginLeft={"0"}
                isChecked={parameterData?.ignoreHttp || false}
                setIsChecked={() =>
                {
                  if(parameterData?.ignoreHttp){
                    handleChange({ target: { name: 'ignoreHttp', value: false } })
                  } else {
                    handleChange({ target: { name: 'ignoreHttp', value: true } })
                  }
                }
                }
              />
              <p>{t("ignoreHttp")}</p>
      </div>
      <div className={styles.corporateEmailContainer}>
         <OptionsSwitchComponent
                border={"none"}
                marginLeft={"0"}
                isChecked={parameterData?.ignoreExtension || false}
                setIsChecked={() =>
                  {
                    if(parameterData?.ignoreExtension){
                      handleChange({ target: { name: 'ignoreExtension', value: false } })
                    } else {
                      handleChange({ target: { name: 'ignoreExtension', value: true } })
                    }
                  }
                }
              />
              <p>{t("ignoreExtension")}</p>
      </div>
    </>
    )}
  </div>
  )
}

export default Url