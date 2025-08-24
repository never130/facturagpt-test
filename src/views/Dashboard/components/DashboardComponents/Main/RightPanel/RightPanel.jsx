import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import styles from './RightPanel.module.css';
import CustomDropdown from "../../../CustomDropdown/CustomDropdown";
import { useTranslation } from "react-i18next";
import { ReactComponent as IconOpenAi } from '../assets/icon-openai.svg';
import { ReactComponent as IconChat } from '../assets/icon-chat.svg';
import { ReactComponent as IconPlay } from '../assets/icon-play.svg';
import { ReactComponent as IconPause } from '../assets/icon-pause.svg';
import { ReactComponent as IconStop } from '../assets/icon-stop.svg';
import { ReactComponent as HomeClock } from '../../../../assets/homeClock.svg';
import { InputCalendar } from '../../../../screens/CalendarView/Calendar/components/InputCalendar';
import { CalendarContext, CalendarContextProvider } from '../../../../screens/CalendarView/CalendarContext';
import { ReactComponent as DocSectionIcon } from '../../../../assets/DocSectionIcon.svg';
import { ReactComponent as ContactSectionIcon } from '../../../../assets/ContactSectionIcon.svg';
import { ReactComponent as AssettSectionIcon } from '../../../../assets/AssettSectionIcon.svg';
import { ReactComponent as AutomateSectionIcon } from '../../../../assets/automateBlack.svg';
import { useSelector } from 'react-redux';
import ContactsSection from './ContactsSection/ContactsSection';
import AssetsSection from './AssetsSection/AssetsSection';
import AutomateSection from './AutomateSection/AutomateSection';
import DocSection from './DocSection/DocSection';


const ChartCard = () => {
    const { t } = useTranslation("dashboard");
    const [showIncome, setShowIncome] = useState(true);
    const [typeYear, setTypeYear] = useState("Año completo")
    const [year, setYear] = useState("2025")


    const incomeData = [60, 80, 40, 90, 70, 85, 55, 75, 95, 65, 85];
    const expenseData = [50, 70, 30, 80, 60, 75, 45, 65, 85, 55, 75];
    const labels = ['May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic', 'Ene', 'Feb', 'Mar'];

    const handleDateTask=()=>{

    }

    return (
        <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
                <div>
                    <h3 className={styles.chartTitle}>{t('yourEvolution')}</h3>
                    <div className={styles.chartSubtitle}>
                        <button style={{paddingLeft:"0px"}}
                            className={showIncome ? styles.active : ''}
                            onClick={() => setShowIncome(true)}
                        >
                            {t('incomeAndExpenses')}
                        </button>
                 
                        <button
                            className={!showIncome ? styles.active : ''}
                            onClick={() => setShowIncome(false)}
                        >
                           {t('creditHistory')}
                        </button>


                    </div>
                </div>
                <div className={styles.chartControls}>

                <CalendarContextProvider>
                    <InputCalendar
						// taskDate={task?.date}
						handleDateTask={handleDateTask}
						fromKanban={false}
                        father={"rightPanel"}
                        customInput={{color: "#6e6e80",fontWeight: "550",	background: "#f4f4f4", fontSize:"13px"}}
                        customInputWrapper={{background: "#f4f4f4"}}
            
            />
                </CalendarContextProvider>
                     {/* <CustomDropdown
        height="25px"
        options={[1,2]}
        selectedOption={<><HomeClock/><span >{typeYear}</span></>}
        setSelectedOption={(option) => setTypeYear(option)}
        generalDropdownHeader={{color:"#6E6E80"}}
        generalStyleFilterSort={{whiteSpace: "nowrap", padding:"0px 6px 0px 0px"}}
        arrowColorCustom={"#6E6E80"}
        arrowSizeCustom={12}

      /> */}
       {/* <CustomDropdown

        height="25px"
        options={[1,2]}
        selectedOption={year}
        setSelectedOption={(option) => setYear(option)}
        backgroundColor={"transparent"}
        generalDropdownHeader={{color:"#6E6E80"}}
        generalStyleFilterSort={{justifyContent:"end"}}
        arrowColorCustom={"#6E6E80"}
        arrowSizeCustom={12}
        type={'pagination'}

      /> */}
                    {/* 🗓 Año completo ▼ 2025 ▼ */}

                </div>
            </div>
            <div className={styles.chartValue}>0,00€</div>
            <BarChart incomeData={incomeData} data={showIncome ? incomeData : expenseData} expenseData={expenseData}  labels={labels} />
        </div>
    );
};

const BarChart = ({ data, labels,incomeData,expenseData }) => {
    return (
        <>
            <div className={styles.barChart}>
                {data.map((value, index) => (
                    <>
                    <div
                        key={index+value}
                        className={styles.bar}
                        style={{ height: `${value}%` }}
                    />
                    <div
                        key={index}
                        className={styles.bar}
                        style={{ height: `${expenseData[index]}%` }}
                    />
                    </>
                ))}
            </div>
            <div className={styles.chartLabels}>
                {labels.map((label, index) => (
                    <span className={styles.month} key={index}>{label}</span>
                ))}
            </div>
        </>
    );
};

const PanelsSection = () => {
    const { tables, contactsTable, assetsTable, docsTable, tablesFiltered} = useSelector((state) => state.user)
  const { userAutomations } = useSelector((state) => state.automate);

    console.log('userAutomations', userAutomations)

    const [selectedSection, setSelectedSection] = useState(0);
    return (
        <div className={styles.panelsSection}>
             <div className={styles.btnSectionsSelector}>
        <button
          onClick={() => setSelectedSection(0)}
          className={selectedSection === 0 ? styles.sectionSelect : ''}
        >
          <DocSectionIcon />
        </button>
        <button
          onClick={() => setSelectedSection(1)}
          className={selectedSection === 1 ? styles.sectionSelect : ''}
        >
          <ContactSectionIcon />
        </button>
        <button
          onClick={() => setSelectedSection(2)}
          className={selectedSection === 2 ? styles.sectionSelect : ''}
        >
          <AssettSectionIcon />
        </button>
        <button
          onClick={() => setSelectedSection(3)}
          className={selectedSection === 3 ? styles.sectionSelect : ''}
        >
          <AutomateSectionIcon />
        </button>
      </div>

      <div className={styles.panelsContent}>
        {selectedSection === 0 && <div className={styles.docPanel}>
        <DocSection />
        </div>}
        {selectedSection === 1 && <div className={styles.docPanel}>
          <ContactsSection />
        </div>}
        
        {selectedSection === 2 && <div className={styles.docPanel}>
          <AssetsSection />
        </div>}
        
        {selectedSection === 3 && <div className={styles.docPanel}>
         <AutomateSection />
        </div>}

      </div>
        </div>
    );
};


const ChatPanel = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.chatPanel}>
            <div>
                <IconChat />
                <div className={styles.chatDescription}>
                    Más Datos y Analíticas en el Chat
                </div>
            </div>
            <button className={styles.chatButton} onClick={() => {
                navigate("/admin/chat")
            }}>
                <IconOpenAi />
                <span>Habla con FacturaGPT</span>
            </button>
        </div>
    );
};


const MediaControls = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [intervalId, setIntervalId] = useState(null);
    const [isStopped, setIsStopped] = useState(false);


    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        if (hours > 0) {
            return `${hours}h${minutes.toString().padStart(2, '0')}m`;
        } else if (minutes > 0) {
            return `${minutes}m${secs.toString().padStart(2, '0')}s`;
        } else {
            return `${secs}s`;
        }
    };

    const calculateElapsedTime = () => {
        const startTime = localStorage.getItem('startTime');
        const baseTime = parseInt(localStorage.getItem('baseTime') || '0');
        
        if (!startTime) return baseTime;
        
        const now = Date.now();
        const currentSessionTime = Math.floor((now - parseInt(startTime)) / 1000);
        return baseTime + currentSessionTime;
    };

    const handlePlay = () => {
        if (isStopped) {
            setIsStopped(false);
            localStorage.setItem('isStopped', 'false');
            setElapsedTime(0);
            localStorage.setItem('mediaTimer', '0');
            localStorage.setItem('baseTime', '0');
        }
        
        if (!isPlaying) {
            const startTime = Date.now();
            localStorage.setItem('startTime', startTime.toString());
            
            const id = setInterval(() => {
                const currentElapsed = calculateElapsedTime();
                setElapsedTime(currentElapsed);
                localStorage.setItem('mediaTimer', currentElapsed.toString());
            }, 1000);
            setIntervalId(id);
        } else {
            clearInterval(intervalId);
            setIntervalId(null);
        }
        setIsPlaying(!isPlaying);
    };

    const handlePause = () => {
        if (isStopped || !isPlaying) return;
        
        clearInterval(intervalId);
        setIntervalId(null);
        setIsPlaying(false);
        

        const currentElapsed = calculateElapsedTime();
        localStorage.setItem('baseTime', currentElapsed.toString());
        localStorage.removeItem('startTime');
    };

    const handleStop = () => {
        if (isStopped) return;
        
        clearInterval(intervalId);
        setIntervalId(null);
        setIsPlaying(false);
        setIsStopped(true);
        localStorage.setItem('isStopped', 'true');
        localStorage.removeItem('startTime');
        localStorage.removeItem('baseTime');
        alert(`Tiempo total: ${formatTime(elapsedTime)}`);
        setElapsedTime(0);
        localStorage.setItem('mediaTimer', '0');
    };


    useEffect(() => {
        const savedStoppedState = localStorage.getItem('isStopped');
        const startTime = localStorage.getItem('startTime');
        const baseTime = parseInt(localStorage.getItem('baseTime') || '0');
        
        if (savedStoppedState === 'true') {
            setIsStopped(true);
            setIsPlaying(false);
            setElapsedTime(0);
        } else if (!startTime && baseTime > 0) {

            setElapsedTime(baseTime);
            setIsPlaying(false);
        } else if (startTime) {

            const currentElapsed = calculateElapsedTime();
            setElapsedTime(currentElapsed);

            const id = setInterval(() => {
                const newElapsed = calculateElapsedTime();
                setElapsedTime(newElapsed);
                localStorage.setItem('mediaTimer', newElapsed.toString());
            }, 1000);
            setIntervalId(id);
            setIsPlaying(true);
        }
    }, []);

    return (
        <div className={styles.mediaControls}>
            <div className={`${styles.timerDisplay} ${isPlaying ? styles.playing : styles.paused}`}>
                <span className={styles.timeHour}>{formatTime(elapsedTime)}</span>
            </div>
            <button
                className={`${styles.mediaBtn} ${styles.play}`}
                onClick={handlePlay}
                title="Play"
                style={{ opacity: isStopped ? 0.5 : 1 }}
            >
                <IconPlay />
            </button>
            <button
                className={`${styles.mediaBtn} ${styles.pause}`}
                onClick={handlePause}
                title="Pause"
                style={{ opacity: (!isPlaying || isStopped) ? 0.5 : 1 }}
            >
                <IconPause />
            </button>
            <button
                className={`${styles.mediaBtn} ${styles.stop}`}
                onClick={handleStop}
                title="Stop"
                style={{ opacity: isStopped ? 0.5 : 1 }}
            >
                <IconStop />
            </button>
        </div>
    );
};

const RightPanel = () => {
    return (
        <div className={styles.rightPanel}>
            <ChartCard />
            <PanelsSection />
        </div>
    );
};

export default RightPanel;
