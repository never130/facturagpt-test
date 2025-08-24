import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {getAllDocsByContact } from "../../../../actions/docs";

const AmountTransaction = ({ row }) => {


  return (
    <div>
      {row?.totalDocs ? <span>{row?.totalDocs}</span> : <span>0</span>} 
    </div>
  );
};

export default AmountTransaction;
