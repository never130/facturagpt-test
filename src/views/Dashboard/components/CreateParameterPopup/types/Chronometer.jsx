import { useState, useEffect } from "react";
import styles from "../../DashboardComponents/Main/RightPanel/RightPanel.module.css";
import { ReactComponent as IconPlay } from "../../DashboardComponents/Main/assets/icon-play.svg";
import { ReactComponent as IconPause } from "../../DashboardComponents/Main/assets/icon-pause.svg";
import { ReactComponent as IconRestart } from "../../../assets/RestartIcon.svg";
import { ReactComponent as IconFinishLap } from "../../../assets/FinishLapIcon.svg";
import BasicAdvancedSelector from "../components/BasicAdvancedSelector";
import OptionsSwitchComponent from "../../OptionsSwichComponent/OptionsSwitchComponent";
import { useTranslation } from "react-i18next";

const Chronometer = ({
  parameterData,
  setParameterData,
  handleChange,
  editingInput,
  setEditingInput,
}) => {
  return (
    <div>
      <MediaControls
        parameterData={parameterData}
        setParameterData={setParameterData}
        handleChange={handleChange}
      />
    </div>
  );
};

export default Chronometer;

const MediaControls = ({ parameterData, setParameterData, handleChange }) => {
  const [t] = useTranslation("");

  // Estados del cronómetro
  const [time, setTime] = useState(0); // Tiempo en milisegundos
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState([]); // Array de tiempos de vueltas
  const [startTime, setStartTime] = useState(null); // Timestamp de inicio
  const [pausedTime, setPausedTime] = useState(0); // Tiempo acumulado en pausas
  const [selectedActivity, setSelectedActivity] = useState("run"); // Actividad seleccionada por defecto

  // Función para formatear el tiempo completo (HH:MM:SS)
  const formatTime = (timeInMs) => {
    const totalSeconds = Math.floor(timeInMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  // Función para formatear el tiempo corto (MM:SS)
  const formatTimeShort = (timeInMs) => {
    const totalSeconds = Math.floor(timeInMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  // Lógica del timer basada en timestamps
  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        const now = Date.now();
        const elapsedTime = now - startTime + pausedTime;
        setTime(elapsedTime);
      }, 10); // Actualiza cada 10ms para suavidad visual
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning, startTime, pausedTime]);

  // Funciones de control
  const handlePlayPause = () => {
    if (!isRunning) {
      // Iniciar cronómetro
      if (startTime === null) {
        // Primera vez que se inicia
        setStartTime(Date.now());
        setPausedTime(0);
      } else {
        // Reanudar después de pausa
        setStartTime(Date.now());
      }
      setIsRunning(true);
    } else {
      // Pausar cronómetro
      setPausedTime(time); // Guardar el tiempo actual
      setIsRunning(false);
    }
  };

  // Función para encontrar el lap con menor tiempo
  const getBestLapIndex = () => {
    if (laps.length === 0) return -1;
    let bestIndex = 0;
    let bestTime = laps[0].lapTime;

    laps.forEach((lap, index) => {
      if (lap.lapTime < bestTime) {
        bestTime = lap.lapTime;
        bestIndex = index;
      }
    });

    return bestIndex;
  };

  const handleRestart = () => {
    // Guardar resumen de la sesión si existen laps
    if (laps.length > 0) {
      const sessionSummary = {
        activity: selectedActivity,
        totalLaps: laps.length,
        totalTime: time,
        bestLapTime: Math.min(...laps.map((l) => l.lapTime)),
        date: new Date().toISOString(), // Agregar fecha de la sesión
      };

      handleChange({
        target: {
          name: "savedSessions",
          value: [...(parameterData.savedSessions || []), sessionSummary],
        },
      });
    }

    // Limpiar estados
    setTime(0);
    setIsRunning(false);
    setLaps([]);
    setStartTime(null);
    setPausedTime(0);
  };

  const handleFinishLap = () => {
    if (isRunning) {
      const newLap = {
        lapNumber: laps.length + 1,
        totalTime: time,
        lapTime:
          laps.length > 0 ? time - laps[laps.length - 1].totalTime : time,
      };
      setLaps((prev) => [...prev, newLap]);
    }
  };

  const handleModeChange = (mode) => {
    handleChange({ name: "mode", newValue: mode });
  };

  // Función para seleccionar actividad
  const handleActivitySelect = (activity) => {
    setSelectedActivity(activity);
  };
  return (
    <div>
      <BasicAdvancedSelector
        selectedMode={parameterData.mode}
        onModeChange={handleModeChange}
      />
      <p className={styles.textContent}>{t("chronometer")}</p>

 
        <div className={styles.chronometerContainer}>
          <div className={styles.timeDisplayContainer}>
            <div className={styles.timeDisplay}>
              {formatTime(time)}
              <span>{t(selectedActivity)}</span>
            </div>

            <div className={styles.chronometerControls}>
              <div className={styles.restartButton} onClick={handleRestart}>
                <IconRestart />
              </div>
              {isRunning && (
                <div
                  className={styles.finishLapButton}
                  onClick={handleFinishLap}
                >
                  <IconFinishLap />
                </div>
              )}

              <div
                className={`${styles.playButton} ${isRunning ? styles.pause : styles.play}`}
                onClick={handlePlayPause}
              >
                {isRunning ? <IconPause /> : <IconPlay />}
              </div>
            </div>
          </div>
          <div className={styles.infoChronometer}>
            <div className={styles.section}>
              <p className={styles.sectionTitle}>{t("activity")}</p>
              <div className={styles.activityContainer}>
                <div
                  className={`${styles.activity} ${selectedActivity === "run" ? styles.activitySelected : ""}`}
                  onClick={() => handleActivitySelect("run")}
                >
                  {t("run")}
                </div>
                <div
                  className={`${styles.activity} ${selectedActivity === "swim" ? styles.activitySelected : ""}`}
                  onClick={() => handleActivitySelect("swim")}
                >
                  {t("swim")}
                </div>
                <div
                  className={`${styles.activity} ${selectedActivity === "cycling" ? styles.activitySelected : ""}`}
                  onClick={() => handleActivitySelect("cycling")}
                >
                  {t("cycling")}
                </div>
                <div
                  className={`${styles.activity} ${selectedActivity === "study" ? styles.activitySelected : ""}`}
                  onClick={() => handleActivitySelect("study")}
                >
                  {t("study")}
                </div>
              </div>
            </div>
                         <div className={styles.section}>
               <p className={styles.sectionTitle}>{t("recentTimes")}</p>
               {parameterData?.savedSessions?.map((session, index) => {
                 return (
                   <div
                     key={index}
                     className={styles.lap}
                   >
                     <div className={styles.sessionHeader}>
                       <p>{t(session.activity)}</p>
                       <span>{session.totalLaps} {t("laps")}</span>
                     </div>
                     <div>
                       <span>{formatTime(session.totalTime)}</span>
                       {/* <span>{formatTimeShort(session.bestLapTime)}</span> */}
                     </div>
                   </div>
                 );
               })}
             </div>
            <div className={styles.section}>
              <p className={styles.sectionTitle}>
                {t("laps")} {laps.length > 0 && laps.length}
              </p>

              {laps?.map((lap, index) => {
                const isBestLap = index === getBestLapIndex();
                return (
                  <div
                    key={index}
                    className={`${styles.lap} ${isBestLap ? styles.bestLap : ""}`}
                  >
                    <span>
                      {t("lap")} {lap.lapNumber}
                      {isBestLap && "🏆"}
                    </span>
                    <div>
                      <span>{formatTime(lap.totalTime)}</span>
                      <span>{formatTimeShort(lap.lapTime)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        {parameterData.mode !== "basic" && (
        <div>
          <div className={styles.chronometersOptions}>
            <OptionsSwitchComponent
              border={"none"}
              marginLeft={"0"}
              isChecked={parameterData?.chronometerHours || false}
              setIsChecked={(value) => {
                console.log("value", value);
                handleChange({ name: "chronometerHours", newValue: value });
              }}
            />
            <p>{t("chronometerHours")}</p>
          </div>
          <div className={styles.chronometersOptions}>
            <OptionsSwitchComponent
              border={"none"}
              marginLeft={"0"}
              isChecked={parameterData?.chronometerMinutes || false}
              setIsChecked={(value) =>
                handleChange({ name: "chronometerMinutes", newValue: value })
              }
            />
            <p>{t("chronometerMinutes")}</p>
          </div>
          <div className={styles.chronometersOptions}>
            <OptionsSwitchComponent
              border={"none"}
              marginLeft={"0"}
              isChecked={parameterData?.chronometerSeconds || false}
              setIsChecked={(value) =>
                handleChange({ name: "chronometerSeconds", newValue: value })
              }
            />
            <p>{t("chronometerSeconds")}</p>
          </div>
          <div className={styles.chronometersOptions}>
            <OptionsSwitchComponent
              border={"none"}
              marginLeft={"0"}
              isChecked={parameterData?.chronometerMilliseconds || false}
              setIsChecked={(value) =>
                handleChange({
                  name: "chronometerMilliseconds",
                  newValue: value,
                })
              }
            />
            <p>{t("chronometerMilliseconds")}</p>
          </div>
        </div>
      )}
    </div>
  );
};
