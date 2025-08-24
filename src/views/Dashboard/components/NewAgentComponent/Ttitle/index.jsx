import styles from "./index.module.css";

const Title = ({
    value,id,
    rightSide
}) => {
    return (
        <div className={styles.titleContainer}>
            <h3 className={styles.title} id={id}>{value}</h3>
            {rightSide}
        </div>
    )
}

export default Title;