import React, { useState } from "react";
import styles from "./ResponsesGrab.module.css";
import { useSortable } from "@dnd-kit/sortable";
import { ReactComponent as GrabIcon } from "../../../../assets/grabIcon.svg";
import { ReactComponent as AddGreen } from "../../../../assets/AddGreenOutline.svg";
import { ReactComponent as PencilEdit } from "../../../../assets/pencilEdit.svg";
import { ReactComponent as BlackDeleteButton } from "../../../../assets/BlackDeleteButton.svg";
import { ReactComponent as ArrowDown } from "../../../../assets/arrowDownBold.svg";
import { ReactComponent as GrayClock } from "../../../../assets/GrayClock.svg";
import { CSS } from "@dnd-kit/utilities";

import { useTranslation } from "react-i18next";
import Button from "../../../Button/Button";
import DeleteButton from "../../../DeleteButton/DeleteButton";
import CustomDropdown from "../../../CustomDropdown/CustomDropdown";
const ResponsesGrab = ({ item, setUserData, userData, index }) => {
  const [t] = useTranslation("ChatView");
  const [showResponses, setShowResponses] = useState(true);
  const [editing, setEditing] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: item.id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleChangeQuestion = (id, entryIndex, value) => {
    const updated = [...userData.scheduledResponses];
    const index = updated.findIndex((item) => item.id === id);
    if (index === -1) return;

    updated[index].entries[entryIndex].question = value;

    setUserData((prev) => ({
      ...prev,
      scheduledResponses: updated,
    }));
  };
  const handleChangeResponse = (id, entryIndex, responseIndex, value) => {
    const updated = [...userData.scheduledResponses];
    const index = updated.findIndex((item) => item.id === id);
    if (index === -1) return;

    updated[index].entries[entryIndex].responses[responseIndex] = value;

    setUserData((prev) => ({
      ...prev,
      scheduledResponses: updated,
    }));
  };

  const handleAddResponse = (id) => {
    const updated = [...userData.scheduledResponses];
    const index = updated.findIndex((item) => item.id === id);
    if (index === -1) return;

    updated[index].responses.push("");
    setUserData((prev) => ({
      ...prev,
      scheduledResponses: updated,
    }));
  };

  const handleRemoveResponse = (id, responseIndex) => {
    const updated = [...userData.scheduledResponses];
    const index = updated.findIndex((item) => item.id === id);
    if (index === -1) return;

    updated[index].responses.splice(responseIndex, 1);
    setUserData((prev) => ({
      ...prev,
      scheduledResponses: updated,
    }));
  };

  const handleRemoveScheduledResponse = (idToRemove) => {
    setUserData((prev) => ({
      ...prev,
      scheduledResponses: prev.scheduledResponses.filter(
        (item) => item.id !== idToRemove
      ),
    }));
  };


  const handleAddNewEntry = (id) => {
    const updated = [...userData.scheduledResponses];
    const index = updated.findIndex((item) => item.id === id);
    if (index === -1) return;

    if (!updated[index].entries) {
      updated[index].entries = [];
    }

    updated[index].entries.push({
      question: "",
      responses: [""],
    });

    setUserData((prev) => ({
      ...prev,
      scheduledResponses: updated,
    }));
  };

  const handleRemoveEntry = (id, entryIndex) => {
    const updated = [...userData.scheduledResponses];
    const index = updated.findIndex((item) => item.id === id);
    if (index === -1) return;

    updated[index].entries.splice(entryIndex, 1);

    setUserData((prev) => ({
      ...prev,
      scheduledResponses: updated,
    }));
  };
  const handleAddAnswer = (id, entryIndex) => {
    const updated = [...userData.scheduledResponses];
    const index = updated.findIndex((item) => item.id === id);
    if (index === -1) return;

    if (!updated[index].entries || !updated[index].entries[entryIndex]) return;

    updated[index].entries[entryIndex].responses.push("");

    setUserData((prev) => ({
      ...prev,
      scheduledResponses: updated,
    }));
  };

  const handleRemoveAnswer = (id, entryIndex, responseIdx) => {
    const updated = [...userData.scheduledResponses];
    const index = updated.findIndex((item) => item.id === id);
    if (index === -1) return;

    if (updated[index].entries[entryIndex].responses.length > 1) {
      updated[index].entries[entryIndex].responses.splice(responseIdx, 1);

      setUserData((prev) => ({
        ...prev,
        scheduledResponses: updated,
      }));
    }
  };
  return (
    <div
      key={item.id}
      className={styles.scheduledItem}
      ref={setNodeRef}
      style={style}
    >
      <div className={styles.responseheader}>
        <div className={styles.responseInfo}>
          <button {...attributes} {...listeners} className={styles.grabIcon}>
            <GrabIcon className={styles.icon} {...attributes} {...listeners} />
          </button>
          <ArrowDown onClick={() => setShowResponses((prev) => !prev)} className={`${showResponses ? styles.rotatedArrow : ""} ${styles.ArrowDown}`} />
          <input
            type="text"
            placeholder={item.title || `${t("scheduledResponse")} ${index + 1}`}
            disabled={!editing}
            value={item.title}
            className={styles.inputTitle}
            onChange={(e) => {
              const updated = [...userData.scheduledResponses];
              const idx = updated.findIndex((el) => el.id === item.id);
              if (idx !== -1) {
                updated[idx].title = e.target.value;
                setUserData((prev) => ({
                  ...prev,
                  scheduledResponses: updated,
                }));
              }
            }}
          />
          <PencilEdit onClick={() => setEditing((prev) => !prev)} style={{ cursor: "pointer" }} />
        </div>

        <div className={styles.optionsResponsesGrab}>

          <Button
            type="border"
            action={() => {
              const updated = [...userData.scheduledResponses];
              const idx = updated.findIndex((el) => el.id === item.id);
              if (idx !== -1) {
                updated[idx].selected = !updated[idx].selected;
                setUserData((prev) => ({
                  ...prev,
                  scheduledResponses: updated,
                }));
              }
            }}
            headerStyle={{ padding: "4px" }}
          > <GrayClock height={'15'} width={'15'} />
            {item.selected && (
              <CustomDropdown
                customStylesOptions={{
                  overflow: "scroll",
                  height: "100px",
                }}
                generalStyleFilterSort={{
                  padding: "4px 0px",
                }}

                height="20px"
                placeholder={(
                  <>

                    {t('frequencyMessage')}</>
                )}
                options={[
                  t("30Min"),
                  t("1H"),
                  t("6H"),
                  t("12H"),
                  t("1Day"),
                  t("random"),
                ]}
                customStyles={styles.noPadding}
                selectedOption={item?.frequency}
                setSelectedOption={(option) => {
                  const updated = [...userData.scheduledResponses];
                  const idx = updated.findIndex((el) => el.id === item.id);
                  if (idx !== -1) {
                    updated[idx].frequency = option;
                    setUserData((prev) => ({
                      ...prev,
                      scheduledResponses: updated,
                    }));
                  }
                }}
              />
            )}
            <label
              className={styles.toggleSwitch}

            >
              <input
                type="checkbox"
                checked={item.selected}
                disabled={!editing}
                onChange={() => {
                  const updated = [...userData.scheduledResponses];
                  const idx = updated.findIndex((el) => el.id === item.id);
                  if (idx !== -1) {
                    updated[idx].selected = !updated[idx].selected;
                    setUserData((prev) => ({
                      ...prev,
                      scheduledResponses: updated,
                    }));
                  }
                }}
              />
              <span className={styles.slider}></span>
            </label>
          </Button>

          <DeleteButton action={() => handleRemoveScheduledResponse(item.id)} />
        </div>
      </div>

      <div className={styles.responsesBlock}>
        {item?.entries?.length == 0 && (
          <button className={styles.addResponse} onClick={() => handleAddNewEntry(item.id)}>
            <AddGreen />
          </button>
        )}
        {item?.entries?.map((entry, entryIndex) => (
          <div key={entryIndex} className={styles.questionGroup}>
            <div className={styles.EntryContainer}>
              <button className={styles.addResponse} onClick={() => handleAddNewEntry(item.id)}>
                <AddGreen />
              </button>
              <textarea
                type="text"
                placeholder={t("whenUserAsks")}
                disabled={!editing}
                value={entry.question}
                onChange={(e) => handleChangeQuestion(item.id, entryIndex, e.target.value)}
              />
              <DeleteButton
                action={() => {
                  handleRemoveEntry(item.id, entryIndex)
                }}
              />
            </div>
            {entry.responses.map((resp, respIdx) => (
              <div key={respIdx} className={styles.responseItem}>
                <input
                  type="text"
                  placeholder={t("botAnswerAbout")}
                  disabled={!editing}
                  value={resp}
                  onChange={(e) =>
                    handleChangeResponse(item.id, entryIndex, respIdx, e.target.value)
                  }
                />
                <BlackDeleteButton
                  className={styles.deleteButtonBlack}
                  onClick={() => {
                    const updated = [...userData.scheduledResponses];
                    const index = updated.findIndex((el) => el.id === item.id);
                    if (index !== -1) {
                      updated[index].entries[entryIndex].responses.splice(respIdx, 1);
                      setUserData({ ...userData, scheduledResponses: updated });
                    }
                  }}
                />
              </div>
            ))}

            <button
              className={styles.addResponse}
              onClick={() => handleAddAnswer(item.id, entryIndex)}
            >
              <AddGreen />
            </button>


          </div>
        ))}


      </div>
    </div>
  );
};

export default ResponsesGrab;
