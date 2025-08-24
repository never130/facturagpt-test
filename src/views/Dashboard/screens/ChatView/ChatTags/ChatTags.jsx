import React from "react";
import styles from "./ChatTags.module.css";
import Scroller from "./Scroller";
import { useTranslation } from "react-i18next";
const ChatTags = ({
  handleChat
}) => {
  const [t] = useTranslation('ChatView')
  const tagsTop = [
    t("recommendedQuestions1"),
    t("recommendedQuestions2"),
    t("recommendedQuestions3"),
    t("recommendedQuestions4"),
    t("recommendedQuestions5"),
  ];
  const tagsMid = [
    t("recommendedQuestions6"),
    t("recommendedQuestions7"),
    t("recommendedQuestions8"),
    t("recommendedQuestions9"),
    t("recommendedQuestions10"),
  ];
  const tagsBottom = [
    t("recommendedQuestions11"),
    t("recommendedQuestions12"),
    t("recommendedQuestions13"),
    t("recommendedQuestions14"),
    t("recommendedQuestions15"),
  ];
  return (
    <div className={styles.slider_container}>
      <Scroller
        direction="right"
        speed="slow"
        handleChat={handleChat}
        content={tagsTop}
      />
      <Scroller
        direction="left"
        speed="slow"
        handleChat={handleChat}
        content={tagsMid}
      />
      <Scroller
        direction="right"
        speed="slow"
        handleChat={handleChat}
        content={tagsBottom}
      />
    </div>
  );
};

export default ChatTags;
