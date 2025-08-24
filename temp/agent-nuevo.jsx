import React, { useState } from "react";
import HeaderCard from "../HeaderCard/HeaderCard";
import Button from "../Button/Button";
import ModalBlackBgTemplate from "../ModalBlackBgTemplate/ModalBlackBgTemplate";
import styles from "./NewAgentComponent.module.css";
import CustomDropdown from "../CustomDropdown/CustomDropdown";
import { ReactComponent as PlayIcon } from "../../assets/PlayIcon.svg";
import { ReactComponent as GreenCopyIcon } from "../../assets/greenCopyIcon.svg";
import { useNavigate, useParams } from "react-router-dom";

import { useTranslation } from "react-i18next";
import ProfileModalTemplate from "../ProfileModalTemplate/ProfileModalTemplate";
import CheckboxWithText from "../CheckboxWithText/CheckboxWithText";
import InputWithTitle from "../InputWithTitle/InputWithTitle";
import ItemNavigation from "../NavigationPopups/ItemNavigation/ItemNavigation";
import { useSelector } from "react-redux";
import { ParametersLabel } from "../ParametersLabel/ParametersLabel";
import VolumeSlider from "../VolumeSlider/VolumeSlider";

const fileTypes = ["PDF", "PNG", "JPEG", "SVG", "XLS"];

const AgentTypes = [
  {
    name: "Agante de resumen",
    type: "summary",
  },
  {
    name: "Agente de detección de objetos",
    type: "object_detection",
  },
  {
    name: "Agente redactor",
    type: "redactor",
  },
  {
    name: "Agente de transcripción",
    type: "transcription",
  },
  {
    name: "Agente de clasificación y etiquetado",
    type: "classification",
  },
];

const Tab = ({
  className,
  setLocalAgent,
  title
}) => {
  return (
    <button
      className={`${className}`}
      onClick={setLocalAgent}
      type="button"
    >
      {title}
    </button>
  );
}

const NewAgentComponent = ({
  setShowNewAgent,
  idSelectedAgent,
  userData, 
  setUserData, 
  chatAgentId,
  setSelectedAgent,
}) => {
  const [t] = useTranslation("ChatView");
  const { id } = useParams();
  const [localAgentId, setLocalAgentId] = useState(idSelectedAgent)
  const [localAgent, setLocalAgent] = useState(userData ? userData : {
    type: "public",
    Capabilities: [],
    pinned: false,
    tone: 3,
    answer: 3,
  })
  const { agents, fatherNewAgent, idFatherNewAgent } = useSelector((state) => state.agents);
  const [initialAgent, setInitialAgent] = useState(null);
  const [allFiles, setAllFiles] = useState(false);

  const [contactData, setContactData] = useState({
    contactName: "",
    companyEmail: "",
    companyPhoneNumber: [],
    codeCountry: "",
    webSite: "",
    billingEmail: "",
    contactZ: "",
    country: "",
    contactCif: "",
    preferredCurrency: "",
    cardNumber: "",
    companyAddress: "",
    companyCity: "",
    companyProvince: "",
    companyCountry: "",
    infoBill: [],
    paymethod: [],
    parameters: [],
    selectedtags: [],
    image: "",
  });
  const [editingIndices, setEditingIndices] = useState([]);
  const [showCreateParameter, setShowCreateParameter] = useState(false)

  const [selectedTypes, setSelectedTypes] = useState([]);

  const navigate = useNavigate();

  const handleContactData = (field, value) => {
    const formattedValue =
      field === "cardNumber" ? formatCardNumber(value) : value;


    setLocalAgent((prev) => ({
      ...prev,
      [field]: formattedValue,
    }));
  };



  const handleExit = () => {
    const shouldCloseOnly = !!setShowNewAgent;

    if (shouldCloseOnly) {
      setShowNewAgent(false);
    } else {
      const routes = {
        chat: `/admin/chat`,
        contacts: `/admin/contacts`,
        assets: `/admin/assets`,
        notification: `/admin/notification`,
        panel: `/admin/panel/${idFatherNewAgent}`,
        accounts: `/admin/accounts`,
        home: `/admin/home`,
      };

      const route = routes[fatherNewAgent] || `/admin/chat/${id}`;
      navigate(route);
    }

    setInitialAgent(null);
  };

  const handleSaveOrUpdate = () => {
    handleCreateAgent();
    setInitialAgent(null);
  };


  return (
    <ModalBlackBgTemplate close={handleExit}>
      <HeaderCard
        fatherNewAgent={fatherNewAgent}
        father="newAgent"
        setState={handleExit}
        title={t("newAgent")}
      >
        <Button type="white" action={handleExit}>
          {t("cancel")}
        </Button>
        {(!localAgentId || (localAgentId && hasAgentChanged)) && (
          <Button action={handleSaveOrUpdate}>
            {localAgentId ? t("update") : t("save")}
          </Button>
        )}
      </HeaderCard>

      <div className={styles.NewAgentContainer}>
        <div className={styles.ProfileImageContainer}>
          <Button action={() => { }} type="white" headerStyle={{ width: "100%" }}>
            <PlayIcon width={18} height={18} style={{ color: "#B0B0B0" }} />
            <span style={{ fontSize: '14px' }}>Probar agente</span>
          </Button>

          <ItemNavigation items={[
            { id: "contactIdentification", label: 'Información General' },
            { id: "billingDetails", label: 'Instrucciones' },
            { id: "temperature", label: 'Temperatura' },
          ]} />

          <Button
            action={() => { }}
            type="white"
            headerStyle={{
              borderRadius: "999px",
              width: "fit-content",
              fontSize: "12px",
              padding: "10px 10px",
            }}
          >
            + Nueva respuesta programada
          </Button>


          <ParametersLabel
            parameters={contactData.parameters}
            setContactDataInputs={setContactData}
            editingIndices={editingIndices}
            setEditingIndices={setEditingIndices}
            showCreateParameter={showCreateParameter}
            setShowCreateParameter={setShowCreateParameter}
          />
        </div>

        <div className={styles.infoAgentSection}>
          <div className={styles.tabsSection}>
            <ProfileModalTemplate
              image={localAgent.image}
              handleContactData={handleContactData}
              id={localAgent._id}
              sticky={true}
              customStyle={{
                width: "150px",
                height: "150px",
              }}
            />

            <div className={styles.content}>
              <div className={`${styles.typeContact}`}>
                <Tab
                  className={localAgent.type == "public" && styles.selected}
                  setLocalAgent={() =>
                    setLocalAgent((prev) => ({ ...prev, type: "public" }))
                  }
                  title={t("public")}
                />

                <Tab
                  className={localAgent.type == "private" && styles.selected}
                  setLocalAgent={() =>
                    setLocalAgent((prev) => ({ ...prev, type: "private" }))
                  }
                  title={t("private")}
                />

                <Tab
                  className={localAgent.type == "key" && styles.selected}
                  setLocalAgent={() =>
                    setLocalAgent((prev) => ({ ...prev, type: "key" }))
                  }
                  title={t("key")}
                />
              </div>

              <div className={styles.newAgentSection}>
                <CustomDropdown
                  placeholder={"Categoría"}
                  options={fileTypes}
                  selectedOption={selectedTypes}
                  height="31px"
                  textStyles={{
                    display: "flex",
                    fontWeight: 300,
                    marginLeft: "6px",
                    userSelect: "none",
                  }}
                  setSelectedOption={(selected) =>
                    setSelectedTypes((prev) => {
                      if (prev.includes(selected)) {
                        return prev.filter((option) => option !== selected);
                      } else {
                        return [...prev, selected];
                      }
                    })
                  }
                />

                <InputWithTitle
                  bgColor="#F4F4F4"
                  titleColor="#18181B"
                  placeholder={"Clave"}
                  textStyles={{
                    display: "flex",
                    gap: "5px",
                    fontWeight: 500,
                    color: "#3d3c42",
                    marginLeft: "6px",
                    userSelect: "none",
                  }}
                  inputHeight="31px"
                  title=""
                />
              </div>
            </div>
          </div>

          <h3>Información General</h3>
          <div className={styles.newAgentSection}>

            <InputWithTitle
              bgColor="#F4F4F4"
              titleColor="#18181B"
              placeholder={"Name your GPT"}
              textStyles={{
                display: "flex",
                gap: "5px",
                fontWeight: 500,
                color: "#3d3c42",
                marginLeft: "6px",
                userSelect: "none",
              }}
              inputHeight="31px"
              title="Name"
            />

            <InputWithTitle
              bgColor="#F4F4F4"
              titleColor="#18181B"
              placeholder={"Add a short description about what this GPT does"}
              textStyles={{
                display: "flex",
                gap: "5px",
                fontWeight: 500,
                color: "#3d3c42",
                marginLeft: "6px",
                userSelect: "none",
              }}
              inputHeight="31px"
              title="Description"
            />

            <InputWithTitle
              bgColor="#F4F4F4"
              titleColor="#18181B"
              placeholder={"Add #short code"}
              textStyles={{
                display: "flex",
                gap: "5px",
                fontWeight: 500,
                color: "#3d3c42",
                marginLeft: "6px",
                userSelect: "none",
              }}
              inputHeight="31px"
              title="# Subir documentación"
            />

            <p>AI Model</p>

            <CheckboxWithText
              state={allFiles}
              setState={setAllFiles}
              text={t('allowAllFileTypes')}
            />

            <CheckboxWithText
              state={allFiles}
              setState={setAllFiles}
              text={t('allowAllFileTypes')}
            />

            <CustomDropdown
              placeholder={"Seleccionar un published modal"}
              options={fileTypes}
              selectedOption={selectedTypes}
              height="31px"
              textStyles={{
                display: "flex",
                fontWeight: 300,
                marginLeft: "6px",
                userSelect: "none",
              }}
              setSelectedOption={(selected) =>
                setSelectedTypes((prev) => {
                  if (prev.includes(selected)) {
                    return prev.filter((option) => option !== selected);
                  } else {
                    return [...prev, selected];
                  }
                })
              }
            />
          </div>

          <h3>Instrucciones</h3>
          <div className={styles.newAgentSection}>

            <div className={styles.listAgents}>
              {
                AgentTypes.map((agentType, index) => (
                  <Button
                    key={index}
                    action={() => { }}
                    type="white"
                    headerStyle={{
                      borderRadius: "100px",
                      width: "fit-content",
                      fontSize: "12px",
                      padding: "5px",
                      fontWeight: 400,
                    }}
                  >
                    {agentType.name}
                  </Button>
                ))
              }
            </div>

            <div className={styles.componentContainer}>
              <div className={styles.content}>
                <div className={styles.highlightText}>
                  What does this GPT do? How does it behave? What should it avoid doing?
                </div>
                <div className={styles.listContainer}>
                  <div className={styles.listItem}>Extrae información clave de textos largos.</div>
                  <div className={styles.listItem}>Identifica y clasifica objetos en imágenes y videos.</div>
                  <div className={styles.listItem}>Redacta y contextualiza en un escrito detallado.</div>
                  <div className={styles.listItem}>Transcribe videos o audio en texto</div>
                  <div className={styles.listItem}>Organiza información en categorías.</div>
                  <div className={styles.listItem}>Sintetiza información de diferentes fuentes en un informe.</div>
                </div>
              </div>
            </div>
          </div>

          <h3>Temperatura</h3>
          <div className={styles.newAgentSection}>
            <p>Tono (1-5)</p>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <Button
                type="border"
                headerStyle={{
                  flexBasis: "120px", 
                  flexShrink: 0,
                  fontSize: "12px",
                }}
              >
                <GreenCopyIcon width={18} height={18} /> More Casual
              </Button>

              <div style={{ flex: 1, height: "20px" }}>
                <VolumeSlider />
              </div>

              <Button
                type="border"
                headerStyle={{
                  flexBasis: "120px",
                  flexShrink: 0,
                  fontSize: "12px",
                }}
              >
                <GreenCopyIcon width={18} height={18} /> More Formal
              </Button>
            </div>

            <p>Respuesta (1-5)</p>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                 <Button
                type="border"
                headerStyle={{
                  flexBasis: "120px", 
                  flexShrink: 0,
                  fontSize: "12px",
                }}
              >
                <GreenCopyIcon width={18} height={18} /> Resumir
              </Button>

              <div style={{
                flex: 1,
                height: "20px",
              }}>
                <VolumeSlider />
              </div>

                 <Button
                type="border"
                headerStyle={{
                  flexBasis: "120px", 
                  flexShrink: 0,
                  fontSize: "12px",
                }}
              >
                <GreenCopyIcon width={18} height={18} /> Detallar
              </Button>
            </div>
          </div>

          <h3>Respuestas programadas</h3>
          <div className={styles.newAgentSection}></div>

          <h3>Capacidades</h3>
          <div className={styles.newAgentSection}>
          </div>
        </div>
      </div>
    </ModalBlackBgTemplate>
  );
};

export default NewAgentComponent
