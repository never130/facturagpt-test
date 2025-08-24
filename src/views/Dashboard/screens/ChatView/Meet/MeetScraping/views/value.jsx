import styles from './index.module.css'

import { ReactComponent as IconSearch } from './assets/icon-search.svg'

const Value1View = () => {
    return (
        <div>
        <div className={styles.search}>
            <div>
                <IconSearch />
            </div>
            <input type="text" placeholder="Buscar..." />
            <div>/</div>
        </div>

        <div>
            <input
             type="text"
              placeholder="Valor" 
              />
              <div>
                <input type="checkbox" />
                <p>
                Añadir unidad de medida
                </p>
              </div>
              <div>
                Importe, Masa, Volumen
              </div>
              <div>
                Kg, ml, l / kg
              </div>
        </div>
    
    </div>
    )
}

export default Value1View