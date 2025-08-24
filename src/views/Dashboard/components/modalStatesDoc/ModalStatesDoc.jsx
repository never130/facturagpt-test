
import ModalBlackBgTemplate from "../ModalBlackBgTemplate/ModalBlackBgTemplate";
import HeaderCard from "../HeaderCard/HeaderCard";
import styles from "./ModalStatesDoc.module.css";
import useCloseOnEsc from "../../../../utils/useClose";
import { useTranslation } from "react-i18next";
import DynamicTable from "../DynamicTable/DynamicTable";

const ModalStatesDoc = ({
  icons,
  tableHeaders,
  statesStripe,
  renderRow,
  optionsName,
  setShowStatesStripes
}) => {
  const [t] = useTranslation('Preview')
  const close = () => {
    setShowStatesStripes(false);
  };

  useCloseOnEsc(setShowStatesStripes)
const setOrderedTable=() => {}
  return (
    <div>
      <ModalBlackBgTemplate
        close={close}
        customStyle={{
          maxHeight: "fit-content",
          minHeight: "fit-content",
          width: "600px",
          overflow:"initial"
        }}>
        <HeaderCard
          title={t('stateHistory')}
          setState={setShowStatesStripes}
        >
        </HeaderCard>
        <div className={styles.BeforeApproving}>
             <DynamicTable 
              columns={tableHeaders}
              data={statesStripe}
              renderRow={renderRow}
              hideCheckbox={true}
              icons={icons}
              limit={15}
              states={optionsName}
              setOrderedTable={setOrderedTable}
              />
        </div>
      </ModalBlackBgTemplate>
    </div>
  );
};

export default ModalStatesDoc;
