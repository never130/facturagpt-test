import styles from './MessageDeliver.module.css'

const MessageDeliver = ({ message }) => {
    return (
        <div className={styles.messageDeliver}>
            <p>{message.text}</p>


            Escoge con que app quieres hacer la compra

            icon condis
            Condis
            Ubicación más cerca 

            icon van
            5.00 EUR

            icon verify 
            Aceptar

            Marcadona

            Carrefour 

            Glovo 

            Uber Eats

            Just Eat

            Deliverroy
        </div>
    )
}

export default MessageDeliver