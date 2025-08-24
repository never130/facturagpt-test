import React, { useState, useEffect } from "react";
import styles from "./ScheduledResponses.module.css";
import { useTranslation } from "react-i18next";
import Button from "../../Button/Button";
import { closestCenter, DndContext } from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import arrowDown from "../../../assets/arrowDownBold.svg";
import ResponsesGrab from "./ResponsesGrab/ResponsesGrab";
import Title from "../Ttitle";
import { useDebounce } from "../../../../../utils/useDebounce";
const ScheduledResponses = ({ userData, setUserData,seeResponses,setSeeResponses,handleAddScheduledResponse }) => {
  const [t] = useTranslation("ChatView");
  const [maxCharacters, setMaxCharacters] = useState(10000); 
  const [currentTotal, setCurrentTotal] = useState(0);

  const debouncedScheduledResponses = useDebounce(userData.scheduledResponses, 500);

useEffect(() => {
  const total = (debouncedScheduledResponses || []).reduce((acc, item) => {
    const entries = item.entries || [];

    let totalChars = 0;

    for (const entry of entries) {
      const questionLength = entry.question?.length || 0;
      const responsesLength = (entry.responses || []).reduce(
        (sum, response) => sum + (response?.length || 0),
        0
      );
      totalChars += questionLength + responsesLength;
    }

    return acc + totalChars;
  }, 0);

  setCurrentTotal(total);
}, [debouncedScheduledResponses]);

  const progressPercent = Math.min((currentTotal / maxCharacters) * 100, 100);

  const handleDragEndParameters = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setUserData((prev) => {
        const oldIndex = prev.scheduledResponses.findIndex((item) => item.id === active.id);
        const newIndex = prev.scheduledResponses.findIndex((item) => item.id === over.id);
        const updatedScheduled = arrayMove(prev.scheduledResponses, oldIndex, newIndex);
        return {
          ...prev,
          scheduledResponses: updatedScheduled,
        };
      });
    }
  };

  return (
    <>
      <div style={{
        display: "flex",
        gap: "10px",
        alignItems: "center",
        justifyContent: "space-between",
      }} id="programmedResponses">
        <Title value={t("scheduledResponses")} />

        <Button
          action={handleAddScheduledResponse}
          type="white"
          headerStyle={{
            borderRadius: "999px",
            width: "fit-content",
            fontSize: "12px",
            padding: "10px 10px",
          }}
        >
          + {t("addScheduledResponses")}
        </Button>
      </div>
{userData?.scheduledResponses?.length >= 1 && (
    <div className={styles.newAgentSection}>

    <div className={styles.progressWrapper}>
      {currentTotal > 0 &&
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      }
    </div>
    <div
      className={styles.seeParameters}
      onClick={() => setSeeResponses((prev) => !prev)}
    >
      <p className={styles.responseTitle}>
        <img
          src={arrowDown}
          alt="Icon"
          className={seeResponses && styles.arrowDown}
        />
        {t("scheduledResponses")} {userData?.scheduledResponses?.length >= 1 && `(${userData?.scheduledResponses?.length})`}
      </p>
    </div>
    {userData?.scheduledResponses?.length >= 1 && (


      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEndParameters}
      >
        <SortableContext
          items={userData?.scheduledResponses?.map((item) => item.id)}
        >
          <div
            className={styles.parametersInfo}
            style={{
              height: seeResponses ? "auto" : "0px",
              padding: seeResponses ? "20px 0" : "0px",
              borderBottom: !seeResponses && "1px solid transparent",
            }}
          >
            {(userData?.scheduledResponses || []).map((item, index) => (
              <ResponsesGrab item={item} userData={userData} setUserData={setUserData} index={index} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    )}
  </div>
)}
  
    </>
  );
};

export default ScheduledResponses;
