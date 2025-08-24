import { useState } from "react";
import styles from "./ToolbarSection.module.css";


import { ReactComponent as IconPlus } from "../assets/icon-plus.svg";
import { ReactComponent as IconPhone } from "../assets/icon-phone.svg";
import { ReactComponent as IconWeb } from "../assets/icon-web.svg";
import { ReactComponent as IconEmail } from "../assets/icon-email.svg";
import { ReactComponent as IconLocation } from "../assets/icon-location.svg";
import { ReactComponent as IconText } from "../assets/icon-text.svg";
import { ReactComponent as IconNumber } from "../assets/icon-number.svg";
import { ReactComponent as IconCurrency } from "../assets/icon-currency.svg";
import { ReactComponent as IconCupon } from "../assets/icon-cupon.svg";
import { ReactComponent as IconDiscount } from "../assets/icon-discount.svg";
import { ReactComponent as IconCalendar1 } from "../assets/icon-calendar-1.svg";
import { ReactComponent as IconCalendar2 } from "../assets/icon-calendar-2.svg";
import { ReactComponent as IconImage } from "../assets/icon-image.svg";
import { ReactComponent as IconDoc } from "../assets/icon-doc.svg";
import { ReactComponent as IconList } from "../assets/icon-list.svg";
import { ReactComponent as IconEtiqueta } from "../assets/icon-etiqueta.svg";
import { ReactComponent as IconChecklist } from "../assets/icon-checklist.svg";
import { ReactComponent as IconLoad } from "../assets/icon-load.svg";
import { ReactComponent as IconContact } from "../assets/icon-contact.svg";
import { ReactComponent as IconAsset } from "../assets/icon-asset.svg";
import { ReactComponent as IconTimer } from "../assets/icon-timer.svg";
import { ReactComponent as IconVoice } from "../assets/icon-voice.svg";
import { ReactComponent as IconLanguage } from "../assets/icon-language.svg";
import { ReactComponent as IconFormula } from "../assets/icon-formula.svg";
import { ReactComponent as IconStar } from "../assets/icon-star.svg";


import {
    ArrayTooltip,
    AssetTooltip,
    BaseTooltip,
    ChecklistTooltip,
    DataTooltip,
    DateTimeTooltip,
    EmailTooltip,
    FileTooltip,
    LocationTooltip,
    MediaTooltip,
    PhoneTooltip,
    RatingTooltip,
    TagTooltip,
    WebTooltip,
    WorkflowTooltip,
    SpecialTooltip,
    StatusTooltip,
    TooltipShowcase,
    UserTooltip,

} from "../../../../../../../components/type";


const ToolbarSection = () => {
    const params = [
        {
            icon: <IconPlus />,
            title: 'Plus',
            description: 'Add a new item',
            tooltip: <BaseTooltip />
        }, {
            icon: <IconPhone />,
            title: 'Phone',
            description: 'Add a new phone',
            tooltip: <PhoneTooltip />
        }, {
            icon: <IconWeb />,
            title: 'Web',
            description: 'Add a new web',
            tooltip: <WebTooltip />
        }, {
            icon: <IconEmail />,
            title: 'Email',
            description: 'Add a new email',
            tooltip: <EmailTooltip />
        }, {
            icon: <IconLocation />,
            title: 'Location',
            description: 'Add a new location',
            tooltip: <LocationTooltip />
        }, {
            icon: <IconText />,
            title: 'Text',
            description: 'Add a new text',
            tooltip: <div>Text</div>
        }, {
            icon: <IconNumber />,
            title: 'Number',
            description: 'Add a new number',
            tooltip: <div>number</div>
        }, {
            icon: <IconCurrency />,
            title: 'Currency',
            description: 'Add a new currency',
            tooltip: <div>currency</div>
        }, {
            icon: <IconCupon />,
            title: 'Cupon',
            description: 'Add a new cupon',
            tooltip: <div>Text</div>
        }, {
            icon: <IconDiscount />,
            title: 'Discount',
            description: 'Add a new discount',
            tooltip: <div>Text</div>
        }, {
            icon: <IconCalendar1 />,
            title: 'Calendar',
            description: 'Add a new calendar',
            tooltip: <div>Text</div>
        }, {
            icon: <IconCalendar2 />,
            title: 'Calendar',
            description: 'Add a new calendar',
            tooltip: <div>Text</div>
        }, {
            icon: <IconImage />,
            title: 'Image',
            description: 'Add a new image',
            tooltip: <MediaTooltip />
        }, {
            icon: <IconDoc />,
            title: 'Doc',
            description: 'Add a new doc',
            tooltip: <div>Text</div>
        }, {
            icon: <IconList />,
            title: 'List',
            description: 'Add a new list',
            tooltip: <ArrayTooltip />
        }, {
            icon: <IconEtiqueta />,
            title: 'Etiqueta',
            description: 'Add a new etiqueta',
            tooltip: <TagTooltip />
        }, {
            icon: <IconChecklist />,
            title: 'Checklist',
            description: 'Add a new checklist',
            tooltip: <ChecklistTooltip />
        }, {
            icon: <IconLoad />,
            title: 'Load',
            description: 'Add a new load',
            tooltip: <div>Text</div>
        }, {
            icon: <IconContact />,
            title: 'Contact',
            description: 'Add a new contact',
            tooltip: <div>Text</div>
        }, {
            icon: <IconAsset />,
            title: 'Asset',
            description: 'Add a new asset',
            tooltip: <AssetTooltip />
        }, {
            icon: <IconTimer />,
            title: 'Timer',
            description: 'Add a new timer',
            tooltip: <DateTimeTooltip />
        }, {
            icon: <IconVoice />,
            title: 'Voice',
            description: 'Add a new voice',
            tooltip: <SpecialTooltip />
        }, {
            icon: <IconLanguage />,
            title: 'Language',
            description: 'Add a new language',
            tooltip: <div>Text</div>
        }, {
            icon: <IconFormula />,
            title: 'Formula',
            description: 'Add a new formula',
            tooltip: <div>Text</div>
        }, {
            icon: <IconStar />,
            title: 'Star',
            description: 'Add a new star',
            tooltip: <WorkflowTooltip />
        }
    ]


    const [tooltip, setTooltip] = useState(null)


    return (
        <div className={styles.toolbarSection}>
            <div
                aria-hidden="true"
                className={styles.toolbarBorder}
            />
            <div className={styles.toolbarInner}>
                <div className={styles.toolbarContent}>

                    {/* Icon Toolbar */}
                    <div className={styles.iconToolbar}>
                        <div className={styles.iconRow}>
                            {params.map((param, index) => (
                                <div
                                    className={styles.iconContainer}
                                    onClick={() => {
                                        // console.log(param.tooltip)
                                        setTooltip(param.tooltip)
                                    }}
                                >
                                    {param.icon}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Icon Toolbar */}

                    <div className={styles.tooltipContainer}>
                        {tooltip}
                    </div>

                </div>
            </div>
        </div>
    )
}

export default ToolbarSection;


