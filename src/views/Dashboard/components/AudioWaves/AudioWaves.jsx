
import React, { useState, useRef, useEffect } from "react";
import styles from "./AudioWaves.module.css";
import SelectAgentModal from "../../screens/ChatView/SelectAgentModal/SelectAgentModal";
import { useNavigate } from "react-router-dom";

const AudioWaves = ({ isRecording = false, setIsRecording }) => {
  return (
    <>
      <svg
        width="18"
        height="16"
        viewBox="0 0 18 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${styles.audioSvg} ${isRecording ? styles.recording : ""}`}
      >
        <path
          className={`${styles.bar} ${styles.bar1}`}
          d="M6.5 0C5.67157 0 5 0.67157 5 1.5V14.5C5 15.3284 5.67157 16 6.5 16C7.3284 16 8 15.3284 8 14.5V1.5C8 0.67157 7.3284 0 6.5 0Z"
          fill="currentFill"
        />
        <path
          className={`${styles.bar} ${styles.bar2}`}
          d="M10 4.5C10 3.67157 10.6716 3 11.5 3C12.3284 3 13 3.67157 13 4.5V11.5C13 12.3284 12.3284 13 11.5 13C10.6716 13 10 12.3284 10 11.5V4.5Z"
          fill="currentFill"
        />
        <path
          className={`${styles.bar} ${styles.bar3}`}
          d="M1.5 5C0.67157 5 0 5.67157 0 6.5V9.5C0 10.3284 0.67157 11 1.5 11C2.32843 11 3 10.3284 3 9.5V6.5C3 5.67157 2.32843 5 1.5 5Z"
          fill="currentFill"
        />
        <path
          className={`${styles.bar} ${styles.bar4}`}
          d="M16.5 5C15.6716 5 15 5.67157 15 6.5V9.5C15 10.3284 15.6716 11 16.5 11C17.3284 11 18 10.3284 18 9.5V6.5C18 5.67157 17.3284 5 16.5 5Z"
          fill="currentFill"
        />
      </svg>
    </>
  );
};

export default AudioWaves;
