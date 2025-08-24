import React, { useState, useEffect } from "react"

import { useSelector, useDispatch } from "react-redux"

import { v4 as uuidv4 } from "uuid"

import styles from "./ModalToDoList.module.css"

import { initialTicket, initialTask, setKanban } from '@src/slices/kanbanSlices'

const ModalToDoList = ({ ticket: _ticket, task: _task }) => {
  const { kanban } = useSelector((state) => state.kanban)

  const dispatch = useDispatch()
  const [isLoad, setIsLoad] = useState(false)

  const [indexTicket, setIndexTicket] = useState(-1)
  const [indexTask, setIndexTask] = useState(-1)

  const [inputToDo, setInputToDo] = useState("")
  const [listDo, setListDo] = useState([])
  const [filteredListDo, setFilteredListDo] = useState([])
  const [tag, setTag] = useState("all")
  const [category, setCategory] = useState("all")

  useEffect(() => {
    if (kanban) {
      const _indexTicket = kanban.tickets.findIndex((t) => t.id == _ticket.id)
      const _indexTask = kanban.tickets[_indexTicket].tasks.findIndex((t) => t.id == _task.id)

      setIndexTicket(_indexTicket)
      setIndexTask(_indexTask)

      setListDo(kanban.tickets[_indexTicket].tasks[_indexTask].list)
      setIsLoad(true)
    }
  }, [kanban])

  const [numCompleted, setNumCompleted] = useState(0)

  useEffect(() => {
    const num = listDo.filter((item) => item.status === 101)
    setNumCompleted(num.length)

    updatedListDo()

    if (isLoad && kanban && indexTicket > -1 && indexTask > -1) {
      const updatedTickets = [...kanban.tickets]
      const updatedTasks = [...updatedTickets[indexTicket].tasks]

      updatedTasks[indexTask] = {
        ...updatedTasks[indexTask],
        list: listDo,
      }

      updatedTickets[indexTicket] = {
        ...updatedTickets[indexTicket],
        tasks: updatedTasks,
      }

      const updatedKanban = {
        ...kanban,
        tickets: updatedTickets,
      }


      dispatch(setKanban(updatedKanban))
    }
  }, [listDo])

  const handleInputToDo = (e) => {
    setInputToDo(e.target.value)

    if (e.key == "Enter") {
      handleNewInputToDo()
    }
  }

  const handleNewInputToDo = () => {
    setListDo((prev) => [
      ...prev,
      {
        id: uuidv4(),
        title: inputToDo,
        status: 100,
        tag: tag,
        priority: "",
        time: "",
      },
    ])

    setInputToDo("")
  }

  const handleSelectToDo = (index) => {
    const updatedListDo = [...filteredListDo]

    let status = 101
    if (updatedListDo[index].status == 101) status = 100

    updatedListDo[index] = {
      ...updatedListDo[index],
      status,
    }

    setListDo(updatedListDo)
  }

  const handleDeleteToDo = (e, index) => {
    e.stopPropagation()
    const updatedListDo = [...filteredListDo]
    delete updatedListDo[index]
    setListDo(updatedListDo.filter(Boolean))
  }


  const updatedListDo = () => {
    let filteredList = listDo

    if (category === "all") {
      filteredList = filteredList
    } else if (category === "active") {
      filteredList = filteredList.filter((item) => item.status === 100)
    } else if (category === "completed") {
      filteredList = filteredList.filter((item) => item.status === 101)
    } else if (category === "clear") {
      filteredList = filteredList.filter((item) => item.status === 100)
      setListDo(filteredList)
    }

    if (tag !== "all") {
      filteredList = filteredList.filter((item) => item.tag === tag)
    }

    setFilteredListDo(filteredList)
  }
  useEffect(() => {
    updatedListDo()
  }, [category, tag])


  const handleChangeToDo = (e, toDo) => {
    const value = e.target.value

    const index = listDo.findIndex((l) => l.id == toDo.id)

    if (index > -1) {
      const updatedTickets = [...kanban.tickets]
      const updatedTasks = [...updatedTickets[indexTicket].tasks]
      const updateDo = [...listDo]

      updateDo[index] = {
        ...updateDo[index],
        title: value,
      }

      updatedTasks[indexTask] = {
        ...updatedTasks[indexTask],
        list: updateDo,
      }

      updatedTickets[indexTicket] = {
        ...updatedTickets[indexTicket],
        tasks: updatedTasks,
      }

      const updatedKanban = {
        ...kanban,
        tickets: updatedTickets,
      }


      dispatch(setKanban(updatedKanban))
    }
  }

  return (
    <div className={styles.modal}>
      <div className={styles.header}>
        <input type="text" placeholder={"What do you neet to do?"} spellCheck={false} value={inputToDo} onChange={(e) => handleInputToDo(e)} onKeyDown={(e) => handleInputToDo(e)} />
        {/* prettier-ignore */}
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"> <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14m-7 7V5" /> </svg>
      </div>
      <div className={styles.tags}>
        <b>Tags:</b>
        <button onClick={() => setTag("all")} className={`${tag == "all" ? styles.active : ""}`}>
          <div />
          All
        </button>
        <button onClick={() => setTag("home")} className={`${tag == "home" ? styles.active : ""}`}>
          <div />
          Home
        </button>
        <button onClick={() => setTag("work")} className={`${tag == "work" ? styles.active : ""}`}>
          <div />
          Work
        </button>
        <button onClick={() => setTag("school")} className={`${tag == "school" ? styles.active : ""}`}>
          <div />
          School
        </button>
        <button onClick={() => setTag("extra")} className={`${tag == "extra" ? styles.active : ""}`}>
          <div />
          Extra
        </button>
        <a>Reset</a>
        <div className={styles.right}>
          {numCompleted}/{listDo.length} completadas
        </div>
      </div>
      <div className={styles.list}>
        {filteredListDo.map((toDo, index) => (
          <li key={index} className={`${toDo.status == 101 ? styles.ended : ""}`} onClick={() => handleSelectToDo(index)}>
            <div className={styles.checkout}>
              {/* prettier-ignore */}
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24"> <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 11.917 9.724 16.5 19 7.5" /> </svg>
            </div>
            <div className={styles.input}>
              <input placeholder={"Insertar titulo"} spellCheck={false} value={toDo.title} onChange={(e) => handleChangeToDo(e, toDo)} />
              {toDo.tag !== "all" && <label>{toDo.tag}</label>}
            </div>
            <button onClick={(e) => handleDeleteToDo(e, index)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"> <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6" /> </svg>
            </button>
          </li>
        ))}
      </div>
      <div className={styles.footer}>
        <div className={styles.buttons}>
          <button className={`${category == "all" ? styles.active : ""}`} onClick={() => setCategory("all")}>
            All tasks
          </button>
          <button className={`${category == "active" ? styles.active : ""}`} onClick={() => setCategory("active")}>
            Active
          </button>
          <button className={`${category == "completed" ? styles.active : ""}`} onClick={() => setCategory("completed")}>
            Completed
          </button>
          <button className={`${category == "clear" ? styles.active : ""}`} onClick={() => setCategory("clear")}>
            Clear Completed
          </button>
        </div>
      </div>
    </div>
  )
}

export default ModalToDoList
