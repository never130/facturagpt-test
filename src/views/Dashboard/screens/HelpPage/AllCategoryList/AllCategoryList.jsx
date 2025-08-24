import React from "react";
import FirstSteeps from "../FirstSteeps/FirstSteeps";
import YourAccount from "../YourAccount/YourAccount";
import Table from "../Table/Table";
import DocumentManagement from "../DocumentManagement/DocumentManagement";
import ContactManagement from "../ContactManagement/ContactManagement";
import AssetManagement from "../AssetManagement/AssetManagement";
import Transactions from "../Transactions/Transactions";
import ControlPanel from "../ControlPanel/ControlPanel";
import Security from "../Security/Security";
import Subscription from "../Subscription/Subscription";

const AllCategoryList = React.forwardRef(({ setSelectedCategory = () => {} }, ref) => {
  
  
    return (
    <div 
    ref={ref} 
    // style={{ position: "absolute", left: "-99999px", top: 0, opacity: 0 }}
    >
      <div>
        <FirstSteeps setSelectedCategory={setSelectedCategory} />
        <YourAccount setSelectedCategory={setSelectedCategory} />
        <DocumentManagement setSelectedCategory={setSelectedCategory} />
        <ContactManagement setSelectedCategory={setSelectedCategory} />
        <AssetManagement setSelectedCategory={setSelectedCategory} />
        <Transactions setSelectedCategory={setSelectedCategory} />
        <ControlPanel setSelectedCategory={setSelectedCategory} />
        <Security setSelectedCategory={setSelectedCategory} />
        <Subscription setSelectedCategory={setSelectedCategory} />
        <Table setSelectedCategory={setSelectedCategory} />
      </div>
    </div>
  );
});

export default AllCategoryList;


