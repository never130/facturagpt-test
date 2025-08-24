import React, { useState, useEffect } from 'react'

import styles from './KanbanGPT.module.css'

import { useSelector, useDispatch } from 'react-redux'

import { initial } from './initial'

import {
  createIdeaKanban,
} from "@actions/project"

const KanbanGPT = ({ setIsShowGPT, textKanban }) => {
  const dispatch = useDispatch()

  const { user } = useSelector((state) => state.user)
  const { project } = useSelector((state) => state.project)

  const [isLoad, setIsLoad] = useState(false)

  const uniqueCategories = [...new Set(initial.map(item => item.category))];

  const [filteredKanban, setFilteredKanban] = useState([])

  useEffect(() => {
    setFilteredKanban(initial)
  }, [])

  const handleSelectCategory = (category) => {
    const filteredKanban = initial.filter(item => item.category === category);
    setFilteredKanban(filteredKanban);
  }

  const handleSelectItem = async (item) => {
    setIsLoad(true)

    await dispatch(
      createIdeaKanban({
        workspaceId: user?.id,
        projectId: project?.id,
        kanban: item,
        text: textKanban,
      }),
    )

    setIsShowGPT(false)
    setIsLoad(false)

  }

  return (
    <div className={styles.panelGPT}>
      <div className={styles.content}>
        <ul className={styles.left}>
          {uniqueCategories.map((category, index) => (
            <li
              key={index}
              onClick={() => handleSelectCategory(category)}
            >
              {category}
            </li>
          ))}
        </ul>
        <div className={styles.right}>
          <div className={styles.search}>
            <div className={styles.input}>
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeWidth="1" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
              </svg>
              <input type="search" placeholder="Buscar plantilla.." />
            </div>
            <div className={styles.title}>
              Buscar plantilla
            </div>
          </div>
          {!isLoad ? (
            <ul className={styles.container}>
              {filteredKanban.map((item, index) => (
                <li
                  key={index}
                  onClick={() => handleSelectItem(item)}
                >
                  icono
                  <b>
                    {item.title}
                  </b>
                  <p>
                    {item.description}
                  </p>
                  <div className={styles.labels}>
                    {item.data.map((label) => (
                      <label>
                        {label}
                      </label>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className={styles.isLoad}>
              <p>Cargando el <strong>kanban</strong> perfecto</p>
              <div className={styles.bar}>
                <div className={styles.progress} />
              </div>
              <div className={styles.buttons}>
                <button onClick={() => setIsLoad(false)}>Cancelar</button>
                <button onClick={() => setIsLoad(false)}>Cambiar GPT</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default KanbanGPT