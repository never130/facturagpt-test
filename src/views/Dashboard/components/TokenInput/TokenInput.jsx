
import { useRef, useState } from "react";
import styles from "./TokenInput.module.css";
import { useNavigate } from "react-router-dom";
export const TokenInput = ({ currentToken, roleType, routes }) => {
  const navigate = useNavigate();

  const length = currentToken.length;
  const [token, setToken] = useState(new Array(length).fill(""));
  const inputRefs = useRef([]);
  const handleVerifyToken = (code) => {
    if (code === currentToken) {
      navigate(routes[roleType])
    } else {
      console.error("Token incorrecto");
    }
  };

  const handleChange = (element, index) => {
    if (isNaN(Number(element.value))) return;

    const newToken = [...token];
    newToken[index] = element.value;
    setToken(newToken);

    const joined = newToken.join("");

    if (newToken.every((digit) => digit !== "")) {
      handleVerifyToken(joined);
    }

    if (element.value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !token[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, length);
    if (!/^\d+$/.test(pastedData)) return;

    const newToken = pastedData.split("");
    while (newToken.length < length) {
      newToken.push("");
    }
    setToken(newToken);

    const lastIndex = Math.min(pastedData.length - 1, length - 1);
    inputRefs.current[lastIndex]?.focus();

    if (newToken.every((digit) => digit !== "")) {
      handleVerifyToken(newToken.join(""));
    }
  };

  return (
    <div className={styles.otpGroup}>
      {token.map((digit, index) => (
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
