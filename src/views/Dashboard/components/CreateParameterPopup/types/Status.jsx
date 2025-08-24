import React, { useEffect, useRef, useState } from "react";
import styles from "../CreateParameterPopup.module.css";
import { ReactComponent as WhiteXCloseIcon } from "../../../assets/WhiteXCloseIcon.svg";
import { ReactComponent as PencilEdit } from "../../../assets/pencilEdit.svg";
import { ReactComponent as GrabIcon } from "../../../assets/grabIcon.svg";
import LabelParameters from "../LabelParameters";
import Button from "../../Button/Button";
import { useTranslation } from "react-i18next";
import DeleteButton from "../../DeleteButton/DeleteButton";

const statusOptions = ["paid", "pending", "defaulted", "cancelled"];

const Status = ({
  parameterData,
  setParameterData,
  handleChange,
  editingInput,
  setEditingInput,
  setShowAddTags,
}) => {
  const [editing, setEditing] = useState(false);
  const [activePopupId, setActivePopupId] = useState(null);
  const [defaultStatusId, setDefaultStatusId] = useState(
    parameterData.defaultStatusId || null
  );
  const [t] = useTranslation("Contacts");
  const popupRef = useRef(null);

  const handleAddStatus = () => {
    const newStatus = {
      id: Date.now(),
      title: "",
      status: "pending",
    };

    setParameterData((prev) => ({
      ...prev,
      statuses: [...(prev.statuses || []), newStatus],
    }));
  };

  const handleDeleteStatus = (idToRemove) => {
    setParameterData((prev) => ({
      ...prev,
      statuses: prev.statuses.filter((s) => s.id !== idToRemove),
    }));
  };

  const handleTitleChange = (id, value) => {
    setParameterData((prev) => ({
      ...prev,
      statuses: prev.statuses.map((s) =>
        s.id === id ? { ...s, title: value } : s
      ),
    }));
  };

  const handleStatusChange = (id, newStatus) => {
    setParameterData((prev) => ({
      ...prev,
      statuses: prev.statuses.map((s) =>
        s.id === id ? { ...s, status: newStatus } : s
      ),
    }));
    setActivePopupId(null); 
  };

  const handleDefaultStatusChange = (statusId) => {
    setDefaultStatusId(statusId);
    setParameterData((prev) => ({
      ...prev,
      defaultStatusId: statusId,
    }));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setActivePopupId(null);
      }
    };

    if (activePopupId !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activePopupId]);

  return (
    <div>
      <LabelParameters
        text="status"
        editingInput={editingInput}
        setEditingInput={setEditingInput}
        checkEditingValidation={false}
      >
        <Button
          action={handleAddStatus}
          type="white"
          headerStyle={{ borderRadius: "999px" }}
        >
          {t("addStatus")}
        </Button>
      </LabelParameters>

      <div className={styles.statusContainer}>
        {(parameterData.statuses || []).map((statusItem) => (
          <div
            key={statusItem.id}
            className={styles.statusContent}
            style={{ position: "relative" }}
          >
            <div className={styles.infoStatus}>
              <div className={styles.dateFormatOption}>
                <input
                  type="radio"
                  name="defaultStatus"
                  value={statusItem.id}
                  checked={defaultStatusId === statusItem.id}
                  onChange={() => handleDefaultStatusChange(statusItem.id)}
                />
              </div>
              <div
                className={`${styles.circle} ${styles[statusItem.status]}`}
                onClick={() =>
                  editing == statusItem.id && setActivePopupId(statusItem.id)
                }
              ></div>

              {editing == statusItem.id ? (
                <input
                  type="text"
                  placeholder={t("status")}
                  value={statusItem.title}
                  onChange={(e) =>
                    handleTitleChange(statusItem.id, e.target.value)
                  }
                />
              ) : (
                <span>{statusItem.title || t("withoutTitle")}</span>
              )}

              <PencilEdit
                onClick={() =>
                  setEditing((prev) =>
                    prev === statusItem.id ? null : statusItem.id
                  )
                }
              />
            </div>

            <DeleteButton
              action={() => handleDeleteStatus(statusItem.id)}
              type={"black"}
              CustonIcon={WhiteXCloseIcon}
              customIconStyles={{
                height: "30px",
                minWidth: "30px",
                background: "#6E6E80",
              }}
            />

            {editing && activePopupId === statusItem.id && (
              <div className={styles.statusPopup} ref={popupRef}>
                {statusOptions.map((option) => (
                  <div
                    key={option}
                    className={` ${styles.circle} ${styles[option]} ${
                      statusItem.status === option
                        ? styles.statusOptionSelected
                        : ""
                    }`}
                    onClick={() => handleStatusChange(statusItem.id, option)}
                  >
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Status;