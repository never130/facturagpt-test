
import React, { useState } from 'react'

import styles from './index.module.css'


import Promo from './promo'
import Season from './season'
import Item from './item'
import Home from './home'




const SeasonPass = () => {
    const [showSeason, setShowSeason] = useState('season')
    return (
        <div className={styles.project}>
            <div>
                <button onClick={() => setShowSeason('promo')}>
                    promo
                </button>
                <button onClick={() => setShowSeason('season')}>
                    season
                </button>
                <button onClick={() => setShowSeason('item')}>
                    item
                </button>
                <button onClick={() => setShowSeason('home')}>
                    home
                </button>

                <div>
                    {showSeason == 'promo' ? (
                        <Promo setShowSeason={setShowSeason}/>
                    ) : showSeason == 'season' ? (
                        <Season setShowSeason={setShowSeason} />
                    ) : showSeason == 'item' ? (
                        <Item />
                    ) : showSeason == 'home' && (
                        <Home />
                    )}
                </div>
            </div>
        </div>
    )
}


export default SeasonPass


