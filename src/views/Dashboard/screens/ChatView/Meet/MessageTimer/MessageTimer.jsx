import React, { useState } from 'react';
import styles from './MessageTimer.module.css';
import svgPaths from './imports/svg-bt0sxe1y3v.ts';

// Componente para el icono del header
const HeaderIcon = () => (
  <div className={styles.headerIconFrame}>
    <svg
      className={styles.headerIconSvg}
      fill="none"
      preserveAspectRatio="none"
      viewBox="0 0 18 18"
    >
      <g id="Frame">
        <path
          d={svgPaths.p8295a80}
          id="Vector"
          stroke="var(--stroke-0, white)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.45833"
        />
        <path
          d={svgPaths.p3924400}
          id="Vector_2"
          stroke="var(--stroke-0, white)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.45833"
        />
      </g>
    </svg>
  </div>
);

// Componente para el icono de reset
const ResetIcon = () => (
  <div className={styles.controlButtonIcon}>
    <svg
      className={styles.headerIconSvg}
      fill="none"
      preserveAspectRatio="none"
      viewBox="0 0 32 32"
    >
      <g id="Frame">
        <path
          d={svgPaths.p107e0000}
          id="Vector"
          stroke="var(--stroke-0, #496961)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="4"
        />
        <path
          d="M4 4V10.6667H10.6667"
          id="Vector_2"
          stroke="var(--stroke-0, #496961)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3"
        />
      </g>
    </svg>
  </div>
);

// Componente para el icono de play
const PlayIcon = () => (
  <div className={styles.playIcon}>
    <div className={styles.playIconInner}>
      <svg
        className={styles.playIconSvg}
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 27"
      >
        <g id="Icon-Set-Filled">
          <path
            clipRule="evenodd"
            d={svgPaths.p104a8780}
            fill="var(--fill-0, white)"
            fillRule="evenodd"
            id="play"
          />
        </g>
      </svg>
    </div>
  </div>
);

// Componente para el icono de pause
const PauseIcon = () => (
  <div className={styles.pauseIcon}>
    <svg
      className={styles.pauseIconSvg}
      fill="none"
      preserveAspectRatio="none"
      viewBox="0 0 33 34"
    >
      <g id="pause-svgrepo-com 1">
        <path
          d={svgPaths.p18e2df00}
          fill="var(--fill-0, white)"
          id="Vector"
        />
      </g>
    </svg>
  </div>
);

// Componente para el icono de save
const SaveIcon = () => (
  <div className={styles.saveButtonIcon}>
    <div className={styles.saveButtonIconInner}>
      <svg
        className={styles.headerIconSvg}
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 14 14"
      >
        <g id="Frame">
          <path
            d={svgPaths.p36996000}
            id="Vector"
            stroke="var(--stroke-0, white)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.16667"
          />
          <path
            d={svgPaths.p4e8b6c0}
            id="Vector_2"
            stroke="var(--stroke-0, white)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.16667"
          />
          <path
            d={svgPaths.p3c03000}
            id="Vector_3"
            stroke="var(--stroke-0, white)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.16667"
          />
        </g>
      </svg>
    </div>
  </div>
);

// Componente para el icono de stop
const StopIcon = () => (
  <div className={styles.controlButtonIconSmall}>
    <svg
      className={styles.headerIconSvg}
      fill="none"
      preserveAspectRatio="none"
      viewBox="0 0 36 36"
    >
      <g id="Frame">
        <path
          d={svgPaths.p3bf93200}
          id="Vector"
          stroke="var(--stroke-0, #10A37F)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="4"
        />
      </g>
    </svg>
  </div>
);

// Componente para el icono de play pequeño
const PlaySmallIcon = () => (
  <div className={styles.recentTimerPlay}>
    <svg
      className={styles.recentTimerPlaySvg}
      fill="none"
      preserveAspectRatio="none"
      viewBox="0 0 20 20"
    >
      <g clipPath="url(#clip0_2_1571)" id="Frame">
        <path
          d={svgPaths.p3eabfa80}
          fill="var(--fill-0, #10A37F)"
          id="Vector"
        />
        <path
          clipRule="evenodd"
          d={svgPaths.p3469a300}
          fill="var(--fill-0, white)"
          fillRule="evenodd"
          id="Vector_2"
        />
      </g>
      <defs>
        <clipPath id="clip0_2_1571">
          <rect fill="white" height="20" width="20" />
        </clipPath>
      </defs>
    </svg>
  </div>
);

// Componente del cronómetro
const StopwatchInterface = () => {
  const activities = [
    { emoji: '🏃', text: 'Correr' },
    { emoji: '🏊‍♀️', text: 'Nadar' },
    { emoji: '🚴', text: 'Ciclismo' },
    { emoji: '📚', text: 'Estudio' }
  ];

  const recentTimes = [
    { activity: '🏃 Correr', laps: '5 Vueltas', time: '12:34.56' },
    { activity: '🏃 Correr', laps: '5 Vueltas', time: '12:34.56' },
    { activity: '🏃 Correr', laps: '5 Vueltas', time: '12:34.56' }
  ];

  return (
    <div className={styles.leftPanel}>
      <div className={styles.leftPanelInner}>
        <div className={styles.header}>
          <div className={styles.headerIcon}>
            <HeaderIcon />
          </div>
          <div className={styles.headerTitle}>
            <p className={styles.headerTitleText}>Cronómetro</p>
          </div>
        </div>

        <div className={styles.timerContainer} style={{ width: '622px' }}>
          <div className={styles.mainTimerSection}>
            <div className={styles.timerDisplay}>
              <div className={styles.circularTimer}>
                <div className={styles.circularTimerBorder} />
                <div className={styles.circularTimerGradient}>
                  <div className={styles.circularTimerGradientBorder} />
                  <div className={styles.circularTimerInner}>
                    <div className={styles.timerText}>
                      <div className={styles.timerMainText}>
                        <p className={styles.timerMainTextSpan}>00:00.00</p>
                      </div>
                      <div className={styles.timerSubText}>
                        <p className={styles.timerSubTextSpan}>Correr</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.controlButtons}>
              <div className={styles.controlButton}>
                <ResetIcon />
              </div>
              <div className={`${styles.controlButton} ${styles.controlButtonPrimary}`}>
                <PlayIcon />
              </div>
            </div>
          </div>

          <div className={styles.activitiesSection}>
            <div className={styles.activitiesTitle}>
              <p>Actividad</p>
            </div>
            <div className={styles.activitiesGrid}>
              {activities.map((activity, index) => (
                <div key={index} className={styles.activityButton}>
                  <div className={styles.activityButtonBorder} />
                  <div className={styles.activityButtonContent} style={{ 
                    position: 'absolute',
                    left: index < 2 ? '36.59px' : 'calc(50% - 38px)',
                    top: '11.5px'
                  }}>
                    <div className={styles.activityEmoji}>
                      <p className={styles.activityEmojiText}>{activity.emoji}</p>
                    </div>
                    <div className={styles.activityText}>
                      <p className={styles.activityTextSpan}>{activity.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.recentTimesSection}>
              <div className={styles.recentTimesTitle}>
                <div className={styles.recentTimesTitleText}>
                  <p className={styles.recentTimesTitleTextSpan}>Tiempos recientes (</p>
                </div>
                <div className={styles.recentTimesTitleText}>
                  <p className={styles.recentTimesTitleTextSpan}>5</p>
                </div>
                <div className={styles.recentTimesTitleText}>
                  <p className={styles.recentTimesTitleTextSpan}>)</p>
                </div>
              </div>
              
              {recentTimes.map((time, index) => (
                <div key={index} className={styles.recentTimeItem}>
                  <div className={styles.recentTimeItemBorder} />
                  <div className={styles.recentTimeInfo}>
                    <div className={styles.recentTimeActivity}>
                      <div className={styles.recentTimeActivityInfo}>
                        <div className={styles.recentTimeActivityEmoji}>
                          <p className={styles.recentTimesTitleTextSpan}>🏃</p>
                        </div>
                        <div className={styles.recentTimeActivityText}>
                          <p className={styles.recentTimesTitleTextSpan}>Correr</p>
                        </div>
                      </div>
                      <div className={styles.recentTimeLaps}>
                        <div className={styles.recentTimeLapsText}>
                          <p className={styles.recentTimesTitleTextSpan}>5</p>
                        </div>
                        <div className={styles.recentTimeLapsText}>
                          <p className={styles.recentTimesTitleTextSpan}> Vueltas</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.recentTimeValue}>
                    <p className={styles.recentTimesTitleTextSpan}>12:34.56</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente del cronómetro en ejecución
const RunningStopwatchInterface = () => {
  const laps = [
    { number: 5, time: '00:01.36', totalTime: '00:19', highlight: false },
    { number: 4, time: '00:01.01', totalTime: '00:18', highlight: 'best' },
    { number: 3, time: '00:02.50', totalTime: '00:17', highlight: false },
    { number: 2, time: '00:01.13', totalTime: '00:15', highlight: false },
    { number: 1, time: '00:13.99', totalTime: '00:13', highlight: 'worst' }
  ];

  return (
    <div className={styles.rightPanel}>
      <div className={styles.rightPanelInner}>
        <div className={styles.rightPanelContent}>
          <div className={styles.headerWithSave}>
            <div className={styles.headerLeft}>
              <div className={styles.headerIcon}>
                <HeaderIcon />
              </div>
              <div className={styles.headerTitle}>
                <p className={styles.headerTitleText}>Cronómetro</p>
              </div>
            </div>
            <div className={styles.headerRight}>
              <div className={styles.saveButton}>
                <SaveIcon />
                <div className={styles.saveButtonText}>
                  <p className={styles.saveButtonTextSpan}>Guardar variable</p>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'row', gap: '30px', alignItems: 'flex-start', justifyContent: 'flex-start', padding: '28px 0', position: 'relative', flexShrink: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', alignItems: 'center', justifyContent: 'center', padding: '0', position: 'relative', flexShrink: 0 }}>
              <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'center', justifyContent: 'center', padding: '0', position: 'relative', flexShrink: 0 }}>
                <div className={styles.circularTimer}>
                  <div className={styles.circularTimerBorder} />
                  <div className={styles.circularTimerGradient}>
                    <div className={styles.circularTimerGradientBorder} />
                    <div className={styles.circularTimerInner}>
                      <div className={styles.timerText}>
                        <div className={styles.timerMainText}>
                          <p className={styles.timerMainTextSpan}>00:52.64</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.controlButtons}>
                <div className={styles.controlButton}>
                  <ResetIcon />
                </div>
                <div className={styles.controlButton}>
                  <StopIcon />
                </div>
                <div className={`${styles.controlButton} ${styles.controlButtonDisabled}`}>
                  <PauseIcon />
                </div>
              </div>
            </div>

            <div className={styles.lapsSection}>
              <div className={styles.lapsTitle}>
                <div className={styles.lapsTitleText}>
                  <p className={styles.recentTimesTitleTextSpan}>Vueltas (</p>
                </div>
                <div className={styles.lapsTitleCount}>
                  <p className={styles.recentTimesTitleTextSpan}>5</p>
                </div>
                <div className={styles.lapsTitleClose}>
                  <p className={styles.recentTimesTitleTextSpan}>)</p>
                </div>
              </div>

              <div className={styles.lapsList}>
                {laps.map((lap, index) => (
                  <div key={index} className={styles.lapItem}>
                    <div className={`${styles.lapItemBorder} ${
                      lap.highlight === 'best' ? styles.lapItemBorderGreen :
                      lap.highlight === 'worst' ? styles.lapItemBorderRed : ''
                    }`} />
                    <div className={styles.lapItemInfo}>
                      <div className={`${styles.lapNumber} ${
                        lap.highlight === 'best' ? styles.lapNumberGreen :
                        lap.highlight === 'worst' ? styles.lapNumberRed : ''
                      }`}>
                        <div className={styles.lapNumberText}>
                          <p className={styles.lapNumberTextSpan}>Vuelta {lap.number}</p>
                        </div>
                        {lap.highlight && (
                          <div className={styles.lapIcon} style={{ left: '83%', color: lap.highlight === 'best' ? '#016630' : '#9f0712' }}>
                            <p className={styles.lapIconText}>{lap.highlight === 'best' ? '🏆' : '🐌'}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className={styles.lapTime} style={{ width: '96.969px' }}>
                      <div className={`${styles.lapTimeMain} ${
                        lap.highlight === 'best' ? styles.lapTimeMainGreen :
                        lap.highlight === 'worst' ? styles.lapTimeMainRed : ''
                      }`} style={{ right: '51.53%' }}>
                        <p className={styles.lapTimeMainText}>{lap.time}</p>
                      </div>
                      <div className={styles.lapTimeSub} style={{ left: '69.02%', right: '2.1%' }}>
                        <p className={styles.lapTimeSubText}>{lap.totalTime}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente del temporizador
const TimerInterface = () => {
  const quickTags = [
    { emoji: '💼', text: 'Trabajo' },
    { emoji: '☕', text: 'Descanso' },
    { emoji: '💪', text: 'Ejercicio' },
    { emoji: '👨‍🍳', text: 'Cocinar' }
  ];

  const recentTimers = [
    { time: '5:00', emoji: '☕', text: 'Café' },
    { time: '25:00', emoji: '🍅', text: 'Pomodoro' },
    { time: '10:00', emoji: '🧘‍♀️', text: 'Descanso' }
  ];

  return (
    <div className={styles.rightPanel}>
      <div className={styles.rightPanelInner} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className={styles.rightPanelContent}>
          <div className={styles.header}>
            <div className={styles.headerIcon}>
              <HeaderIcon />
            </div>
            <div className={styles.headerTitle}>
              <p className={styles.headerTitleText}>Temporizador</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'row', gap: '30px', alignItems: 'flex-start', justifyContent: 'flex-start', padding: '0', position: 'relative', flexShrink: 0, width: '588px' }}>
            <div style={{ flexBasis: '0', display: 'flex', flexDirection: 'column', gap: '30px', flexGrow: 1, alignItems: 'flex-start', justifyContent: 'flex-start', minHeight: '1px', minWidth: '1px', padding: '0', position: 'relative', flexShrink: 0 }}>
              <div className={styles.timeSelectors}>
                <div className={`${styles.timeSelectorColumn} ${styles.timeSelectorColumnLeft}`}>
                  <div className={`${styles.timeSelectorLabel} ${styles.timeSelectorLabelHours}`}>
                    <p className={styles.timeSelectorLabelSpan}>Horas</p>
                  </div>
                  <div className={styles.timeSelector}>
                    <div className={styles.timeSelectorInner}>
                      <div className={styles.timeSelectorInnerContent}>
                        <div className={styles.timeSelectorValue}>
                          <p className={styles.timeSelectorValueText}>00</p>
                        </div>
                      </div>
                      <div className={styles.timeSelectorBorder} />
                    </div>
                    <div className={`${styles.timeSelectorUnit} ${styles.timeSelectorUnitHours}`}>
                      <p className={styles.timeSelectorUnitText}>h</p>
                    </div>
                  </div>
                </div>

                <div className={`${styles.timeSelectorColumn} ${styles.timeSelectorColumnCenter}`}>
                  <div className={`${styles.timeSelectorLabel} ${styles.timeSelectorLabelMinutes}`}>
                    <p className={styles.timeSelectorLabelSpan}>Minutos</p>
                  </div>
                  <div className={styles.timeSelector}>
                    <div className={styles.timeSelectorInner}>
                      <div className={styles.timeSelectorInnerContent}>
                        <div className={styles.timeSelectorValue}>
                          <p className={styles.timeSelectorValueText}>05</p>
                        </div>
                      </div>
                      <div className={styles.timeSelectorBorder} />
                    </div>
                    <div className={`${styles.timeSelectorUnit} ${styles.timeSelectorUnitMinutes}`}>
                      <p className={styles.timeSelectorUnitText}>min</p>
                    </div>
                  </div>
                </div>

                <div className={`${styles.timeSelectorColumn} ${styles.timeSelectorColumnRight}`}>
                  <div className={`${styles.timeSelectorLabel} ${styles.timeSelectorLabelSeconds}`}>
                    <p className={styles.timeSelectorLabelSpan}>Segundos</p>
                  </div>
                  <div className={styles.timeSelector}>
                    <div className={styles.timeSelectorInner}>
                      <div className={styles.timeSelectorInnerContent}>
                        <div className={styles.timeSelectorValue}>
                          <p className={styles.timeSelectorValueText}>00</p>
                        </div>
                      </div>
                      <div className={styles.timeSelectorBorder} />
                    </div>
                    <div className={`${styles.timeSelectorUnit} ${styles.timeSelectorUnitSeconds}`}>
                      <p className={styles.timeSelectorUnitText}>seg</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.controlButtons}>
                <div className={styles.controlButton}>
                  <ResetIcon />
                </div>
                <div className={`${styles.controlButton} ${styles.controlButtonPrimary}`}>
                  <PlayIcon />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', alignItems: 'flex-start', justifyContent: 'flex-start', padding: '0', position: 'relative', flexShrink: 0 }}>
              <div className={styles.quickTagsSection}>
                <div className={styles.quickTagsTitle}>
                  <p className={styles.quickTagsTitleText}>Etiquetas rápidas</p>
                </div>
                <div className={styles.quickTagsGrid}>
                  {quickTags.map((tag, index) => (
                    <div key={index} className={styles.quickTagButton}>
                      <div className={styles.quickTagButtonBorder} />
                      <div className={`${styles.quickTagButtonContent} ${styles.quickTagButtonEmoji}`}>
                        <p className={styles.quickTagsTitleText}>{tag.emoji}</p>
                      </div>
                      <div className={styles.quickTagButtonText}>
                        <p className={styles.quickTagButtonTextSpan}>{tag.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.recentTimersSection}>
                <div className={styles.recentTimersTitle}>
                  <p className={styles.recentTimersTitleText}>Temporizadores recientes</p>
                </div>
                <div className={styles.recentTimersList}>
                  {recentTimers.map((timer, index) => (
                    <div key={index} className={styles.recentTimerItem}>
                      <div className={styles.recentTimerItemBorder} />
                      <div className={styles.recentTimerItemInfo} style={{ width: index === 0 ? '94.813px' : index === 1 ? '138.453px' : '135.805px' }}>
                        <div className={styles.recentTimerItemTime} style={{ right: index === 0 ? '60.98%' : '65.33%' }}>
                          <p className={styles.recentTimerItemTimeText}>{timer.time}</p>
                        </div>
                        <div className={styles.recentTimerItemActivity} style={{ 
                          left: index === 0 ? '49.16%' : index === 1 ? '41.24%' : '42.05%',
                          right: '0'
                        }}>
                          <div className={styles.recentTimerItemActivityEmoji} style={{ 
                            right: index === 0 ? '70.96%' : '82.79%'
                          }}>
                            <p className={styles.recentTimerItemActivityEmojiText}>{timer.emoji}</p>
                          </div>
                          <div className={styles.recentTimerItemActivityText} style={{
                            left: index === 0 ? '43.57%' : index === 1 ? '25.81%' : '26.68%',
                            right: index === 0 ? '-1.65%' : '0.43%'
                          }}>
                            <p className={styles.recentTimerItemActivityTextSpan}>{timer.text}</p>
                          </div>
                        </div>
                      </div>
                      <PlaySmallIcon />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente del temporizador en ejecución
const RunningTimerInterface = () => {
  const recentTimers = [
    { time: '5:00', emoji: '☕', text: 'Café' },
    { time: '25:00', emoji: '🍅', text: 'Pomodoro' },
    { time: '10:00', emoji: '🧘‍♀️', text: 'Descanso' }
  ];

  return (
    <div className={styles.rightPanel}>
      <div className={styles.rightPanelInner} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className={styles.rightPanelContent}>
          <div className={styles.headerWithSave}>
            <div className={styles.headerLeft}>
              <div className={styles.headerIcon}>
                <HeaderIcon />
              </div>
              <div className={styles.headerTitle}>
                <p className={styles.headerTitleText}>Temporizador</p>
              </div>
            </div>
            <div className={styles.headerRight}>
              <div className={styles.saveButton}>
                <SaveIcon />
                <div className={styles.saveButtonText}>
                  <p className={styles.saveButtonTextSpan}>Guardar variable</p>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'row', gap: '30px', alignItems: 'flex-start', justifyContent: 'flex-start', padding: '0', position: 'relative', flexShrink: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', alignItems: 'center', justifyContent: 'center', paddingBottom: '32px', padding: '0', position: 'relative', flexShrink: 0, width: '279px' }}>
              <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'center', justifyContent: 'center', padding: '13px 79px', position: 'relative', flexShrink: 0 }}>
                <div className={styles.progressCircle}>
                  <div className={styles.progressCirclePath}>
                    <svg
                      className={styles.progressCirclePathSvg}
                      fill="none"
                      preserveAspectRatio="none"
                      viewBox="0 0 160 160"
                    >
                      <g id="progress-circle-path">
                        <mask fill="white" id="path-1-inside-1_2_1569">
                          <path d={svgPaths.p1bc04e00} />
                        </mask>
                        <path
                          d={svgPaths.p1bc04e00}
                          mask="url(#path-1-inside-1_2_1569)"
                          stroke="var(--stroke-0, #F5F5F5)"
                          strokeWidth="12"
                        />
                      </g>
                    </svg>
                  </div>
                  <div className={styles.progressCircleCenter}>
                    <div className={styles.progressCircleCenterText}>
                      <p className={styles.timerMainTextSpan}>00:52.64</p>
                    </div>
                  </div>
                  <div className={styles.progressCircleTrail}>
                    <div className={styles.progressCircleTrailInner}>
                      <svg
                        className={styles.progressCircleTrailSvg}
                        fill="none"
                        preserveAspectRatio="none"
                        viewBox="0 0 160 160"
                      >
                        <path
                          d={svgPaths.p22b25600}
                          fill="var(--fill-0, #10A37F)"
                          id="progress-circle-trail"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.controlButtons}>
                <div className={styles.controlButton}>
                  <ResetIcon />
                </div>
                <div className={`${styles.controlButton} ${styles.controlButtonDisabled}`}>
                  <PauseIcon />
                </div>
              </div>
            </div>

            <div className={styles.recentTimersSection}>
              <div className={styles.recentTimersTitle}>
                <p className={styles.recentTimersTitleText}>Temporizadores recientes</p>
              </div>
              <div className={styles.recentTimersList}>
                {recentTimers.map((timer, index) => (
                  <div key={index} className={styles.recentTimerItem}>
                    <div className={styles.recentTimerItemBorder} />
                    <div className={styles.recentTimerItemInfo} style={{ width: index === 0 ? '94.813px' : index === 1 ? '138.453px' : '135.805px' }}>
                      <div className={styles.recentTimerItemTime} style={{ right: index === 0 ? '60.98%' : '65.33%' }}>
                        <p className={styles.recentTimerItemTimeText}>{timer.time}</p>
                      </div>
                      <div className={styles.recentTimerItemActivity} style={{ 
                        left: index === 0 ? '49.16%' : index === 1 ? '41.24%' : '42.05%',
                        right: '0'
                      }}>
                        <div className={styles.recentTimerItemActivityEmoji} style={{ 
                          right: index === 0 ? '70.96%' : '82.79%'
                        }}>
                          <p className={styles.recentTimerItemActivityEmojiText}>{timer.emoji}</p>
                        </div>
                        <div className={styles.recentTimerItemActivityText} style={{
                          left: index === 0 ? '43.57%' : index === 1 ? '25.81%' : '26.68%',
                          right: index === 0 ? '-1.65%' : '0.43%'
                        }}>
                          <p className={styles.recentTimerItemActivityTextSpan}>{timer.text}</p>
                        </div>
                      </div>
                    </div>
                    <PlaySmallIcon />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente principal
const TimerInterfaceMain = () => {
//   const [currentView, setCurrentView] = useState<'stopwatch' | 'running-stopwatch' | 'timer' | 'running-timer'>('stopwatch');
  const [currentView, setCurrentView] = useState('stopwatch');

  const renderCurrentView = () => {
    switch (currentView) {
      case 'stopwatch':
        return <StopwatchInterface />;
      case 'running-stopwatch':
        return <RunningStopwatchInterface />;
      case 'timer':
        return <TimerInterface />;
      case 'running-timer':
        return <RunningTimerInterface />;
      default:
        return <StopwatchInterface />;
    }
  };

  return (
    <div className={styles.container}>
      {/* Navigation buttons for demo */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', justifyContent: 'center' }}>
        <button onClick={() => setCurrentView('stopwatch')}>Cronómetro</button>
        <button onClick={() => setCurrentView('running-stopwatch')}>Cronómetro Activo</button>
        <button onClick={() => setCurrentView('timer')}>Temporizador</button>
        <button onClick={() => setCurrentView('running-timer')}>Temporizador Activo</button>
      </div>
      
      <div className={styles.timerContainer}>
        {renderCurrentView()}
      </div>
    </div>
  );
};

export default TimerInterfaceMain;