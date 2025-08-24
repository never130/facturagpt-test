import React, { useState } from 'react'
import LabelParameters from '../LabelParameters'
import styles from '../CreateParameterPopup.module.css'
import EditableField from '../components/EditableField'
import Button from '../../Button/Button'
import { useTranslation } from 'react-i18next'
import DynamicTable from '../../DynamicTable/DynamicTable'

const Percentage = ({parameterData, handleChange,editingInput,setEditingInput}) => {
  const [t] = useTranslation("");
  const [percentages, setPercentages] = useState( parameterData.percentage || []);
  const [currentRateName, setCurrentRateName] = useState('');
  const [currentPercentage, setCurrentPercentage] = useState('');
  const [currentCompound, setCurrentCompound] = useState(false);
  const [toggleCollapse, setToggleCollapse] = useState(false);

  const tableHeaders = [
    { label: t(""), key: "" },
    { label: t("rateName"), key: "rateName" },
    { label: t("rate"), key: "rate" },
    { label: t("compound"), key: "compound" },
  ];

  const handleAcceptClick = () => {
    if (currentPercentage) {
      const newPercentage = {
        title: currentRateName,
        value: currentPercentage,
        rateCompound: currentCompound
      };
      
      setPercentages([...percentages, newPercentage]);
      handleChange({ target: { name: "percentage", value: [...percentages, newPercentage] } });
      setCurrentPercentage('');
      setCurrentRateName('');
      setCurrentCompound(false);
    }
  };

  const renderRow = (item, index) => {
    return (
      <tr key={index}>
        <td><input type="checkbox" /></td>
        <td>{item.title || '-'}</td>
        <td>{item.value}%</td>
        <td>{item.rateCompound ? t('yes') : t('no')}</td>
      </tr>
    );
  };

  return (
   <div className={styles.percentageContainer}>
   {/* <input
        name="textbox"
        value={parameterData.percentage}
        onChange={handleChange}
        placeholder={'00.00'}
      /> */}
      <Button type='white' headerStyle={{borderRadius:"999px", marginLeft:"auto"}} action={() => setToggleCollapse(!toggleCollapse)}>{t('addPercent')}</Button>
      {toggleCollapse && (
    <div className={styles.addPercentContainer}>
      <input type="text" placeholder={t('rateName')} value={currentRateName} onChange={(e) => setCurrentRateName(e.target.value)}/>
      <input type="number" placeholder={t('value')} value={currentPercentage} onChange={(e) => setCurrentPercentage(e.target.value)}/>
    {/* <EditableField  
        title={'%'}
        type="number"
        name="percentage"
        value={currentPercentage}
        onChange={(e) => setCurrentPercentage(e.target.value)}
        placeholder='00.00'
      /> */}
      <label style={{flexDirection:"row", display:"flex", alignItems:"center", gap:"5px"}}>
      <input
        type="checkbox"
        checked={currentCompound}
        onChange={(e) => setCurrentCompound(e.target.checked)}
      />
      <span className={styles.compoundRateText}>{t('compoundRate')}</span>
      </label>
      <Button action={handleAcceptClick} headerStyle={{borderRadius:"999px"}}>{t('accept')}</Button>
    </div>
  )}
    <DynamicTable
            columns={tableHeaders}
            data={percentages}
            renderRow={renderRow}
            hideCheckbox={true}
            father={"pricing"}
          />
   </div>

  )
}

export default Percentage