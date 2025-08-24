import { useEffect } from "react";

const useFocusShortcut = (ref, key) => {
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.shiftKey && event.key.toLowerCase() === key.toLowerCase()) {
        event.preventDefault(); 
        ref.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [ref]);
};

export default useFocusShortcut;
