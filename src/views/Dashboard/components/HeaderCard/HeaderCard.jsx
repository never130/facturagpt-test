import React from "react";
import styles from "./HeaderCard.module.css";
import { ReactComponent as Arrow } from "../../assets/ArrowLeftWhite.svg";
import Button from "../Button/Button";
import { useNavigate, useParams } from "react-router-dom";
import useCloseOnEsc from "../../../../utils/useClose";
const HeaderCard = ({
  title,
  children,
  setState,
  headerStyle = {},
  buttonHeaderStyle = { padding: '6px 8px', marginRight: '6px' },
  titleStyle = {},
  setIsModalAutomate,
  father,
  fatherNewAgent,
  childrenLeft,
  setHideAutomate,
}) => {
  const navigate = useNavigate();
  const { contactId, id } = useParams();

  const handleClose = (e) => {
    e && e.stopPropagation();
    setState && setState(false);
    if (father === 'newBill' && !setState) navigate(`/admin/docs/${contactId}`);
    if (father === 'newAgent' && !setState)
      fatherNewAgent === 'chat'
        ? navigate(`/admin/chat`)
        : navigate(`/admin/chat/${id}`);
    setTimeout(() => {
      setIsModalAutomate && setIsModalAutomate(true);
      setHideAutomate && setHideAutomate(false);
    }, 300);
  };
  useCloseOnEsc(handleClose);


  return (
    <header className={styles.newTagHeader} style={headerStyle}>
      <div className={styles.leftSide}>
        <Button action={(e) => handleClose(e)} headerStyle={buttonHeaderStyle}>
          <Arrow />
        </Button>

        <h3 style={titleStyle}>{title}</h3>
        {childrenLeft && childrenLeft}
      </div>
      <div className={styles.rightSide}>{children}</div>
    </header>
  );
};

export default HeaderCard;
