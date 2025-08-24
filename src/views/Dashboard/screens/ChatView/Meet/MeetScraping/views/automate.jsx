import styles from './index.module.css'
import { ReactComponent as IconSearch } from './assets/icon-search.svg'


const AutomateView = () => {
    return (

        <div>
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
                                Nombre de la automatización
                            </b>
                            <p>
                                Descripción de la automatización
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            <div>


                Tabla

                Tt
                Variable
                Nombre de la automatización
                Envío de emails desde diferentes proveedores o servidores (Outlook, Gmail, SMTP)

            </div>

        </div>
    )
}

export default AutomateView