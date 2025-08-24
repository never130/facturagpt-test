import React, { useState } from "react";
import styles from "../NewAgentComponent.module.css";
import { useTranslation } from "react-i18next";
import Button from "../../Button/Button";
import DeleteButton from "../../DeleteButton/DeleteButton";
import { ReactComponent as PromptsIcon } from "../../../assets/PromptsIcon.svg";
import { ReactComponent as YourPromptsIcon } from "../../../assets/YourPromptsIcon.svg";
import { createLabelTitleDescription } from "../../../../../actions/automate";
import { useDispatch, useSelector } from "react-redux";
const Instructions = ({
  localAgent,
  setLocalAgent,
  setTempInstruction,
  tempInstruction,
}) => {
  const [t] = useTranslation("ChatView");
  const [selectedType, setSelectedType] = useState("prompts");
  const [tempPromptInstructions, setTempPromptInstructions] = useState([]);
  const [maxCharacters,setMaxCharacters] = useState(2000)
  const [loading,setLoading] = useState(false)
const dispatch = useDispatch()
const handleDeleteInstruction = (indexToRemove) => {
  setTempPromptInstructions((prev) =>
    prev.filter((_, idx) => idx !== indexToRemove)
  );
};


  const handleTextareaKeyDown = async (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (tempInstruction.trim()) {
        if (selectedType === "prompts") {
          try {
            const res = await dispatch(
              createLabelTitleDescription({
                prompt: tempInstruction,
                token: tokenGPT,
              })
            );
  
            const generatedActions = res?.payload?.data || [];
  
            setTempPromptInstructions((prev) => [
              ...prev,
              {
                title: tempInstruction.trim(),
                actions: generatedActions,
              },
            ]);
  
            setTempInstruction("");
          } catch (error) {
            console.error("Error al generar acciones del prompt:", error);
          }
        }
      }
    }
  };
  

  const handleSavePrompt = () => { 
    if (selectedType === "prompts") {
      setLocalAgent((prev) => ({
        ...prev,
        prompts: [
          ...(prev.prompts || []),
          ...tempPromptInstructions,
        ],
      }));
      setTempPromptInstructions([]);
    }
  };
  
  const [actions,setActions] = useState(null)

  const defaultInstructions = [
    {
      title: t("summaryAgent"),
      actions: [
        { title: "summaryAgentAction1", description: "Descripción de summaryAgentAction1", value: "summaryAgentAction1" },
        { title: "summaryAgentAction2", description: "Descripción de summaryAgentAction2", value: "summaryAgentAction2" },
        { title: "summaryAgentAction3", description: "Descripción de summaryAgentAction3", value: "summaryAgentAction3" },
        { title: "summaryAgentAction4", description: "Descripción de summaryAgentAction4", value: "summaryAgentAction4" },
        { title: "summaryAgentAction5", description: "Descripción de summaryAgentAction5", value: "summaryAgentAction5" },
      ],
    },
    {
      title: t("objectDetectionAgent"),
      actions: [
        { title: "objectDetectionAgentAction1", description: "Descripción de objectDetectionAgentAction1", value: "objectDetectionAgentAction1" },
        { title: "objectDetectionAgentAction2", description: "Descripción de objectDetectionAgentAction2", value: "objectDetectionAgentAction2" },
        { title: "objectDetectionAgentAction3", description: "Descripción de objectDetectionAgentAction3", value: "objectDetectionAgentAction3" },
        { title: "objectDetectionAgentAction4", description: "Descripción de objectDetectionAgentAction4", value: "objectDetectionAgentAction4" },
        { title: "objectDetectionAgentAction5", description: "Descripción de objectDetectionAgentAction5", value: "objectDetectionAgentAction5" },
      ],
    },
    {
      title: t("editorialAgent"),
      actions: [
        { title: "editorialAgentAction1", description: "Descripción de editorialAgentAction1", value: "editorialAgentAction1" },
        { title: "editorialAgentAction2", description: "Descripción de editorialAgentAction2", value: "editorialAgentAction2" },
        { title: "editorialAgentAction3", description: "Descripción de editorialAgentAction3", value: "editorialAgentAction3" },
        { title: "editorialAgentAction4", description: "Descripción de editorialAgentAction4", value: "editorialAgentAction4" },
        { title: "editorialAgentAction5", description: "Descripción de editorialAgentAction5", value: "editorialAgentAction5" },
      ],
    },
    {
      title: t("transcriptionAgent"),
      actions: [
        { title: "transcriptionAgentAction1", description: "Descripción de transcriptionAgentAction1", value: "transcriptionAgentAction1" },
        { title: "transcriptionAgentAction2", description: "Descripción de transcriptionAgentAction2", value: "transcriptionAgentAction2" },
        { title: "transcriptionAgentAction3", description: "Descripción de transcriptionAgentAction3", value: "transcriptionAgentAction3" },
        { title: "transcriptionAgentAction4", description: "Descripción de transcriptionAgentAction4", value: "transcriptionAgentAction4" },
        { title: "transcriptionAgentAction5", description: "Descripción de transcriptionAgentAction5", value: "transcriptionAgentAction5" },
      ],
    },
    {
      title: t("classificationAndLabelingAgent"),
      actions: [
        { title: "classificationAndLabelingAgentAction1", description: "Descripción de classificationAndLabelingAgentAction1", value: "classificationAndLabelingAgentAction1" },
        { title: "classificationAndLabelingAgentAction2", description: "Descripción de classificationAndLabelingAgentAction2", value: "classificationAndLabelingAgentAction2" },
        { title: "classificationAndLabelingAgentAction3", description: "Descripción de classificationAndLabelingAgentAction3", value: "classificationAndLabelingAgentAction3" },
        { title: "classificationAndLabelingAgentAction4", description: "Descripción de classificationAndLabelingAgentAction4", value: "classificationAndLabelingAgentAction4" },
        { title: "classificationAndLabelingAgentAction5", description: "Descripción de classificationAndLabelingAgentAction5", value: "classificationAndLabelingAgentAction5" },
      ],
    },
    {
      title: t("referralAgent"),
      actions: [
        { title: "referralAgentAction1", description: "Descripción de referralAgentAction1", value: "referralAgentAction1" },
        { title: "referralAgentAction2", description: "Descripción de referralAgentAction2", value: "referralAgentAction2" },
        { title: "referralAgentAction3", description: "Descripción de referralAgentAction3", value: "referralAgentAction3" },
        { title: "referralAgentAction4", description: "Descripción de referralAgentAction4", value: "referralAgentAction4" },
        { title: "referralAgentAction5", description: "Descripción de referralAgentAction5", value: "referralAgentAction5" },
      ],
    },
    {
      title: t("imageGenerationAgent"),
      actions: [
        { title: "imageGenerationAgentAction1", description: "Descripción de imageGenerationAgentAction1", value: "imageGenerationAgentAction1" },
        { title: "imageGenerationAgentAction2", description: "Descripción de imageGenerationAgentAction2", value: "imageGenerationAgentAction2" },
        { title: "imageGenerationAgentAction3", description: "Descripción de imageGenerationAgentAction3", value: "imageGenerationAgentAction3" },
        { title: "imageGenerationAgentAction4", description: "Descripción de imageGenerationAgentAction4", value: "imageGenerationAgentAction4" },
        { title: "imageGenerationAgentAction5", description: "Descripción de imageGenerationAgentAction5", value: "imageGenerationAgentAction5" },
      ],
    },
  ];
  

  const { tokenGPT } = useSelector((state) => state.user.user);
  const handleGeneratePrompt = async () => {
    setLoading(true)
    if (tempInstruction.trim()) {
      try {
        const res = await dispatch(
          createLabelTitleDescription({
            prompt: tempInstruction,
            token: tokenGPT,
          })
        );
        const generatedActions = res?.payload?.data || [];
        
        setTempPromptInstructions((prev) => [
          ...prev,
          {
            title: tempInstruction.trim(),
            actions: generatedActions,
          },
        ]);
        
        if(res) {
          setLoading(false)
        }
        setTempInstruction("");
      } catch (error) {
        console.error("Error al generar acciones del prompt:", error);
      }
    }
    setLoading(false)
  };
  

  return (
    <div className={styles.newAgentSection}>
      <div className={styles.typeContact}>
        <button
          onClick={() => {
            setActions(null)
            setSelectedType("prompts")
          }}
          className={selectedType === "prompts" ? styles.selected : ""}
        >
          {t("Prompts")}
          <PromptsIcon className={styles.PromptsIcon} />
        </button>

        <button
          onClick={() => {
            setActions(null)
            setSelectedType("yourPrompts")
          }}
          className={selectedType === "yourPrompts" ? styles.selected : ""}
        >
          {t("yourPrompts")}
          <YourPromptsIcon />
        </button>

        <button
          onClick={() => {
            setActions(null)
            setSelectedType("default")
          }}
          className={selectedType === "default" ? styles.selected : ""}
        >
          {t("default")}
        </button>
      </div>

      {selectedType === "default" && (
        <div
          className={`${styles.listAgents} ${styles.defaultInstructionsContainer}`}
        >
          {defaultInstructions.map((instruction) => (
            <Button
            action={() => {
              setLocalAgent((prev) => ({
                ...prev,
                instructions: instruction.actions.filter(
                  (action, index, self) =>
                    index === self.findIndex((a) => a.value === action.value)
                ),
              }));
            }}
            
            
            
              type="border"
              headerStyle={{
                borderRadius: "100px",
              }}
            >
              {instruction.title}
            </Button>
          ))}
        </div>
      )}


{selectedType === 'yourPrompts' && (
        <div className={styles.listAgents}>
          {(localAgent?.prompts || []).map((agentType, index) => (
  <Button
    key={index}

    action={() => {
      setLocalAgent((prev) => ({
        ...prev,
        instructions: agentType.actions.filter(
          (action, index, self) =>
            index === self.findIndex((a) => a.value === action.value)
        ),
      }));
    }}
    
    type="border"
    headerStyle={{ borderRadius: "100px" }}
  >
    {agentType.title}
    <DeleteButton
      action={() => {
        setLocalAgent((prev) => ({
          ...prev,
          prompts: (prev.prompts || []).filter(
            (p) => p.title !== agentType.title
          ),
        }));
      }}
    />
  </Button>
))}

        </div>
      )}

{selectedType === 'prompts' && (
  <div className={styles.listAgents}>
{tempPromptInstructions.map((item, index) => (
  <Button
    key={index}
    action={() => {
      setLocalAgent((prev) => ({
        ...prev,
        instructions: item.actions.filter(
          (action, index, self) =>
            index === self.findIndex((a) => a.value === action.value)
        ),
      }));
    }}
    
    type="border"
    headerStyle={{ borderRadius: "100px" }}
  >
    {item.title}
    <DeleteButton action={() => handleDeleteInstruction(index)} />
  </Button>
))}

  </div>
)}

     
      {(selectedType === 'prompts' || (selectedType !== 'prompts' ))&& (

      <div className={styles.instructionsContainer}>
        {selectedType === 'prompts' && (

          <textarea
          value={tempInstruction}
          name="description"
          onChange={(e) => {
    const newValue = e.target.value;
    if (newValue.length <= maxCharacters) {
      setTempInstruction(newValue);
    }
  }}
  onKeyDown={handleTextareaKeyDown}
  className={styles.textareaPrompt}
  placeholder={t("newCustomPrompt")}
/>
)}
{localAgent?.instructions?.map((action) => (
 <span className={styles.actions}>
 {action.title}
 <DeleteButton
   action={() => {
     setLocalAgent((prev) => ({
       ...prev,
       instructions: prev.instructions.filter((a) => a !== action),
     }));
   }}
 />
</span>

))}
{selectedType === 'prompts' && (

  <div className={styles.footerInstructions}>
          <span>{tempInstruction?.length}/{maxCharacters}</span>
          <Button type="green" action={handleGeneratePrompt} disabledOption={loading}>{loading ? t('loading') : t("generatePrompt")}</Button>
          <Button type="white"action={handleSavePrompt}>{t("savePrompt")}</Button>
        </div>
    )}
      </div>
      )}
    </div>
  );
};

export default Instructions;
