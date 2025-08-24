import React, { useState, useEffect } from "react";
import styles from "./RulesFilterAvanced.module.css";
import CustomAutomationsWrapper from "../../../../../CustomAutomationsWrapper/CustomAutomationsWrapper";
import CustomDropdown from "../../../../../CustomDropdown/CustomDropdown";
import FiltersAndVariablesOut from "../../../FiltersAndVariablesOut/FiltersAndVariablesOut";
import { useTranslation } from "react-i18next";
import FiltersAndVariablesOut2 from "../../../FiltersAndVariablesOut/FiltersAndVariablesOut2";

const RulesFilterAvanced = ({
  handleConfigurationChange,
  configuration,
  formAutomateContainerRef,
  type,
  setShowVariableModal,
  setTypeVariableModal,
  selectedAutomates,
  setSelectedAutomates
}) => {
  const [t] = useTranslation('AutomatesComponent')

  const [showContent, setShowContent] = useState({
    info1: false,
    info2: false,
    info3: false,
    info4: false,
    info5: false,
    info6: false,
    info7: false,
    info8: false,
    info9: false,
  });
 
  useEffect(() => {
    if (
      configuration?.showContentRulesFilterAvanced &&
      JSON.stringify(configuration?.showContentRulesFilterAvanced) !==
        JSON.stringify(showContent)
    ) {
      setShowContent(configuration?.showContentRulesFilterAvanced);
    }
  }, [configuration?.showContentRulesFilterAvanced]);

  const [showSelectOutputLocation, setShowSelectOutputLocation] =
    useState(false);



  const handleSetShowContent = (infoNumber) => {
    handleConfigurationChange("showContentRulesFilterAvanced", {
      ...showContent,
      [infoNumber]: !showContent[infoNumber],
    });
  };

  return (
    <>
      <FiltersAndVariablesOut2
        handleConfigurationChange={handleConfigurationChange}
        configuration={configuration}
        from="RulesFilterAvanced"
        setShowSelectOutputLocation={setShowSelectOutputLocation}
        formAutomateContainerRef={formAutomateContainerRef}
        type={type}
        setShowVariableModal={setShowVariableModal}
        setTypeVariableModal={setTypeVariableModal}
        setSelectedAutomates={setSelectedAutomates}
        selectedAutomates={selectedAutomates}
      />

     
    </>
  );
};

export default RulesFilterAvanced;
