import React, { useState, useRef, useEffect } from "react";
import Button from "../../../Button/Button";
import styles from "./ConnectedApps.module.css";
import { ReactComponent as OpenaiIcon } from "../../../../assets/openaiIcon.svg";
import { AutomateDataComponent } from "../../../Automate/utils/automatesJson";
import { useDispatch, useSelector } from "react-redux";
import CardAutomate from "../../../Automate/Components/CardAutomate/CardAutomate";
import { deleteAutomation, getAllUserAutomationsWithFilter } from "../../../../../../actions/automate";
import { updateAccount, updateTokens, getTokens } from "../../../../../../actions/user";
import { useTranslation } from "react-i18next";
import SearchIconWithIcon from "../../../SearchIconWithIcon/SearchIconWithIcon";
import PaginationTables from "../../../PaginationTables/PaginationTables";
import FiltersDropdownContainer from "../../../FiltersDropdownContainer/FiltersDropdownContainer";
import useFocusShortcut from "../../../../../../utils/useFocusShortcut";
import KIcon from "../../../../assets/KIcon.svg";
import { ReactComponent as LittleCopy } from "../../../../assets/littleCopy.svg";
import { ReactComponent as LittleCopyCheck } from "../../../../assets/littleCopyCheck.svg";
import { ReactComponent as TokenDeepSeek } from "../../../../assets/tokenDeepSeek.svg";
import { ReactComponent as TokenOpenAI } from "../../../../assets/tokenOpenAI.svg";
import { ReactComponent as ClaudeAnthropic } from "../../../../assets/claudeAnthropic.svg";
import { ReactComponent as CheckCircleToken } from "../../../../assets/checkCircleToken.svg";

import TokenModal from "./tokenModal/tokenModal.jsx";

const ConnectedApps = ({ setShowTokenModal, openModalAutomate }) => {
  const [t] = useTranslation('accountSetting')
  const data = AutomateDataComponent()
  const { userAutomations } = useSelector((state) => state.automate);
  const dispatch = useDispatch();



  const searchInputRef = useRef(null);

  useFocusShortcut(searchInputRef, "k");
  const totalAutomations = userAutomations.length
  const [limit, setLimit] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const { user, tokens } = useSelector((state) => state.user);
  const [userId, setUserId] = useState()
  const [localAutomations, setLocalAutomations] = useState([])


  useEffect(() => {
    setLocalAutomations(userAutomations)
  }, [])

  useEffect(() => {
    let userId = user.id.split("_").pop()
    setUserId(userId)
  }, [user])




  const [selectedOption, setSelectedOption] = useState({
    "Orden Alfabético": "A-Z",
    Estado: "Todos",
    "Moneda Preferida": "USD",
    "# Transacciones": "Mayor a menos",
    "Ingresos/Costes": "Ingresos de mayor a menor",
  });

  const options = [
    {
      name: "Orden Alfabético",
      label: t("alphabeticOrder"),
      subOptions: [
        { display: "A-Z", value: "A-Z" },
        { display: "Z-A", value: "Z-A" }
      ],
    },
    {
      name: "Estado",
      label: t("status"),
      subOptions: [
        { display: t("all"), value: "Todos" },
        { display: t("approved"), value: "Aprobados" },
        { display: t("notApproved"), value: "No aprobados" },
        { display: t("paid"), value: "Pagados" },
        { display: t("pending"), value: "Pendiente" },
        { display: t("defaulted"), value: "Incumplidos" },
        { display: t("expired"), value: "Vencido" },
        { display: t("cancelled"), value: "Anulados" }
      ],
    },
    {
      name: "Moneda Preferida",
      label: t("preferredCurrency"),
      subOptions: "currencies",
    },
    {
      name: "# Transacciones",
      label: t("transactions"),
      subOptions: [
        { display: t("higherToLower"), value: "Mayor a menos" },
        { display: t("lowerToHigher"), value: "Menor a mayor" }
      ],
    },
    {
      name: "Ingresos/Costes",
      label: t("incomeCosts"),
      subOptions: [
        { display: t("incomeHigherToLower"), value: "Ingresos de mayor a menor" },
        { display: t("incomeLowerToHigher"), value: "Ingresos de menor a mayor" },
        { display: t("costsHigherToLower"), value: "Costes de mayor a menor" },
        { display: t("costsLowerToHigher"), value: "Costes de menor a mayor" }
      ],
    },
  ];


  useEffect(() => {

    const fn = async () => {
      let localAutomations = await dispatch(
        getAllUserAutomationsWithFilter({
          search: searchTerm,
          limit,
          skip: page * limit,
          sortAlpha: selectedOption["Orden Alfabético"],
          statusFilter: selectedOption.Estado,
          sortQuantity: selectedOption.Generado,
          userId: userId
        })
      )
      setLocalAutomations(localAutomations.payload.automations)
    }
    fn()


  }, [limit, page, searchTerm, selectedOption]);



  const filteredData = localAutomations.filter((item) => {
    return true;
  });


  const handleDelete = async (automationData) => {
    const res = await dispatch(
      deleteAutomation({
        automationId: automationData.id,
        userId: automationData.userId,
      })
    );
    setLocalAutomations(res.payload)
    return res;
  };

  const [copiado, setCopiado] = useState(null);

  const copiarAlClipboard = async (texto, index) => {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(index);
      setTimeout(() => setCopiado(null), 1000);
    } catch (err) {
      console.error("Error al copiar", err);
    }
  };

  const enmascararTexto = (txt) => {
    if (txt?.length <= 8) return txt;
    else if (txt?.length > 8) {
      const inicio = txt?.slice(0, 4);
      const fin = txt?.slice(-4);
      const medio = "•".repeat(10);
      return `${inicio}${medio}${fin}`;
    }
  };

  const [typeSelected, setTypeSelected] = useState(1)

  const selectType = (e) => {
    setTypeSelected(e.target.id)
  }

  const tokenSelected = async (tokenText) => {
    await dispatch(updateAccount({
      data: {
        ...user,
        tokenGPT: tokenText
      }
    }));


    await dispatch(updateTokens({
      data: {
        ...tokens,
        tokens: [...tokens?.tokens?.map(tok => {
          if (tok.token === tokenText) return { token: tok.token, active: true, type: tok.type }
          else return { token: tok.token, active: false, type: tok.type }
        }).sort((a, b) => {
          if (a.active === b.active) return 0;
          return a.active ? -1 : 1;
        })],
        tokenGPT: tokenText
      },
      id: user?.id?.split("_").pop()
    }));

  }


  return (
    <div>
      {totalAutomations > 20 && (
        <div className={styles.headerConnectedApps}>


          <div  >
            <PaginationTables totalData={totalAutomations}
              limit={limit}
              page={page}
              setPage={setPage}
              setLimit={setLimit}
              father={"connectedApps"} />
          </div>

        </div>
      )}
      <div style={{ color: "#666666", fontSize: "14px", marginBottom: "5%" }}>
        <div>
          <SearchIconWithIcon
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            ref={searchInputRef} >
            <>
              <div
                style={{ marginLeft: "5px" }}
                className={styles.searchIconsWrappers}
              >
                <img src={KIcon} alt="kIcon" />
              </div>

              <FiltersDropdownContainer
                setSelectedFilters={setSelectedOption}
                selectedFilters={selectedOption}
                options={options}
              />
            </>
          </SearchIconWithIcon>

        </div>
        <div className={styles.buttonContainer}>
          <button className={typeSelected == 1 && styles.buttonActive} id={1} onClick={(e) => selectType(e)} >{t('all')}</button>
          <button className={typeSelected == 2 && styles.buttonActive} id={2} onClick={(e) => selectType(e)} >{t('apps')}</button>
          <button className={typeSelected == 3 && styles.buttonActive} id={3} onClick={(e) => selectType(e)} >{t('tokens')}</button>
        </div>
      </div>
      {typeSelected != 2 &&
        <div>
          <div>
            <h4 style={{ margin: "5px 0px" }}>{t('tokens')} </h4>
            {tokens?.tokens?.length > 0 ?

              tokens?.tokens.map(token => {
                return (
                  <div className={styles.automatesConnectedApps} >
                    <div className={styles.automateConnectedApps}>
                      <div
                        onClick={() => tokenSelected(token.token)}
                        className={styles.container}
                        style={{ cursor: "pointer" }}
                      >
                        {token.type === "gpt" ? <TokenOpenAI /> : <ClaudeAnthropic />}
                        <div className={styles.automateConnectedAppsInfo}>
                          <div className={styles.automateConnectedAppsInfoTitle}>
                            <p style={{ color: "#222222", fontSize: "12px" }}>{token.type === "gpt" ? t('TokenOpenAI') : t('claudeAnthropic')}</p>
                          </div>
                          <div className={styles.automateConnectedAppsInfoButton}>
                            <Button headerStyle={{ all: "unset", color: "#71717a" }}>
                              <span >
                                {token.active && <>
                                  {t('conected')} <CheckCircleToken />
                                </>}
                              </span>
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className={styles.inputTokenContainer} >
                        <input type="text" value={token.token} />
                      </div>
                    </div>
                  </div>)

              }) : (<p style={{ color: "#717171", fontSize: "12px" }}>
                {t('connectYourAccountWithYourLanguageModels')}
              </p>
              )}
          </div>
        </div>

      }

      {typeSelected != 3 ? (filteredData.length == 0 ? (
        <span className={styles.noFoundAutomate}  >
          {t('noActiveAutomationsFound')}
        </span>
      ) : (
        <div className={styles.automatesConnectedApps}>
          <h4 >{t('apps')} </h4>
          {filteredData.map((card, index) => {
            const filteredAutomation = data.find(
              (automation) => automation?.type === card?.type
            );

            return (
              <div className={styles.automateConnectedApps}>
                <div className={styles.container}>
                  <img src={filteredAutomation?.image} alt="" />
                  <div className={styles.automateConnectedAppsInfo}>
                    <div className={styles.automateConnectedAppsInfoTitle}>
                      <p>{filteredAutomation?.type}</p>

                    </div>
                    <div className={styles.automateConnectedAppsInfoButton}>
                      {copiado == index ? <button
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "1.2rem",
                          color: "green"
                        }}
                        title="Copiar al portapapeles"
                      >
                        <LittleCopyCheck />
                      </button> :
                        <button
                          onClick={() => copiarAlClipboard(card.id, index)}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "1.2rem"
                          }}
                          title="Copiar al portapapeles"
                        >
                          <LittleCopy />
                        </button>}

                      <p style={{ fontFamily: "monospace", margin: 0 }}>
                        {enmascararTexto(card.id)}
                      </p>

                    </div>
                  </div>
                </div>
                <Button
                  type="white"
                  headerStyle={{
                    borderRadius: "999px",
                    fontSize: "10px",
                    padding: "5px",
                    color: "#666666",
                    border: "none"
                  }}
                  action={() => handleDelete(card)}
                >
                  {t('diconnect')} <CheckCircleToken />
                </Button>
              </div>
            );
          })}
        </div>
      )) : ""}
    </div>
  );
};

export default ConnectedApps;
