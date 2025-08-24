import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useCloseOnEsc = (setIsOpen, url) => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        if (typeof setIsOpen === "function") {
          setIsOpen(false);
        } else if (url) {
          navigate(url);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [setIsOpen, url, navigate]);
};

export default useCloseOnEsc;
