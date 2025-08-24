
export const getMonthDays = (month, year) => {
    const date = new Date(year, month, 1);
    const days = [];
    let week = [];
  

    const firstDay = date.getDay();
    let dayCount = 1;
  

    const daysInMonth = new Date(year, month + 1, 0).getDate();
  
    
    for (let i = 0; i < firstDay; i++) {
      week.push(null);
    }
  
 
    while (dayCount <= daysInMonth) {
      week.push(dayCount);
      dayCount++;
  
     
      if (week.length === 7) {
        days.push(week);
        week = [];
      }
    }
  
  
    if (week.length > 0) {
      while (week.length < 7) {
        week.push(null); 
      }
      days.push(week);
    }
  
    return days;
  };
  
 
  export const getPreviousMonth = (currentMonth, currentYear) => {
    if (currentMonth === 0) {
      return { month: 11, year: currentYear - 1 }; 
    } else {
      return { month: currentMonth - 1, year: currentYear };
    }
  };
  

  export const getNextMonth = (currentMonth, currentYear) => {
    if (currentMonth === 11) {
      return { month: 0, year: currentYear + 1 }; 
    } else {
      return { month: currentMonth + 1, year: currentYear };
    }
  };
  