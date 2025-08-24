import PropTypes from "prop-types";
import styles from "./ClientsHeader.module.css";
import SearchIconWithIcon from "../SearchIconWithIcon/SearchIconWithIcon";
import Button from "../Button/Button";

const ClientsHeader = ({
  title,
  additionalInfo,
  additionalInfoStyles,
  buttons = [],
  searchProps,
  searchChildren,
  ref,
  father,
  customClientsHeader,
  customSearchContainer
}) => {
  return (
    <div className={styles.clientsHeader} style={customClientsHeader}>
      <div className={styles.headerInfo}>
        {title && (
          <h2>{title}</h2>
        )}
        {additionalInfo && (
          <div className={styles.additionalInfo} style={additionalInfoStyles}>{additionalInfo}</div>
        )}
      </div>
      <div className={styles.searchContainer} style={customSearchContainer}>
        {buttons.map((button, index) => (
          <Button
            key={index}
            className={styles.button}
            action={button.onClick}
            type={button.type}
            headerStyle={button.headerStyle}
          >
            {button.label}
          </Button>
        ))}

        <SearchIconWithIcon {...searchProps} ref={ref} father={father}>
          {searchChildren}
        </SearchIconWithIcon>
      </div>
    </div>
  );
};

ClientsHeader.propTypes = {
  title: PropTypes.string.isRequired, 
  additionalInfo: PropTypes.node, 
  buttons: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
      onClick: PropTypes.func.isRequired,
    })
  ),
  searchProps: PropTypes.object, 
  searchChildren: PropTypes.node, 
};

export default ClientsHeader;
