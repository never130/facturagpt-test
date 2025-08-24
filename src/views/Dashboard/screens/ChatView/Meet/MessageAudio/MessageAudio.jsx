import React, { useState, useEffect, useRef } from 'react';
import styles from './MessageAudio.module.css';
import { safeText } from '../utils';

import { ReactComponent as IconWaves } from './assets/icon-waves.svg';

import { formatAgoDate } from "../../../../../../utils/agoDateUtil";

import { useTranslation } from 'react-i18next';

const MessageAudio = ({ message }) => {

    const { t } = useTranslation();

    const [isOpen, setIsOpen] = useState(false);

    const handleTranscribe = () => {
        setIsOpen(!isOpen);
    }

    return (
        <div className={styles.isAudio}>
            <div className={styles.iconWaves}>
                <IconWaves />
            </div>

            <VoiceMessageBubble
                audioBlob={message.text?.audio}
                samples={message.text?.samples}
            />
            <div className={styles.controls}>
                <p>
                    {/* {message.text?.timestamp} */}
                    {formatAgoDate({ dateString: message.text?.timestamp, t })}
                </p>
                <button onClick={handleTranscribe}>
                    Transcribir
                </button>
            </div>
            <div
                className={styles.text}
                style={{
                    display: isOpen ? 'block' : 'none'
                }}
            >
                <p>
                    {message.text?.text}
                </p>
            </div>
        </div>
    )
}

export default MessageAudio;



export const VoiceMessageBubble = ({ audioBlob, samples }) => {

    const [playing, setPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [hoverBar, setHoverBar] = useState(null);
    const [audioUrl, setAudioUrl] = useState(null);
    const [waveSamples, setWaveSamples] = useState([]);
    const audioRef = useRef(null);
    const pendingSeekTimeRef = useRef(null); // absolute seconds; deprecated in favor of fraction
    const pendingSeekFractionRef = useRef(null); // 0..1 fraction of duration
    const pendingAutoplayRef = useRef(false);

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
            if (isFinite(audio.duration) && audio.duration > 0) {
                setDuration(audio.duration);
            } else {
                const fixDuration = () => {
                    if (isFinite(audio.duration) && audio.duration > 0) {
                        setDuration(audio.duration);
                        audio.removeEventListener('timeupdate', fixDuration);
                        try { audio.currentTime = 0; } catch (_) {}
                        // Si había un seek pendiente en fraction, aplicarlo ahora
                        if (pendingSeekFractionRef.current != null) {
                            const t = Math.max(0, Math.min(1, pendingSeekFractionRef.current)) * audio.duration;
                            try {
                                audio.currentTime = t;
                                setCurrentTime(t);
                                if (pendingAutoplayRef.current) {
                                    audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
                                }
                            } catch (_) {}
                            pendingSeekFractionRef.current = null;
                            pendingSeekTimeRef.current = null;
                            pendingAutoplayRef.current = false;
                        }
                    }
                };
                audio.addEventListener('timeupdate', fixDuration);
                try { audio.currentTime = 1e101; } catch (_) {}
            }
            if (pendingSeekFractionRef.current != null && isFinite(audio.duration) && audio.duration > 0) {
                const t = Math.max(0, Math.min(1, pendingSeekFractionRef.current)) * audio.duration;
                try {
                    audio.currentTime = t;
                    setCurrentTime(t);
                    if (pendingAutoplayRef.current) {
                        audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
                    }
                } catch (_) {}
                pendingSeekFractionRef.current = null;
                pendingSeekTimeRef.current = null;
                pendingAutoplayRef.current = false;
            }
        };
        const onLoadedData = () => {
            if (isFinite(audio.duration) && audio.duration > 0) {
                setDuration(audio.duration);
            }
        };
        const onSeeked = () => {
            setCurrentTime(audio.currentTime);
        };
        const onPlay = () => setPlaying(true);
        const onPause = () => setPlaying(false);
        audio.addEventListener("ended", onEnded);
        audio.addEventListener("timeupdate", onTimeUpdate);
        audio.addEventListener("loadedmetadata", onLoadedMetadata);
        audio.addEventListener("loadeddata", onLoadedData);
        audio.addEventListener("seeked", onSeeked);
        audio.addEventListener("play", onPlay);
        audio.addEventListener("pause", onPause);
        return () => {
            audio.removeEventListener("ended", onEnded);
            audio.removeEventListener("timeupdate", onTimeUpdate);
            audio.removeEventListener("loadedmetadata", onLoadedMetadata);
            audio.removeEventListener("loadeddata", onLoadedData);
            audio.removeEventListener("seeked", onSeeked);
            audio.removeEventListener("play", onPlay);
            audio.removeEventListener("pause", onPause);
        };
    }, [audioBlob]);


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


    const createBlobFromBase64 = (base64String) => {
        try {

            if (!base64String || typeof base64String !== 'string') {
                console.error('Invalid base64 string:', base64String);
                return null;
            }

            const mimeMatch = base64String.match(/^data:([^;]+);base64,/);
            const mimeType = mimeMatch ? mimeMatch[1] : 'audio/webm';
            const cleanBase64 = base64String.replace(/^data:[^;]+;base64,/, '');


            if (!/^[A-Za-z0-9+/]*={0,2}$/.test(cleanBase64)) {
                console.error('Invalid base64 format');
                return null;
            }


            const byteCharacters = atob(cleanBase64);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);


            return new Blob([byteArray], { type: mimeType });
        } catch (error) {
            console.error('Error converting base64 to Blob:', error);
            return null;
        }
    };

    useEffect(() => {
        if (!audioBlob) return;

        const blob = createBlobFromBase64(audioBlob);
        if (!blob) return;

        const url = URL.createObjectURL(blob);
        setAudioUrl(url);

        let canceled = false;

        const generateSamplesIfNeeded = async () => {
            if (samples && Array.isArray(samples) && samples.length > 0) return;
            try {
                const arrayBuffer = await blob.arrayBuffer();
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                if (!AudioCtx) return;
                const audioCtx = new AudioCtx();
                const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

                const channelData = audioBuffer.getChannelData(0);
                const windowSize = Math.max(1, Math.floor(audioBuffer.sampleRate * 0.25)); // ~250ms
                const numWindows = Math.ceil(channelData.length / windowSize);
                const out = [];
                for (let i = 0; i < numWindows; i++) {
                    const start = i * windowSize;
                    const end = Math.min((i + 1) * windowSize, channelData.length);
                    let peak = 0;
                    for (let j = start; j < end; j++) {
                        const v = Math.abs(channelData[j]);
                        if (v > peak) peak = v;
                    }
                    out.push(Math.min(1, peak));
                }
                if (!canceled) setWaveSamples(out);
                try { await audioCtx.close(); } catch (_) {}
            } catch (e) {
                console.error('No se pudieron generar samples del audio', e);
            }
        };

        generateSamplesIfNeeded();

        return () => {
            canceled = true;
            URL.revokeObjectURL(url);
        };
    }, [audioBlob, samples]);

    useEffect(() => {
        if (!audioRef.current || !audioUrl) return;
        // Ensure the audio element reloads the new source and metadata
        try {
            audioRef.current.pause();
            audioRef.current.load();
            setCurrentTime(0);
            setDuration(0);
        } catch (_) {}
    }, [audioUrl]);

    if (!audioBlob) {
        return (
            <div style={{ padding: 16, color: '#888', fontStyle: 'italic', background: '#f8f8f8', borderRadius: 8, margin: '12px 0' }}>
                No hay audio para reproducir.
            </div>
        );
    }

    if (!audioUrl) {
        return (
            <div style={{ padding: 16, color: '#888', fontStyle: 'italic', background: '#f8f8f8', borderRadius: 8, margin: '12px 0' }}>
                Procesando audio...
            </div>
        );
    }




    const handlePlay = async () => {
        try {
            if (audioRef.current.currentTime >= duration) {
                audioRef.current.currentTime = 0;
            }
            await audioRef.current.play();
            setPlaying(true);
        } catch (_) {
            setPlaying(false);
        }
    };
    const handlePause = () => {
        setPlaying(false);
        audioRef.current.pause();
    };


    const formatTime = (s) => {
        const m = Math.floor(s / 60);
        const sec = Math.floor(s % 60);
        return `${m.toString().padStart(1, '0')}:${sec.toString().padStart(2, '0')}`;
    };


    const bars = (samples && Array.isArray(samples) && samples.length > 0) ? samples : waveSamples;

    let currentBar = 0;
    if (duration > 0 && bars.length > 0) {
        currentBar = Math.floor((currentTime / duration) * bars.length);
        if (currentBar < 0) currentBar = 0;
        if (currentBar > bars.length - 1) currentBar = bars.length - 1;
    }


    const handleBarClick = async (i) => {
        if (!audioRef.current || !bars.length) return;
        const fraction = i / bars.length;
        const baseDuration = isFinite(audioRef.current.duration) && audioRef.current.duration > 0
            ? audioRef.current.duration
            : (duration || 0);
        const newTime = baseDuration > 0 ? fraction * baseDuration : null;
        try {
            if (newTime != null) {
                audioRef.current.currentTime = newTime;
                setCurrentTime(newTime);
                await audioRef.current.play();
                setPlaying(true);
            } else {
                // Metadata aún no cargada: guardar fraction y autoplay pendientes
                pendingSeekFractionRef.current = fraction;
                pendingAutoplayRef.current = true;
                // Fuerza carga por si aún no ha cargado
                try { audioRef.current.load(); } catch (_) {}
            }
        } catch (_) {
            setPlaying(false);
        }
    };

    return (
        <div className={styles.voiceMessageBubble} >
            <div className={styles.voiceMessageBubbleTime}>

                {playing ? (
                    <button
                        onClick={handlePause}
                        title="Pausar"
                        className={styles.voiceMessageBubbleButton}
                    >
                        ⏸️
                    </button>
                ) : (
                    <button
                        onClick={handlePlay}
                        title="Reproducir"
                        className={styles.voiceMessageBubbleButton}
                    >
                        ▶️
                    </button>
                )}
                <span>
                    {formatTime(currentTime)} / {formatTime(duration)}
                </span>
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", height: 32, gap: 2, cursor: 'pointer', userSelect: 'none' }}>
                {bars.length === 0 ? (
                    <span style={{ color: '#888', fontStyle: 'italic' }}>Generando forma de onda...</span>
                ) : bars.map((amp, i) => {
                    let color = "#bbb";
                    if (i <= currentBar) color = "var(--_16c098-background)";
                    if (hoverBar === i) color = "var(--f5_secondary)";
                    return (
                        <div
                            key={i}
                            style={{
                                width: 4,
                                height: Math.max(amp * 32, 4),
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

            <audio ref={audioRef} src={audioUrl || undefined} preload="metadata" style={{ display: "none" }} />
        </div>
    );
};
