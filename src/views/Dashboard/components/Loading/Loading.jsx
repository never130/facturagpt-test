import { useEffect, useState } from "react";

import styles from "./Loading.module.css";

import facturaGPT from "../../assets/facturaGPTBlackIcon.svg";
import useColors from "../../../../hooks/NavbarAdmin/useColors";

const Loading = () => {
    const [variant, setVariant] = useState('Factura')
    const [themeStyles, setThemeStyles] = useState('')
    const { theme } = useColors();

    useEffect(() => {
        const translation = localStorage.getItem("translationId");
        setVariant(translation ? translation : 'Factura')

      }, []);


    return (
        <div className={styles.loading}>
            <div className={styles.loadingContainer}>
                <img
                    onClick={() => navigate("/home")}
                    src={facturaGPT}
                    alt="FacturaGPT"
                    className={`${styles.logo} ${theme === 'dark' && styles.invertedColor}`}
                />
                <div className={styles.hiddenMobile}>
                {variant == 'Factura' ? variant : variant?.slice(0, -3) || 'Factura'}
                <strong>Gpt</strong>
                </div>
            </div>
        </div>
    )
}

export default Loading;