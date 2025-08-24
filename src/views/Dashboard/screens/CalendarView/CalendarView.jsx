import Calendar from "./Calendar/index.jsx"

import PanelTemplate from "../../components/PanelTemplate/PanelTemplate.jsx";

import { CalendarContextProvider } from "./CalendarContext";
const CalendarView = () => {


  return (

      <CalendarContextProvider>
        <Calendar />
      </CalendarContextProvider>
  )
}

export default CalendarView 