import React from 'react';
import { ReactComponent as GreenPhoneIcon } from "../../views/Dashboard/assets/greenPhoneIcon.svg";
import { ReactComponent as Pencil } from "../../views/Dashboard/assets/pencilEdit.svg";
import { ReactComponent as GrayTagIcon } from "../../views/Dashboard/assets/grayTagIcon.svg";
import { ReactComponent as GreenMailIcon } from "../../views/Dashboard/assets/greenMailIcon.svg";
import { ReactComponent as GreenWebIcon } from "../../views/Dashboard/assets/greenWebIcon.svg";
import { ReactComponent as GreenCopyIcon } from "../../views/Dashboard/assets/greenCopyIcon.svg";



import './SymbolDesign.css';

const SymbolDesign = ({
                          setShowAddTags,
                          contactData,
                          setCopyclipboard,
                          setEditingFileTitle
                      }) => {

    const handleBtnsActions = (type) => {
        if (!contactData) return;

        const { companyPhoneNumber, webSite, companyEmail } = contactData;

        switch (type) {
            case 'clipboard':
                navigator.clipboard.writeText(window.location.href)
                    .then(() => console.log('URL copiada al portapapeles'))
                    .catch((err) => console.error('Error al copiar al portapapeles:', err));
                setCopyclipboard(true)
                setTimeout(() => {
                    setCopyclipboard(false)
                }, 5000);
                break;

            case 'callPhoneNumber':
                if (companyPhoneNumber?.length > 0) {
                    const { code, number } = companyPhoneNumber[0];
                    window.location.href = `tel:${code}${number}`;
                }
                break;

            case 'website':
                if (webSite) {
                    const formattedWebsite = webSite.startsWith('http://') || webSite.startsWith('https://')
                        ? webSite
                        : `https://${webSite}`;
                    window.open(formattedWebsite, '_blank');
                }
                break;

            case 'email':
                if (companyEmail) {
                    window.location.href = `mailto:${companyEmail}`;
                }
                break;

            case "inputFileTitle":
                setEditingFileTitle((prev) => !prev)
                break;
            default:
                console.warn('Tipo de acción no reconocido:', type);
        }

    };

    return (
        <div className="design-container">
            <span className="symbol" onClick={() => handleBtnsActions("clipboard")}>
                <GreenCopyIcon />
            </span>
            <span className="symbol" onClick={
                () => {
                    setShowAddTags(true);
                }
            }>
                <GrayTagIcon />
            </span>
            <span className="symbol" onClick={() => handleBtnsActions("callPhoneNumber")}>
                <GreenPhoneIcon />
            </span>
            <span className="symbol" onClick={() => handleBtnsActions("website")}>
                <GreenWebIcon />
            </span>
            <span className="symbol" onClick={() => handleBtnsActions("email")}>
                <GreenMailIcon />
            </span>
            <span className="symbolExtra">
                <Pencil />
            </span>
        </div>
    );
};

export default SymbolDesign;
