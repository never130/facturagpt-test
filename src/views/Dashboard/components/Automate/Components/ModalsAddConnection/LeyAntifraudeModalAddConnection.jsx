import React, { useEffect, useRef, useState } from "react";
import styles from "./LeyAntifraudeModalAddConnection.module.css";
import { ReactComponent as GrayIconLock } from "../../../../assets/GrayIconLock.svg";
import { ReactComponent as EyePassword } from "../../../../assets/eyePassword.svg";
import { ReactComponent as EyePasswordSlash } from "../../../../assets/eyePasswordSlash.svg";
import { useDispatch, useSelector } from "react-redux";
import { ReactComponent as IconHeader } from "../../../../assets/agenciaTributariaCircle.svg";

import HeaderCard from "../../../HeaderCard/HeaderCard";
import { useTranslation } from "react-i18next";
import CustomDropdown from "../../../CustomDropdown/CustomDropdown";
import InputWithTitle from "../../../InputWithTitle/InputWithTitle";
import { ReactComponent as MoreInfoIcon } from "../../../../assets/moreInfoIcon.svg";
import { setShowModal } from "../../../../../../slices/userSlices";
import Button from "../../../Button/Button";
import { useNavigate } from "react-router-dom";

const LeyAntifraudeModalAddConnection = ({ close,setQuestion,selectedAgent,type }) => {
  const dispatch = useDispatch();
  const [t] = useTranslation("AutomatesComponent");
  const [email, setEmail] = useState("");
  const [appPassword, setAppPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorPopup, setErrorPopup] = useState(""); 
  const userId = useSelector((state) => state.user.user.id);
const navigate = useNavigate()
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.focus();
    }
  }, []);

  return (
    <div
      className={styles.container}
      ref={containerRef}
      tabIndex="0"
      onKeyDown={(e) => {
        e.stopPropagation();
        if (e.key === "Escape") {
          close();
        }
      }}
    >
      <div className={styles.subContainer}>
        <div onClick={(e) => e.stopPropagation()} className={styles.content}>
          <HeaderCard
            title={"Configuración Ley Antifraude"}
            setState={close}
            headerStyle={{ padding: "4px 0px" }}
            titleStyle={{ fontSize: "14px", fontWeight: "550" }}
            buttonHeaderStyle={{ padding: "4px 6px" }}
            childrenLeft={
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
                }else{
                  dispatch(setShowModal('selectAgent'))
                }

              }}>
                
              <MoreInfoIcon className={styles.moreInfoContainer} />

            </Button>}
          >
            <div className={styles.buttonContainer}>
              <button
                className={styles.cancelButton}
                onClick={() => close(false)}
              >
                {t("cancel")}
              </button>
              <button
                className={styles.buttonUpdate}
                onClick={() => close(false)}
              >
                Actualizar
              </button>
            </div>
          </HeaderCard>
   
          <div className={styles.children_content}>
            <p style={{ marginTop: "0px" }}>Fecha inicio obligación</p>
            <CustomDropdown
              placeholder={"Categoría"}
              options={[]}
              selectedOption={() => {

              }}
              height="31px"
              textStyles={{
                display: "flex",
                fontWeight: 300,
                marginLeft: "6px",
                userSelect: "none",
              }}
              setSelectedOption={(selected) => {

              }}
            />

            <span style={{
              fontSize: "11px",
              color: "#6D6D6D",
              marginTop: "10px",
            }}>Este periodo cubrirá desde la fecha indicada hasta el 31/12 del mismo año.</span>
            <br />

            <p>¿Está sujeto a la Ley Antifraude?</p>


            <span style={{
              fontSize: "11px",
              color: "#6D6D6D",
            }}>Comentario</span>
            <br />
            <br />
            <InputWithTitle
              onChange={() => {

              }}
              bgColor="#F4F4F4"
              titleColor="#18181B"
              placeholder={"emaildelacuenta@email.com"}
              textStyles={{
                display: "flex",
                gap: "5px",
                fontWeight: 500,
                color: "#3d3c42",
                marginLeft: "6px",
                userSelect: "none",
              }}
              inputHeight="31px"
              title="Email responsable técnico"
            />
            <br />

            <InputWithTitle
              onChange={() => {

              }}
              bgColor="#F4F4F4"
              titleColor="#18181B"
              placeholder={"archivo.pem"}
              textStyles={{
                display: "flex",
                gap: "5px",
                fontWeight: 500,
                color: "#3d3c42",
                marginLeft: "6px",
                userSelect: "none",
              }}
              inputHeight="31px"
              title="Subida de certificado digital (.p12 / .pem)"
            />
            <span style={{
              fontSize: "11px",
              color: "#6D6D6D",
            }}>Archivo emitido por FNMT o sede electrónica.</span>
            <br />
            <br />


            <InputWithTitle
              onChange={() => {

              }}
              bgColor="#F4F4F4"
              titleColor="#18181B"
              placeholder={"***************"}
              textStyles={{
                display: "flex",
                gap: "5px",
                fontWeight: 500,
                color: "#3d3c42",
                marginLeft: "6px",
                userSelect: "none",
              }}
              inputHeight="31px"
              title="Contraseña"
            />
            <span style={{
              fontSize: "11px",
              color: "#6D6D6D",
            }}>Clave establecida al descargar el archivo. </span>
            <br />
            <br />

            <button
              className={styles.buttonUpdate}
              onClick={() => {

              }}
            >
              Validar conexión ahora
            </button>

            <br />
            <br />

            <div
              style={{
                backgroundColor: "#FEF5E5",
                borderLeft: "1px solid #7C5400",
                fontSize: "11px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "5px 10px 5px 10px",
                gap: "10px",
                fontWeight: 300,
              }}>
              <svg width="22" height="22" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M5.70262 1.73683C5.94598 1.59981 6.22055 1.52783 6.49984 1.52783C6.77912 1.52783 7.05369 1.59981 7.29706 1.73683C7.54042 1.87385 7.74437 2.07127 7.88921 2.31006L7.89077 2.31263L12.4787 9.97181L12.4831 9.97929C12.625 10.225 12.7 10.5036 12.7008 10.7873C12.7016 11.0711 12.6281 11.3501 12.4876 11.5966C12.3471 11.8431 12.1445 12.0485 11.8999 12.1924C11.6554 12.3363 11.3774 12.4137 11.0937 12.4168L11.0878 12.4169L1.90597 12.4168C1.62224 12.4137 1.34428 12.3363 1.09973 12.1924C0.855183 12.0485 0.652575 11.8431 0.512065 11.5966C0.371555 11.3501 0.29804 11.0711 0.298834 10.7873C0.299629 10.5036 0.374705 10.225 0.516594 9.97929L0.520994 9.97181L5.11046 2.31006C5.2553 2.07127 5.45925 1.87385 5.70262 1.73683ZM6.49984 2.61117C6.40674 2.61117 6.31522 2.63516 6.2341 2.68083C6.15334 2.7263 6.08561 2.79172 6.03737 2.87083L1.45296 10.5241C1.40682 10.6053 1.38243 10.697 1.38216 10.7904C1.3819 10.8849 1.4064 10.9779 1.45324 11.0601C1.50008 11.1423 1.56761 11.2108 1.64913 11.2587C1.72993 11.3063 1.82168 11.332 1.91539 11.3335H11.0843C11.178 11.332 11.2697 11.3063 11.3505 11.2587C11.4321 11.2108 11.4996 11.1423 11.5464 11.0601C11.5933 10.9779 11.6178 10.8849 11.6175 10.7904C11.6173 10.697 11.5929 10.6053 11.5467 10.5242L6.96296 2.87191C6.96275 2.87155 6.96253 2.87119 6.96231 2.87083C6.91407 2.79172 6.84633 2.7263 6.76558 2.68083C6.68446 2.63516 6.59293 2.61117 6.49984 2.61117Z" fill="#7C5400" />
                <path fill-rule="evenodd" clip-rule="evenodd" d="M6.50016 4.8335C6.79932 4.8335 7.04183 5.07601 7.04183 5.37516V7.54183C7.04183 7.84098 6.79932 8.0835 6.50016 8.0835C6.20101 8.0835 5.9585 7.84098 5.9585 7.54183V5.37516C5.9585 5.07601 6.20101 4.8335 6.50016 4.8335Z" fill="#7C5400" />
                <path fill-rule="evenodd" clip-rule="evenodd" d="M5.9585 9.70817C5.9585 9.40902 6.20101 9.1665 6.50016 9.1665H6.50558C6.80473 9.1665 7.04725 9.40902 7.04725 9.70817C7.04725 10.0073 6.80473 10.2498 6.50558 10.2498H6.50016C6.20101 10.2498 5.9585 10.0073 5.9585 9.70817Z" fill="#7C5400" />
              </svg>

              <p>Error: certificado caducado o contraseña incorrecta. Por favor, revisa los datos e intenta de nuevo.</p>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              marginTop: "10px",
            }}
          >
            <svg width="11" height="15" viewBox="0 0 11 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5.5 0.5C7.39807 0.5 8.93732 1.9925 8.9375 3.83301V5.16699H9.625C10.384 5.16699 11 5.764 11 6.5V13.167C10.9998 13.9028 10.3839 14.5 9.625 14.5H1.375C0.61612 14.5 0.000182728 13.9028 0 13.167V6.5C3.87691e-06 5.764 0.61601 5.16699 1.375 5.16699H2.0625V3.83301C2.06268 1.9925 3.60192 0.500004 5.5 0.5ZM5.5 1.83398C4.36102 1.83398 3.43772 2.7296 3.4375 3.83398V5.16797H7.5625V3.83398C7.56228 2.7296 6.63898 1.83399 5.5 1.83398Z" fill="#71717A" />
            </svg>

            <p
              style={{
                fontSize: "11px",
                fontWeight: 400,
                color: "#71717A",
                marginTop: "10px",
              }}
            >FacturaGPT se conecta de forma segura</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeyAntifraudeModalAddConnection;
