import React from "react";
import styles from "./NavigationPopups.module.css";
import ContactAssetNavigation from "./ContactAssetNavigation/ContactAssetNavigation";
import BillNavigation from "./BillNavigation/BillNavigation";
import AgentNavigation from "./AgentNavigation/AgentNavigation";
import ParameterNavigation from "./ParameterNavigation/ParameterNavigation";

const NavigationPopups = ({
  type,
  setParameters,
  parameters,
  newContact,
  handleDelete,
  text,
  setInfoBill,
  infoBill,
  addAssetsLine,
  setShowNewBill,
  setShowDiscountModalNavigation,
  setShowTaxModalNavigation,
  docsId,
  setShowCreateParameter,
  showCreateParameter,
  setShowTestAgent,
  handleAddScheduledResponse,
  data,
  setData,
  setImage,
  handleBtnsActions,
  setShowAddTags,
  showAddTags,
  copyClipboard,
  setSelectedTags,
  setTypeLocation,
  setLocationState,
  beforeApproveDocument,
  setBeforeApproveDocument,
  typeContainer,
  fileInputRef,
  father,
  setParameterType,
  parametersRef,
  billingRef,
  contactRef,
  assetRef,
  financialRef,
  complementaryRef,
  parameterAssetRef,
  contactId,
  setShowCreateParameterFromPopup,
  setSeeBill,
  seeBill,
  tableType,
  contactTableId,
  assetTableId,
  saveParameter,
  showPopupNewAsset,
  initialParameterType,
  setShowDeleteTableModalParameter,
  setShowDeleteTableModalParameterPopup,
  setCurrentParameter,
  reloadVariable,
  setReloadVariable
  
}) => {
  const components = [
    {
      types: ["asset", "contact"],
      Component: () => (
        <ContactAssetNavigation
          type={type}
          setParameters={setParameters}
          parameters={parameters}
          newContact={newContact}
          handleDelete={handleDelete}
          text={text}
          setShowCreateParameter={setShowCreateParameter}
          showCreateParameter={showCreateParameter}
          data={data}
          setData={setData}
          setImage={setImage}
          handleBtnsActions={handleBtnsActions}
          setShowAddTags={setShowAddTags}
          showAddTags={showAddTags}
          copyClipboard={copyClipboard}
          setSelectedTags={setSelectedTags}
          setTypeLocation={setTypeLocation}
          setLocationState={setLocationState}
          typeContainer={typeContainer}
          father={father}
          parametersRef={parametersRef}
          billingRef={billingRef}
          contactRef={contactRef}
          assetRef={assetRef}
          financialRef={financialRef}
          complementaryRef={complementaryRef}
          parameterAssetRef={parameterAssetRef}
          contactId={contactId}
          setShowCreateParameterFromPopup={setShowCreateParameterFromPopup}
          tableType={tableType}
          contactTableId={contactTableId}
          assetTableId={assetTableId}
          saveParameter={saveParameter} 
          showPopupNewAsset={showPopupNewAsset}
          setShowDeleteTableModalParameter={setShowDeleteTableModalParameter}
          setShowDeleteTableModalParameterPopup={setShowDeleteTableModalParameterPopup} 
          setCurrentParameter={setCurrentParameter}
          reloadVariable={reloadVariable}
          setReloadVariable={setReloadVariable}
        />
      ),
    },
    {
      types: ["bill"],
      Component: () => (
        <BillNavigation
          setInfoBill={setInfoBill}
          infoBill={infoBill}
          assets={infoBill?.assetLines}
          addAssetsLine={addAssetsLine}
          setShowNewBill={setShowNewBill}
          setShowDiscountModalNavigation={setShowDiscountModalNavigation}
          setShowTaxModalNavigation={setShowTaxModalNavigation}
          docsId={docsId}
          beforeApproveDocument={beforeApproveDocument}
          setBeforeApproveDocument={setBeforeApproveDocument}
          handleBtnsActions={handleBtnsActions}
          setShowAddTags={setShowAddTags}
          showAddTags={showAddTags}
          setSelectedTags={setSelectedTags}
          fileInputRef={fileInputRef}
          typeContainer={typeContainer}
          setSeeBill={setSeeBill}
          seeBill={seeBill}
          tableType={tableType}
        />
      ),
    },
    {
      types: ["agent"], 
      Component: () => (
        <AgentNavigation
        setParameters={setParameters}
        parameters={parameters}
          setShowNewBill={setShowNewBill}
          setShowDiscountModalNavigation={setShowDiscountModalNavigation}
          setShowTaxModalNavigation={setShowTaxModalNavigation}
          docsId={docsId}
          data={data}
          setShowTestAgent={setShowTestAgent}
          handleAddScheduledResponse={handleAddScheduledResponse}
          setImage={setImage}
        />
      ),
    },
    {
      types: ["parameter"],
      Component: () => (
        <ParameterNavigation
        setParameterType={setParameterType}
        initialParameterType={initialParameterType}
        />
      ),
    },
  ];

  const matched = components.find((item) => item.types.includes(type));

  return (
    <div style={{maxWidth: typeContainer === "popup" && "100%"}} className={`${styles.navigationPopupsContainer} ${type == 'bill' && styles.navigationPopupsContainerBill}  ${  typeContainer === 'popup' &&( father === "contact" || father === "asset")&& styles.navigationPopupsContainerContactAsset}`}>
      {matched ? matched.Component() : null}
    </div>
  );
};

export default NavigationPopups;
