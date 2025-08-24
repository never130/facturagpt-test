"use client";

import React, { useRef, useState } from "react";
import styles from "./OtpInput.module.css";

export const OTPInput = ({
  length = 6,
  onChange = () => {},
  handleVerifyOTP,
}) => {
  const [otp, setOtp] = useState(new Array(length).fill(""));
  const inputRefs = useRef([]);

  const handleChange = (element, index) => {
    if (isNaN(Number(element.value))) return false;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);
    onChange(newOtp.join(""));

    if (newOtp.every((digit) => digit !== "")) {
      handleVerifyOTP(newOtp.join(""));
    }

    if (element.value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, length); 
    if (!/^\d+$/.test(pastedData)) return; 

    const newOtp = pastedData.split("");
    while (newOtp.length < length) {
      newOtp.push("");
    }
    setOtp(newOtp);
    onChange(newOtp.join(""));

    const lastIndex = Math.min(pastedData.length - 1, length - 1);
    inputRefs.current[lastIndex]?.focus();

    if (newOtp.every((digit) => digit !== "")) {
      handleVerifyOTP(newOtp.join(""));
    }
  };

  return (
    <div className={styles.otpGroup}>
      {otp.map((digit, index) => (
        <input
          key={index}
          type="text"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e.target, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={(e) => index === 0 && handlePaste(e)} 
          ref={(ref) => (inputRefs.current[index] = ref)}
          className={styles.otpInput}
          autoFocus={index === 0}
        />
      ))}
    </div>
  );
};
