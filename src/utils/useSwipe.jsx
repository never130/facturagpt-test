import { useEffect } from "react";

const useSwipe = (setState, timeThreshold = 300) => {
  useEffect(() => {
    let startX = 0;
    let endX = 0;
    let isTouch = false;
    let startTime = 0;

    const handleMouseDown = (e) => {
      isTouch = false;
      startX = e.clientX;
      startTime = Date.now();
    };

    const handleMouseMove = (e) => {
      if (!isTouch) endX = e.clientX;
    };

    const handleMouseUp = () => {
      if (!isTouch) detectSwipe();
    };

    const handleTouchStart = (e) => {
      isTouch = true;
      startX = e.touches[0].clientX;
      startTime = Date.now();
    };

    const handleTouchMove = (e) => {
      endX = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
      if (isTouch) detectSwipe();
    };

    const detectSwipe = () => {
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime > timeThreshold) return; 

      if (startX < endX - 50) {
        setState(true); 
      } else if (startX > endX + 50) {
        setState(false); 
      }
    };

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [setState, timeThreshold]);
};

export default useSwipe;
