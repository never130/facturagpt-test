import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import LabelParameters from "../LabelParameters";
import styles from "../../../screens/ChatView/ChatView.module.css";
import Button from "../../Button/Button";
import {ReactComponent as PlayIcon} from "../../../assets/PlayIcon.svg";
import {ReactComponent as PauseIcon} from "../../../assets/PauseIcon.svg";
import {ReactComponent as TrashIcon} from "../../../assets/trashGrayIcon.svg";
import { useTranslation } from "react-i18next";
import BasicAdvancedSelector from "../components/BasicAdvancedSelector";

const VoiceRecorderWave = forwardRef(({ onSend, onCancel, setParameterData, onStartRecording, onStopRecording }, ref) => {
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [samples, setSamples] = useState([]); 
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef([]);
  const animationRef = useRef(null);
  const [visualSamples, setVisualSamples] = useState([]); 
  const [recordingTime, setRecordingTime] = useState(0);
  const [hoverBar, setHoverBar] = useState(null);
  const recordingRef = useRef(recording);
  const playingRef = useRef(playing);
  const audioUrlRef = useRef(audioUrl);

  const startRecording = async () => {
    setSamples([]);
    setVisualSamples([]);
    setAudioUrl(null);
    setAudioBlob(null);
    setAudioChunks([]);
    setCurrentTime(0);
    setDuration(0);
    setPlaying(false);
    setRecordingTime(0);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new window.MediaRecorder(stream);
      setMediaRecorder(mediaRecorder);
      let localChunks = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) localChunks.push(e.data);
      };
      mediaRecorder.onstop = () => {
        const blob = new Blob(localChunks, { type: "audio/webm" });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        setDuration(blob.duration);
      };
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);
      analyserRef.current = analyser;
      dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);
      let lastSampleTime = 0;
      let tempSamples = [];
      let tempMax = 0;
      let startTimestamp = Date.now();
      const capture = () => {
        analyser.getByteTimeDomainData(dataArrayRef.current);
        const max = Math.max(
          ...dataArrayRef.current.map((v) => Math.abs(v - 128))
        );
        const scaled = Math.min(1, max / 64); 
        tempMax = Math.max(tempMax, scaled);
        const now = Date.now();
        if (now - lastSampleTime >= 250) {
          tempSamples.push(tempMax);
          setVisualSamples([...tempSamples]);
          tempMax = 0;
          lastSampleTime = now;
        }
        if (mediaRecorder.state === "recording") {
          setRecordingTime((now - startTimestamp) / 1000);
          animationRef.current = requestAnimationFrame(capture);
        } else {
          setSamples([...tempSamples]);
        }
      };
      mediaRecorder.onstart = () => {
        setRecording(true);
        animationRef.current = requestAnimationFrame(capture);
        if (onStartRecording) onStartRecording();
      };
      mediaRecorder.onstop = () => {
        setRecording(false);
        cancelAnimationFrame(animationRef.current);
        setSamples([...tempSamples]);
        setVisualSamples([...tempSamples]);
        stream.getTracks().forEach((track) => track.stop());
        const blob = new Blob(localChunks, { type: "audio/webm" });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        
        if (onStopRecording) onStopRecording();
        
        // Automáticamente guardar el audio cuando termine la grabación
        if (onSend) {
          onSend({
            audioBlob: blob,
            samples: [...tempSamples],
          });
        }
      };
      mediaRecorder.start();
    } catch (err) {
      alert("No se pudo acceder al micrófono");
      setRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
    }
  };

  const handleCancel = () => {
    setAudioUrl(null);
    setAudioBlob(null);
    setSamples([]);
    setVisualSamples([]);
    setAudioChunks([]);
    setRecording(false);
    setPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    if (onCancel) onCancel();
  };

  const handlePlay = () => {
    if (!audioUrl) return;
    setPlaying(true);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  };
  const handlePause = () => {
    setPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  useEffect(() => {
    if (!audioRef.current) return;
    const audio = audioRef.current;
    const onEnded = () => {
      setPlaying(false);
      setCurrentTime(0);
    };
    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };
    const onLoadedMetadata = () => {
      if (!isFinite(audio.duration) || audio.duration === 0) {
        const fixDuration = () => {
          if (isFinite(audio.duration) && audio.duration > 0) {
            setDuration(audio.duration);
            audio.removeEventListener("timeupdate", fixDuration);
            audio.currentTime = 0; 
          }
        };
        audio.addEventListener("timeupdate", fixDuration);
        audio.currentTime = 1e101;
      } else {
        setDuration(audio.duration);
      }
    };
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    return () => {
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
    };
  }, [audioUrl]);

  const bars = audioUrl ? samples : visualSamples;
  let currentBar = 0;
  if (audioUrl && duration > 0 && bars.length > 0) {
    currentBar = Math.floor((currentTime / duration) * bars.length);
    if (currentBar < 0) currentBar = 0;
    if (currentBar > bars.length - 1) currentBar = bars.length - 1;
  }

  useEffect(() => {
    let raf;
    if (playing) {
      const update = () => {
        setCurrentTime(audioRef.current.currentTime);
        raf = requestAnimationFrame(update);
      };
      raf = requestAnimationFrame(update);
    }
    return () => raf && cancelAnimationFrame(raf);
  }, [playing]);

  const handleBarClick = (i) => {
    if (!audioRef.current || !duration || !audioUrl) return;
    const newTime = (i / bars.length) * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    if (!playing) {
      setTimeout(() => setCurrentTime(audioRef.current.currentTime), 10);
    } else {
      setPlaying(true);
      audioRef.current.play();
    }
  };

  const formatTime = (s) => {
    if (!isFinite(s) || isNaN(s) || s < 0) return "00:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    startRecording();
  }, []);
  const audioBlobRef = useRef(null);
  const samplesRef = useRef([]);

  const audioBlobReadyRef = useRef(null);

  useEffect(() => {
    if (audioBlob && audioBlobReadyRef.current) {
      audioBlobReadyRef.current(audioBlob);
      audioBlobReadyRef.current = null;
    }
  }, [audioBlob]);
  useEffect(() => {
    audioBlobRef.current = audioBlob;
    samplesRef.current = samples;
  }, [audioBlob, samples]);

  useEffect(() => {
    recordingRef.current = recording;
  }, [recording]);

  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);

  useEffect(() => {
    audioUrlRef.current = audioUrl;
  }, [audioUrl]);
  useImperativeHandle(ref, () => ({
    startRecording,
    stopRecording,
    handlePlay,
    handlePause,
    handleCancel,
    sendRecording: async () => {
      if (audioBlobRef.current) {
        onSend &&
          onSend({
            audioBlob: audioBlobRef.current,
            samples: samplesRef.current,
          });
        return;
      }

      await new Promise((resolve) => {
        audioBlobReadyRef.current = resolve;
      });

      onSend &&
        onSend({
          audioBlob: audioBlobRef.current,
          samples: samplesRef.current,
        });
    },

    isRecording: () => recordingRef.current,
    isPlaying: () => playingRef.current,
    hasAudio: () => !!audioUrlRef.current,
  }));
  return (
    <div className={`${styles.chatRecorder} ${styles.chatRecorderParameter}`} style={{width: "100%",padding: "0px",margin: "0px"}}>
      <div className={styles.chatRecorderPlay}>
        
      
        <audio
          ref={audioRef}
          src={audioUrl || undefined}
          style={{ display: "none" }}
        />
      </div>
      <div className={styles.chatRecorderBars}>
        {bars.map((amp, i) => {
          let color = "#bbb";
          if (audioUrl && duration > 0 && i <= currentBar)
            color = "rgb(16 163 127)";
          if (hoverBar === i) color = "#81c784";
          return (
            <div
              key={i}
              style={{
                width: 6,
                height: Math.max(amp * 40, 4),
                background: color,
                borderRadius: 2,
                transition: "background 0.1s, height 0.1s",
              }}
              onClick={() => handleBarClick(i)}
              onMouseEnter={() => setHoverBar(i)}
              onMouseLeave={() => setHoverBar(null)}
            />
          );
        })}
      </div>
      <div className={styles.chatRecorderBarsBar}>
        {recording && !audioUrl && <span>{formatTime(recordingTime)}</span>}
     
        {audioUrl && (
          <span style={{ marginLeft: 8 }}>
            {formatTime(currentTime)} /{" "}
            {formatTime(
              isFinite(duration) && !isNaN(duration) && duration > 0
                ? duration
                : audioRef.current &&
                    !isNaN(audioRef.current.duration) &&
                    isFinite(audioRef.current.duration) &&
                    audioRef.current.duration > 0
                  ? audioRef.current.duration
                  : 0
            )}
          </span>
        )}
      </div>
    </div>
  );
});


const handleSendVoice = ({ audioBlob, samples }, setParameterData) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result.split(',')[1];

      if (!base64String) {
        console.error('Failed to convert audio to base64');
        return;
      }

      // Guardar el audio en parameterData
      if (setParameterData) {
        setParameterData(prev => ({
          ...prev,
          audioData: {
            ...prev.audioData,
            audioBlob: audioBlob,
            audioBase64: base64String,
            samples: samples,
            audioUrl: URL.createObjectURL(audioBlob),
            timestamp: new Date().toISOString()
          }
        }));
      }
    };

    reader.onerror = (error) => {
      console.error('Error converting audio to base64:', error);
    };
    reader.readAsDataURL(audioBlob);
  };


const VoiceRecorder = ({
  parameterData,
  setParameterData,
  handleChange,
  editingInput,
  setEditingInput,
}) => {
  const recorderRef = useRef();
  const [t] = useTranslation("Contacts");

  const [hasStoppedRecording, setHasStoppedRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [isComponentReset, setIsComponentReset] = useState(false);
  const [transcribedText, setTranscribedText] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptionError, setTranscriptionError] = useState("");
  const [liveTranscription, setLiveTranscription] = useState("");
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!recorderRef.current) return;
      setHasStoppedRecording(!recorderRef.current.isRecording());
      setIsPlaying(recorderRef.current.isPlaying());
      setIsRecording(recorderRef.current.isRecording());
    }, 200);

    return () => clearInterval(interval);
  }, []);
  const handleModeChange = (mode) => {
    handleChange({name: "mode", newValue: mode})
  }

  // Función para inicializar transcripción en vivo
  const initializeLiveTranscription = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.log('Web Speech API no disponible');
      return null;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'es-ES';
    recognition.maxAlternatives = 1;

    let finalTranscript = '';

    recognition.onresult = (event) => {
      let interimTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript + ' ';
        } else {
          interimTranscript += result[0].transcript;
        }
      }
      
      // Actualizar la transcripción en vivo
      const fullTranscription = finalTranscript + interimTranscript;
      setLiveTranscription(fullTranscription);
    };

    recognition.onerror = (event) => {
      console.log('Error en transcripción en vivo:', event.error);
      if (event.error !== 'no-speech') {
        setTranscriptionError(`Error: ${event.error}`);
      }
    };

    recognition.onend = () => {
      console.log('Transcripción en vivo terminada');
      // Guardar transcripción final
      if (finalTranscript.trim()) {
        setLiveTranscription(finalTranscript.trim());
      }
    };

    return recognition;
  }

  // Función para iniciar transcripción en vivo
  const startLiveTranscription = () => {
    if (recognition) {
      setLiveTranscription("");
      setTranscriptionError("");
      recognition.start();
    }
  }

  // Función para detener transcripción en vivo
  const stopLiveTranscription = () => {
    if (recognition) {
      recognition.stop();
    }
  }

  // Función para "transcribir" (simular procesamiento y mostrar transcripción en vivo)
  const transcribeAudio = async () => {
    if (!recorderRef.current || !recorderRef.current.hasAudio()) {
      setTranscriptionError("No hay audio para transcribir");
      return;
    }
    
    if (!liveTranscription.trim()) {
      setTranscriptionError("No se detectó texto durante la grabación");
      return;
    }
    
    setIsTranscribing(true);
    setTranscriptionError("");
    setTranscribedText("");

    try {
      console.log('Procesando transcripción...');
      
      // Simular tiempo de procesamiento
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Usar la transcripción en vivo que se capturó durante la grabación
      const finalTranscription = liveTranscription.trim();
      
      setTranscribedText(finalTranscription);
      
      // Guardar la transcripción en parameterData
      setParameterData(prev => ({
        ...prev,
        audioData: {
          ...prev.audioData,
          transcription: finalTranscription,
          transcriptionTimestamp: new Date().toISOString()
        }
      }));
      
      setIsTranscribing(false);
      console.log('Transcripción completada:', finalTranscription);
      
    } catch (error) {
      console.error('Error al procesar transcripción:', error);
      setTranscriptionError("Error al procesar la transcripción: " + error.message);
      setIsTranscribing(false);
    }
  }

  // Función para transcripción real del audio grabado (comentada para referencia futura)
  const transcribeAudioWithRealService = async () => {
    /* 
    IMPLEMENTACIÓN REAL - Para usar con un servicio de transcripción:
    
    1. Obtener el audioBlob del grabador:
       const audioBlob = parameterData.audioData?.audioBlob;
       
    2. Convertir a formato requerido (base64, FormData, etc.)
    
    3. Enviar a servicio de transcripción:
    
    // OPCIÓN 1: Google Speech-to-Text
    const response = await fetch('https://speech.googleapis.com/v1/speech:recognize?key=YOUR_API_KEY', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        config: {
          encoding: 'WEBM_OPUS',
          sampleRateHertz: 48000,
          languageCode: 'es-ES',
        },
        audio: { content: base64Audio }
      })
    });
    
    // OPCIÓN 2: Azure Speech Service
    const formData = new FormData();
    formData.append('audio', audioBlob, 'audio.webm');
    const response = await fetch('https://YOUR_REGION.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1', {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': 'YOUR_KEY',
        'Content-Type': 'audio/webm'
      },
      body: audioBlob
    });
    
    // OPCIÓN 3: Assembly AI
    // Primero subir el archivo
    const uploadResponse = await fetch('https://api.assemblyai.com/v2/upload', {
      method: 'POST',
      headers: { 'authorization': 'YOUR_API_KEY' },
      body: audioBlob
    });
    const { upload_url } = await uploadResponse.json();
    
    // Luego transcribir
    const transcriptResponse = await fetch('https://api.assemblyai.com/v2/transcript', {
      method: 'POST',
      headers: {
        'authorization': 'YOUR_API_KEY',
        'content-type': 'application/json'
      },
      body: JSON.stringify({ audio_url: upload_url, language_code: 'es' })
    });
    */
  }
  return (
    <div>
      {/* <LabelParameters
        value={parameterData.voiceRecorder}
        text={"voiceRecorder"}
        editingInput={editingInput}
        setEditingInput={setEditingInput}
      > */}

<BasicAdvancedSelector
   selectedMode={parameterData.mode}
   onModeChange={handleModeChange}
 />


     <div className={styles.voiceRecorderContainer}>
             {!showVoiceRecorder ? (
            <div
            className={styles.voiceRecorderButton}
            onClick={() => {
              setShowVoiceRecorder(true);
              setTranscribedText("");
              setTranscriptionError("");
              setIsTranscribing(false);
              setLiveTranscription("");
              setIsComponentReset(false); // Resetear flag de componente
              
              // Inicializar transcripción en vivo
              const newRecognition = initializeLiveTranscription();
              setRecognition(newRecognition);
              
              // Limpiar datos previos de audio
              setParameterData(prev => ({
                ...prev,
                audioData: {
                  audioBlob: null,
                  audioBase64: null,
                  samples: [],
                  audioUrl: null,
                  transcription: "",
                  timestamp: null,
                  transcriptionTimestamp: null
                }
              }));
            }}><PlayIcon /></div>
        ): (
          <>
          <div
            className={styles.voiceRecorderButton}
          onClick={() => {
            recorderRef.current?.stopRecording();
            stopLiveTranscription(); // Detener transcripción en vivo
          }}
          data-tooltip={t("stop")}
        >
         <PauseIcon style={{fill:"black"}}/>
        </div>
        </>
        )}
        {showVoiceRecorder && (

            <VoiceRecorderWave
          onSend={(data) => handleSendVoice(data, setParameterData)}
          onCancel={() => {}}
          ref={recorderRef}
          setParameterData={setParameterData}
          onStartRecording={() => startLiveTranscription()}
          onStopRecording={() => stopLiveTranscription()}
        />
        )}
        {showVoiceRecorder && (
          <>
            {/* {!hasStoppedRecording && (
              <button
                onClick={() => {
                  recorderRef.current?.stopRecording();
                  stopLiveTranscription(); // Detener transcripción en vivo
                }}
                data-tooltip={t("stop")}
              >
                ⏹️
              </button>
            )} */}

            {/* {hasStoppedRecording &&
              (isPlaying ? (
                <button
                  onClick={() => {
                    recorderRef.current?.handlePause();
                  }}
                  data-tooltip={t("pause")}
                >
                  ⏸️{" "}
                </button>
              ) : (
                <button
                  onClick={() => {
                    recorderRef.current?.handlePlay();
                  }}
                  data-tooltip={t("play")}
                >
                  ▶️{" "}
                </button>
              ))} */}

            <div
              onClick={() => {
                // Reiniciar completamente el componente
                recorderRef.current?.handleCancel();
                
                // Resetear todos los estados
                setTranscribedText("");
                setTranscriptionError("");
                setIsTranscribing(false);
                setLiveTranscription("");
                setHasStoppedRecording(false);
                setIsPlaying(false);
                setIsRecording(false);
                setIsComponentReset(true);
                setShowVoiceRecorder(false); // Ocultar el grabador para reiniciar
                
                // Detener transcripción en vivo si está activa
                if (recognition) {
                  recognition.stop();
                  setRecognition(null);
                }
                
                // Limpiar datos de audio de parameterData
                setParameterData(prev => ({
                  ...prev,
                  audioData: {
                    audioBlob: null,
                    audioBase64: null,
                    samples: [],
                    audioUrl: null,
                    transcription: "",
                    timestamp: null,
                    transcriptionTimestamp: null
                  }
                }));
              }}
              data-tooltip={t("delete")}
            >
              <TrashIcon style={{fill:"black",height: "20px",width: "20px",cursor: "pointer"}}/>
            </div>

          
          </>
        )}

        {hasStoppedRecording && !isComponentReset && (            
            <Button
            type="white"
            headerStyle={{ borderRadius: "999px" }}
            action={transcribeAudio}
            disabled={isTranscribing}
        >
          {isTranscribing ? t("transcribing") : t("transcribe")}
        </Button>
        )}

        {/* Mostrar el texto transcrito */}
        {transcribedText && (
          <p style={{ marginTop: "10px", fontSize: "14px", color: "#333" }}>
            {transcribedText}
          </p>
        )}

        {/* Mostrar errores de transcripción */}
        {transcriptionError && (
          <p style={{ 
            marginTop: "10px", 
            fontSize: "12px", 
            color: "#d63031",
            margin: "10px 0 0 0"
          }}>
            {transcriptionError}
          </p>
        )}

        {/* Mostrar datos guardados en parameterData */}
        {/* {parameterData.audioData && (parameterData.audioData.audioBase64 || parameterData.audioData.transcription) && (
          <div style={{ 
            marginTop: "15px", 
            padding: "12px", 
            backgroundColor: "#e8f5e8", 
            borderRadius: "8px",
            border: "1px solid #4caf50"
          }}>
            <h4 style={{ margin: "0 0 8px 0", fontSize: "14px", fontWeight: "bold", color: "#2e7d32" }}>
              Datos guardados:
            </h4>
            {parameterData.audioData.audioBase64 && (
              <p style={{ margin: "0 0 4px 0", fontSize: "12px", color: "#4caf50" }}>
                ✅ Audio guardado ({parameterData.audioData.timestamp && new Date(parameterData.audioData.timestamp).toLocaleTimeString()})
              </p>
            )}
            {parameterData.audioData.transcription && (
              <p style={{ margin: "0", fontSize: "12px", color: "#4caf50" }}>
                ✅ Transcripción guardada: "{parameterData.audioData.transcription}"
              </p>
            )}
          </div>
        )} */}
     </div>
     {parameterData.mode !== "basic" && (
      <div className={`${styles.advancedModeTextbox} ${styles.maxMBFilesContainer}`}>
      <div>
           <p>{t("allowedSize")}</p>
           <div>
                    <Button 
                type="white" 
                action={() => handleValueChange('maxMBAudio', 'decrement')}
              >
                -
              </Button>
              <input
                type="number"
                name="maxMBAudio"
                value={parameterData.maxMBAudio || 100000}
                onChange={handleChange}
              />MB
              <Button 
                type="white" 
                action={() => handleValueChange('maxMBAudio', 'increment')}
              >
                +
              </Button>
           </div>
         </div>
   </div>
     )}
      {/* </LabelParameters> */}
    </div>
  );
};

export default VoiceRecorder;
