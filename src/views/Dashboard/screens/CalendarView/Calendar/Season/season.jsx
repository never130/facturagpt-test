import React, { useState }  from 'react'

import styles from './season.module.css'

const Season = ({setShowSeason}) => {

    const [list, setList] = useState([{
        title: 96,
        vectors: 200,
        documents: 100
    }])

    const handleItem = () => {
        setShowSeason('item')
    }

    return (
        <div className={styles.season}>
            <div className={styles.tier}>
                <b>
                    Tier
                </b>
                <span>
                    100
                </span>
            </div>
            <div className={styles.exp}>
                <div className={styles.type}>
                    <svg  fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeWidth="2" d="M11.083 5.104c.35-.8 1.485-.8 1.834 0l1.752 4.022a1 1 0 0 0 .84.597l4.463.342c.9.069 1.255 1.2.556 1.771l-3.33 2.723a1 1 0 0 0-.337 1.016l1.03 4.119c.214.858-.71 1.552-1.474 1.106l-3.913-2.281a1 1 0 0 0-1.008 0L7.583 20.8c-.764.446-1.688-.248-1.474-1.106l1.03-4.119A1 1 0 0 0 6.8 14.56l-3.33-2.723c-.698-.571-.342-1.702.557-1.771l4.462-.342a1 1 0 0 0 .84-.597l1.753-4.022Z" />
                    </svg>
                    Max
                </div>
                <div className={styles.bar}>
                    <div />
                    bar progresse
                </div>
            </div>
            <div className={styles.info}>
                <b>
                    Temporada 9
                </b>
                <span>
                    La temporada termina en: 31 días
                </span>
                <div>

                    Página 13/13
                    <div>
                        Flecha o teclado
                    </div>
                </div>
            </div>
            <table className={styles.table}>
                <thead>
                    <th>

                    </th>
                    {list.map((item, index) => (
                        <th 
                        key={index}
                        onClick={() => handleItem()}
                        >
                            96
                        </th>
                    ))}
                </thead>
                <tbody>
                    <td>
                        Item #01
                    </td>
                    {list.map((item, index) => (
                        <td key={index}>
                            Item #02
                        </td>
                    ))}
                </tbody>
            </table>
            <div className={styles.bottom}>
                <p>
                    Season 8 Max Tier Reached!
                </p>
            </div>



            <div className={styles.legend}>
                <b>
                    Legendario
                </b>
                <p>
                    Indumentaria
                </p>
                <p>
                    No me provoques. Soy imparable.
                    Parte del conjunto de 24 quilates.
                    (Estilos desbloqueables)
                </p>

            </div>

        </div>
    )
}

export default Season