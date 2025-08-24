import styles from './index.module.css'

import { ReactComponent as IconSearch } from './assets/icon-search.svg'

const ValueView = () => {
    return (
        <div className={styles.container}>
            <div className={styles.search}>
                <div>
                    <IconSearch />
                </div>
                <input type="text" placeholder="Buscar..." />
                <div>/</div>
            </div>


            <div className={styles.breadcrumbs}>
                <div className={styles.icon}>
                    icon
                </div>
                <b>
                    Automatización
                </b>
                <div className={styles.arrow}>
                    &gt;
                </div>

                <div className={styles.icon}>
                    icon table
                </div>
                <b>
                    Tabla
                </b>
                <div className={styles.arrow}>
                    &gt;
                </div>
                <div className={styles.icon}>
                    icon var
                </div>
                <b>
                    Variable
                </b>
            </div>

            <div className={styles.list}>
                {[1,2,3].map((item) => (
                    <div className={styles.item}>
                        <div className={styles.icon}>
                            icon automatizacion
                        </div>
                        <div className={styles.info}>
                            <b>
                                Tabla
                            </b>
                            <p>
                                número de variables
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div>

                --

                icon table
                Tabla
                numero de variables

                icon texto
                Texto
                Campo de entrada de texto simple


            </div>
        </div>


    )

}

export default ValueView