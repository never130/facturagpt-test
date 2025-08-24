import React, { useEffect } from "react";
import Header from "./components/Header";
import styles from "./addConnection.module.css";
import HeaderCard from "../../../HeaderCard/HeaderCard";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { setWhatsappQr } from "../../../../../../slices/automateSlices";
import { getUserDevices } from "../../../../../../actions/automate";
import { ReactComponent as MoreInfoIcon } from "../../../../assets/moreInfoIcon.svg";
import Button from "../../../Button/Button";
import { setShowModal } from "../../../../../../slices/userSlices";
import { useNavigate } from "react-router-dom";

const AddConnectionModal = ({
  children,
  type,
  icon,
  close,
  headerColor,
  IconHeader,
  customCss,
  customCssChildernContent,
  showTitle = true,
  setQuestion,
  selectedAgent,
  showHelpButton = true
}) => {
  const { t } = useTranslation("Preview");
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const userId = useSelector((state) => state.user.user.id);
 
  useEffect(() => {
    return () => {
      dispatch(setWhatsappQr());
      dispatch(getUserDevices(userId));
    };
  }, []);

  return (
    <div
      onClick={close}
      className={customCss ? styles.containerCustom : styles.container}
    >
      <div onClick={(e) => e.stopPropagation()} className={styles.content}>
        {true && (
          <HeaderCard
            title={
              <div
                className={styles.title}
                style={customCss && { fontSize: "16px" }}
              >
                {t("addConnectionWith")} {type}

              </div>
            }
            childrenLeft={showHelpButton && (

              <Button headerStyle={{ all: "unset" }}
                action={() => {
                  setQuestion(`${t('automationQuestion', { type })}`)
                  if (selectedAgent._id) {
                    navigate(`/admin/chat/${selectedAgent._id}`, {
                      state: {
                        rowId: `${t('automationQuestion', { type })}`,
                        selectedAgentState: selectedAgent
                      },
                    });
                    dispatch(setShowModal(false))
                  } else {
                    dispatch(setShowModal('selectAgent'))
                  }

                }}>

                <MoreInfoIcon className={styles.moreInfoContainer} />

              </Button>
            )
            }
            setState={close}
          >   {IconHeader && (
            <div className={styles.iconTitle}>{IconHeader}</div>
          )}</HeaderCard>
        )}
        <div
          className={styles.children_content}
          style={customCssChildernContent}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default AddConnectionModal;
