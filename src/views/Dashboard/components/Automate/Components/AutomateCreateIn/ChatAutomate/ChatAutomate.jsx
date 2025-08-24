import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { getAgents } from '../../../../../../../actions/agents';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchByChat, getChatAgents } from '../../../../../../../actions/chat';
import ChatView, { ChatBody } from '../../../../../screens/ChatView/ChatView';
import CorporativeModalText from '../../../../CorporativeModalText/CorporativeModalText';
import { v4 as uuidv4 } from "uuid";
import { apiUrl } from '../../../../../../../apiBackend';

const ChatAutomate = ({ stateDoc, type, configuration }) => {
  const [t] = useTranslation("ChatView");



  return (
    <div style={{
      height: 'calc(100% - 55px)',
    }}>

    <ChatView typeChat={'automate'}/>
   
    </div>
  )
}

export default ChatAutomate