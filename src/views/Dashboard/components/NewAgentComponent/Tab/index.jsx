const Tab = ({
    className,
    setLocalAgent,
    title
}) => {
    return (
        <button
            className={`${className}`}
            onClick={setLocalAgent}
            type="button"
        >
            {title}
        </button>
    );
}


export default Tab;