import React from 'react';

import ApiPage from './ApiPage/ApiPage';
// import ScrapingContainer from './ScrapingContainer/ScrapingContainer';
import FileExplorer from './FileExplorer/FileExplorer';
import HighlightedText from './HighlightedText/HighlightedText';
import ViewerContainer from './ViewerContainer/ViewerContainer';

import MeetScraping from './MeetScraping/bot';
import MessageBluetooth from './MessageBluetooth/MessageBluetooth';
import MessageWatch from './MessageWatch/MessageWatch';
import MessageLocation from './MessageLocation/MessageLocation';
import MessageGraph from './MessageGraph/MessageGraph';
import MessageDoc from './MessageDoc/MessageDoc';
import MessageAutomate from './MessageAutomate/MessageAutomate';
import MessageAutomate1 from './MessageAutomate1/MessageAutomate1';
import MessageAction from './MessageAction/MessageAction';
import MessageTable from './MessageTable/MessageTable';
import MessageImage from './MessageImage/MessageImage';
import MessageAudio from './MessageAudio/MessageAudio';
import MessageDeliver from './MessageDeliver/MessageDeliver';
import MessageGym from './MessageGym/MessageGym';
import MessageTimer from './MessageTimer/MessageTimer';
import MessageClock from './MessageClock/MessageClock';

import MessageToken from './MessageToken/MessageToken';
import MessageExitAgent from './MessageExitAgent/MessageExitAgent';
import MessageScript from './MessageScript/MessageScript';

import MessageHelper from './MessageHelper/MessageHelper';
import MessageComingSoon from './MessageComingSoon/MessageComingSoon';


const Meet = ({ 
  type, 
  message, 
  setMessages, 
  messageContainerRef, 
  conf,
  insertMessage,
}) => {
  return (
    <>
      {/* {type === 'api' && <ApiPage
        web={message.text}
        timestamp={message.timestamp}
        messageContainerRef={''}
      />} */}
      {type === 'helper' && <MessageHelper
        message={message}
        setMessages={setMessages}
        conf={conf}
      />}
      {type === 'coming-soon' && <MessageComingSoon
        message={message}
      />}
      {type === 'script' && <MessageScript
        message={message}
        messageContainerRef={messageContainerRef}
      />}
      {type === 'scraping' && <MeetScraping
        message={message}
        messageContainerRef={messageContainerRef}
      />}
      {type === 'app' && <FileExplorer
        appData={message.text}
        onFileUpdate={() => { }}
        appId={''}
        onFolderSelect={() => { }}
        onAppSelect={() => { }}
        messageTimestamp={message.timestamp}
      />}
      {type === 'online' && <HighlightedText
        text={message.text?.text}
        annotations={message.text?.annotations}
      />}
      {type === 'viewer' && <ViewerContainer
        message={message}
      />}
      {type === 'action' && <MessageAction
        message={message}
      />}
      {type === 'automate' && <MessageAutomate
        message={message}
      />}
      {type === 'automate1' && <MessageAutomate1
        message={message}
      />}
      {type === 'doc' && <MessageDoc
        message={message}
      />}
      {type === 'bluetooth' && <MessageBluetooth
        message={message}
      />}
      {type === 'watch' && <MessageWatch
        message={message}
      />}
      {type === 'location' && <MessageLocation
        message={message}
      />}
      {type === 'graph' && <MessageGraph
        message={message}
        insertMessage={insertMessage}
        conf={conf}
      />}
      {type === 'table' && <MessageTable
        message={message}
      />}
      {type === 'image' && <MessageImage
        message={message}
      />}
      {type === 'audio' && <MessageAudio
        message={message}
      />}
      {type === 'token' && <MessageToken
        message={message}
      />}
      {type === 'deliver' && <MessageDeliver
        message={message}
      />}
      {type === 'gym' && <MessageGym
        message={message}
      />}
      {type === 'timer' && <MessageTimer
        message={message}
      />}
     
      {type === 'clock' && <MessageClock
        message={message}
      />}
      {type === 'exit-agent' && <MessageExitAgent
        message={message}
      />}
    </>
  )
};

export default Meet;