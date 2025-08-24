import React, { useEffect, useRef } from "react";
import styles from "./Scroller.module.css";
import { ReactComponent as Arrow } from "../../../assets/BlackDiagonalArrow.svg";

const Scroller = ({ handleChat, direction = "left", speed = "fast", content = [], isArray = false, selectedAgent, alone }) => {
  const listRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove(styles.hidden);
          } else {
            entry.target.classList.add(styles.hidden);
          }
        });
      },
      {
        threshold: 0.5,
      }
    );

    const observeItems = () => {
      if (listRef.current) {
        const items = listRef.current.querySelectorAll("li");
        items.forEach((item) => observer.observe(item));
      }
    };

    observeItems();

    return () => {
      if (listRef.current) {
        const items = listRef.current.querySelectorAll("li");
        items.forEach((item) => observer.unobserve(item));
      }
    };
  }, []);
  return (
    <div className={`${styles.scroller} ${direction === "right" ? styles.scrollRight : styles.scrollLeft}`} data-speed={speed}>
      <div className={styles.scrollerInner}>
        <ul ref={listRef} className={styles.tagList}>
          {[...content, ...content].map((tag, index) => (
            <li key={index} onClick={() => {
              isArray ?
                handleChat({
                  text: tag.text,
                  agent: selectedAgent?.name,
                  id: tag?.id,
                }) :
                handleChat({ text: tag });
            }}>
              {isArray ? (
                <>
                  <span>{tag.text}</span>
                  <img src={tag.img} alt="Content" />
                </>
              ) : (
                <span>{tag}</span>
              )}
              <Arrow style={{height:alone && "10px", width: alone && "10px" }}/>
            </li>
          ))}
        </ul>


      </div>
    </div>
  );
};

export default Scroller;
