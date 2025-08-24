import React, { useState, useRef, useEffect } from 'react';
import styles from './Calendar.module.css';
const languages = {
    es: {
        months: [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ],
        daysShort: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
        today: 'Hoy',
        selectDate: 'Seleccionar fecha',
        placeholder: 'Selecciona una fecha...'
    },
    en: {
        months: [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ],
        daysShort: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        today: 'Today',
        selectDate: 'Select date',
        placeholder: 'Select a date...'
    },
    fr: {
        months: [
            'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
            'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
        ],
        daysShort: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
        today: 'Aujourd\'hui',
        selectDate: 'Sélectionner la date',
        placeholder: 'Sélectionnez une date...'
    }
};

const Calendar = ({
    language = 'es',
    selectedDate = null,
    onDateSelect = () => { },
    events = [], 
    isOpen = false,
    onClose = () => { }
}) => {
    const [currentDate, setCurrentDate] = useState(
        selectedDate ? new Date(selectedDate) : new Date()
      );
      
      const [selectedDay, setSelectedDay] = useState(
        selectedDate ? new Date(selectedDate) : null
      );
      
    const [showYearMonthPicker, setShowYearMonthPicker] = useState(false);

    const lang = languages[language] || languages.es;
    const today = new Date();

    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    const firstDayWeekday = (firstDayOfMonth.getDay() + 6) % 7; 

    const generateCalendarDays = () => {
        const days = [];
        const totalDays = lastDayOfMonth.getDate();

        const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 0);
        for (let i = firstDayWeekday - 1; i >= 0; i--) {
            const day = prevMonth.getDate() - i;
            days.push({
                day,
                isCurrentMonth: false,
                date: new Date(prevMonth.getFullYear(), prevMonth.getMonth(), day)
            });
        }

        for (let day = 1; day <= totalDays; day++) {
            days.push({
                day,
                isCurrentMonth: true,
                date: new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
            });
        }

        const remainingDays = 42 - days.length; 
        for (let day = 1; day <= remainingDays; day++) {
            days.push({
                day,
                isCurrentMonth: false,
                date: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, day)
            });
        }

        return days;
    };

    const navigateMonth = (direction) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(prev.getMonth() + direction);
            return newDate;
        });
    };

    const handleDateClick = (dayObj) => {
        setSelectedDay(dayObj.date);
        onDateSelect(dayObj.date);
        onClose(); 
    };

    const generateYearOptions = () => {
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let year = currentYear - 50; year <= currentYear + 50; year++) {
            years.push(year);
        }
        return years;
    };

    const isToday = (date) => {
        return date.toDateString() === today.toDateString();
    };

    const isSelected = (date) => {
        return selectedDay && date.toDateString() === selectedDay.toDateString();
    };

    const hasEvent = (date) => {
        return events.some(eventDate =>
            eventDate.toDateString() === date.toDateString()
        );
    };

    const calendarDays = generateCalendarDays();

    if (!isOpen) return null;

    return (
        <div className={styles.calendarCustom} onClick={onClose}>
            <div className={styles.content} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <button
                        onClick={() => navigateMonth(-1)}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#f0f0f0'}
                        onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                    >
                        ←
                    </button>

                    <h2
                        onClick={() => setShowYearMonthPicker(!showYearMonthPicker)}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#f0f0f0'}
                        onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                        title="Click para cambiar año y mes"
                    >
                        {lang.months[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </h2>

                    <button
                        onClick={() => navigateMonth(1)}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#f0f0f0'}
                        onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                    >
                        →
                    </button>
                </div>

                {showYearMonthPicker && (
                    <div className={styles.yearMonthPicker}>
                        <div>
                            <label>
                                Año
                            </label>
                            <select
                                value={currentDate.getFullYear()}
                                onChange={(e) => setCurrentDate(new Date(parseInt(e.target.value), currentDate.getMonth(), 1))}
                            >
                                {generateYearOptions().map(year => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.monthGrid}>
                            {lang.months.map((month, index) => {
                                const isSelected = currentDate.getMonth() === index;
                                return (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            setCurrentDate(new Date(currentDate.getFullYear(), index, 1));
                                            setShowYearMonthPicker(false);
                                        }}
                                        className={isSelected ? `${styles.monthButton} ${styles.selected}` : styles.monthButton}
                                    >
                                        {month}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                <div style={{ padding: '20px' }}>
                    <div className={styles.daysHeader}>
                        {lang.daysShort.map((day, index) => (
                            <div key={index}>{day}</div>
                        ))}
                    </div>

                    <div className={styles.calendarGrid}>
                        {calendarDays.map((dayObj, index) => {
                            const isCurrentMonth = dayObj.isCurrentMonth;
                            const todayClass = isToday(dayObj.date);
                            const selectedClass = isSelected(dayObj.date);
                            const eventClass = hasEvent(dayObj.date);

                            return (
                                <button
                                    key={index}
                                    onClick={() => handleDateClick(dayObj)}
                                    style={{
                                        padding: '12px 4px',
                                        border: 'none',
                                        background: selectedClass
                                            ? 'var(--_10a37f-background)'
                                            : todayClass
                                                ? '#e0f3ee'
                                                : 'transparent',
                                        color: selectedClass
                                            ? 'white'
                                            : todayClass
                                                ? 'var(--_10a37f-background)'
                                                : isCurrentMonth
                                                    ? '#333'
                                                    : '#ccc',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        fontWeight: todayClass || selectedClass ? '600' : 'normal',
                                        transition: 'all 0.2s ease',
                                        position: 'relative',
                                        minHeight: '40px'
                                    }}
                                    onMouseOver={(e) => {
                                        if (!selectedClass) {
                                            e.target.style.backgroundColor = '#f5f5f5';
                                        }
                                    }}
                                    onMouseOut={(e) => {
                                        if (!selectedClass && !todayClass) {
                                            e.target.style.backgroundColor = 'transparent';
                                        } else if (todayClass && !selectedClass) {
                                            e.target.style.backgroundColor = '#E3F2FD';
                                        }
                                    }}
                                >
                                    {dayObj.day}
                                    {eventClass && (
                                        <div style={{
                                            width: '6px',
                                            height: '6px',
                                            backgroundColor: selectedClass ? 'white' : '#FF4444',
                                            borderRadius: '50%',
                                            position: 'absolute',
                                            bottom: '4px',
                                            left: '50%',
                                            transform: 'translateX(-50%)'
                                        }} />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

const DateInput = ({
    value = null,
    onChange = () => { },
    language = 'es',
    placeholder = '',
    events = [],
    disabled = false,
    error = false
}) => {
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(value);
    const inputRef = useRef(null);

    const lang = languages[language] || languages.es;

    useEffect(() => {
        setSelectedDate(value);
    }, [value]);

    const handleDateSelect = (date) => {
        setSelectedDate(date);
        onChange(date);
        setIsCalendarOpen(false);
    };

    const formatDate = (date) => {
        if (!date) return '';
      
        const parsedDate = new Date(date); 
      
        if (isNaN(parsedDate.getTime())) return ''; 
      
        return parsedDate.toLocaleDateString(
          language === 'es' ? 'es-ES' : language === 'fr' ? 'fr-FR' : 'en-US',
          {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }
        );
      };
      
    const clearDate = () => {
        setSelectedDate(null);
        onChange(null);
    };

    return (
        <div style={{ position: 'relative', width: '100%' }}>
            <div
                ref={inputRef}
                onClick={() => !disabled && setIsCalendarOpen(true)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 16px',
                    border: error ? '1px solid #FF4444' : '1px solid #cbcbcb',
                    borderRadius: '8px',
                    backgroundColor: disabled ? '#f5f5f5' : 'white',
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    textAlign: 'center',
                    color: selectedDate ? '#333' : '#999',
                    transition: 'all 0.2s ease',
                }}
                onMouseOver={(e) => {
                    if (!disabled) {
                        e.currentTarget.style.borderColor = 'var(--_10a37f-background)';
                    }
                }}
                onMouseOut={(e) => {
                    if (!error) {
                        e.currentTarget.style.borderColor = '#cbcbcb';
                    }
                }}
            >
                <span style={{ flex: 1 }}>
                    {selectedDate ? formatDate(selectedDate) : (placeholder || lang.placeholder)}
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {selectedDate && !disabled && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                clearDate();
                            }}
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: '#999',
                                fontSize: '18px',
                                padding: '2px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '20px',
                                height: '20px'
                            }}
                            onMouseOver={(e) => e.target.style.color = '#666'}
                            onMouseOut={(e) => e.target.style.color = '#999'}
                            title="Limpiar fecha"
                        >
                            ×
                        </button>
                    )}
                    <span style={{
                        color: '#666',
                        fontSize: '16px'
                    }}>
                        📅
                    </span>
                </div>
            </div>

            <Calendar
                language={language}
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
                events={events}
                isOpen={isCalendarOpen}
                onClose={() => setIsCalendarOpen(false)}
            />
        </div>
    );
};

export default DateInput;