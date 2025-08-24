import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
// import { IconDelete, IconSearch, IconView, IconLock, IconAutomate, IconEdit, IconPlus, IconClock, IconStar, IconField, IconChat, IconShare, IconPhone, IconEmail, IconAttach, IconLocation, IconAgent } from "@tabler/icons-react";
import styles from "./ViewerContainer.module.css";

import { ReactComponent as IconDelete } from "../../assets/icon-delete.svg"
import { ReactComponent as IconSearch } from "../../assets/icon-search.svg"
import { ReactComponent as IconView } from "../../assets/icon-view.svg"
import { ReactComponent as IconLock } from "../../assets/icon-lock.svg"
import { ReactComponent as IconAutomate } from "../../assets/icon-automate.svg"
import { ReactComponent as IconEdit } from "../../assets/icon-edit.svg"
import { ReactComponent as IconPlus } from "../../assets/icon-plus.svg"

import { ReactComponent as IconTag } from "../../assets/icon-tag.svg"
import { ReactComponent as IconSend } from "../../assets/icon-tag.svg"
import { ReactComponent as IconEmail } from "../../assets/icon-tag.svg"
import { ReactComponent as IconPrint } from "../../assets/icon-tag.svg"
import { ReactComponent as IconCopy } from "../../assets/icon-tag.svg"
import { ReactComponent as IconDownload } from "../../assets/icon-tag.svg"
import { ReactComponent as IconShare } from "../../assets/icon-tag.svg"
import { ReactComponent as IconAttach } from "../../assets/icon-attach.svg"
import { ReactComponent as IconLocation } from "../../assets/icon-location.svg"

import ViewerDoc from "./ViewerDoc"
import ViewerAsset from "./ViewerAsset"
import ViewerContact from "./ViewerContact"
import ViewerAgent from "./ViewerAgent"
import ViewerApp from "./ViewerApp"
import ViewerWorkspace from "./ViewerWorkspace"
import ViewerTable from "./ViewerTable"

const ViewerContainer = ({ message }) => {
    const navigate = useNavigate()

    const data = message.text?.data || {}
    const type = message.text?.type || null

    const items = [
        {
            label: 'Categoría',
            value: 'Categoría'
        },
    ]

    const Tags = ({ items }) => {
        return (
            <div className={styles.viewerContainerTags}>
                {items.map((item, index) => (
                    <div
                        key={index}
                        className={styles.viewerContainerTagsItem}
                    >
                        {item.label}

                        <IconDelete />
                    </div>
                ))}
            </div>
        )
    }


    const [title, setTitle] = useState("")

    useEffect(() => {
        let text = ""
        if (type === 'docs') {
            text = "Buscar un nuevo documento"
        } else if (type === 'assets') {
            text = "Buscar un nuevo activo"
        } else if (type === 'contacts') {
            text = "Buscar un nuevo contacto"
        } else if (type === 'agents') {
            text = "Buscar un nuevo agente"
        }

        setTitle(text)
    }, [type])

    const [viewMore, setViewMore] = useState(false)

    const onViewMore = () => {
        setViewMore(!viewMore)
    }

    const onClick = () => {
        if (type === 'docs') {
            navigate(`/admin/docs/${data._id}`)
        } else if (type === 'assets') {
            navigate(`/admin/assets/${data._id}`)
        } else if (type === 'contacts') {
            navigate(`/admin/contacts/${data._id}`)
        } else if (type === 'agents') {
            navigate(`/admin/bots/${data._id}`)
        }
    }

    return (
        <div className={styles.viewerSection}>
            <div className={styles.viewerContainerSearch}>
                <p>
                    {title}
                </p>
                <div>
                    <IconSearch />
                    <input type="text" placeholder={title} />
                </div>
            </div>
            {type === 'docs' ? (
                <ViewerDoc />
            ) : type === 'assets' ? (
                <ViewerAsset />
            ) : type === 'contacts' ? (
                <ViewerContact />
            ) : type === 'agents' ? (
                <ViewerAgent />
            )  : type === 'apps' ? (
                <ViewerApp />
            )  : type === 'workspaces' ? (
                <ViewerWorkspace />
            )  : type === 'tables' ? (
                <ViewerTable />
            ): null}

        </div>
    );
};

export default ViewerContainer;



// const ViewerDoc1 = () => {
//     return (
//         <div className={styles.viewerContainer} onClick={onClick}>
//             <div className={styles.viewerContainerHeader}>
//                 <div className={styles.viewerContainerAvatar}>
//                     ABC
//                 </div>
//                 <div className={styles.viewerContainerInfo}>
//                     <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
//                         <b>
//                             {data.title || 'Titulo del documento'}
//                         </b>
//                         <div className={styles.viewerContainerStatus}>
//                             {true ? (
//                                 <label>
//                                     aceptado
//                                 </label>
//                             ) : (
//                                 <label>

//                                     no aceptado
//                                 </label>
//                             )}
//                         </div>

//                     </div>
//                     <div className={styles.viewerContainerStats}>
//                         <label>
//                             999kb
//                         </label>
//                         <label>
//                             Categoría
//                         </label>
//                         <label>
//                             Concepto
//                         </label>
//                     </div>
//                     <span style={{ display: 'block' }}>/location</span>
//                     <Tags items={items} />
//                     <div className={styles.viewerContainerButtons}>
//                         <button>
//                             <IconView />
//                             Ver
//                         </button>
//                         <button className={styles.active}>
//                             <IconLock />
//                             Aprobar
//                         </button>
//                         <button>
//                             <div className={styles.viewerContainerButtonsDot} />
//                             Pagado
//                         </button>

//                     </div>
//                 </div>
//             </div>
//             <div className={styles.viewerContainerActions}>
//                 {viewMore && (
//                     <div>
//                         <button>
//                             <IconSend />
//                         </button>
//                         <button>
//                             <IconTag />
//                         </button>
//                         <button>
//                             <IconEmail />
//                         </button>
//                     </div>
//                 )}
//                 {viewMore && (
//                     <>
//                         <button>
//                             <IconPrint />
//                         </button>
//                         <button>
//                             <IconCopy />
//                         </button>
//                         <button>
//                             <IconDownload />
//                         </button>
//                         <button>
//                             <IconShare />
//                         </button>
//                         <button>
//                             <IconAutomate />
//                         </button>
//                     </>
//                 )}
//                 <button className={styles.second}>
//                     <IconEdit />
//                 </button>
//                 <button
//                     className={styles.second}
//                     onClick={onViewMore}
//                 >
//                     <IconPlus />
//                 </button>
//             </div>
//         </div>
//     )
// }

// const ViewerAsset = () => {
//     return (
//         <div className={styles.viewerContainer} onClick={onClick}>
//             <div className={styles.viewerContainerHeader}>
//                 <div className={styles.viewerContainerAvatar}>

//                 </div>
//                 <div className={styles.viewerContainerInfo}>
//                     <b>
//                         {data.title || 'Nombre del activo'}
//                     </b>
//                     <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
//                         <span>
//                             {data.text || 'Tipo de activo'}
//                         </span>
//                         <span>
//                             {data.text || 'Tipo de categoria'}
//                         </span>
//                         <span>
//                             {data.text || 'Código'}
//                         </span>
//                     </div>
//                     <span>
//                         {data.id || 'Descripción'}
//                     </span>
//                     <div className={styles.viewerContainerButtons}>
//                         <button>
//                             <IconView />
//                             Ver
//                         </button>
//                         <Tags items={items} />
//                     </div>
//                 </div>
//             </div>
//             <div className={styles.viewerContainerActions}>
//                 <button>
//                     <IconAttach />
//                 </button>
//                 <button>
//                     <IconTag />
//                 </button>
//                 <button>
//                     <IconLocation />
//                 </button>
//                 <button className={styles.second}>
//                     <IconEdit />
//                 </button>
//                 <button className={styles.second}>
//                     <IconPlus />
//                 </button>
//             </div>
//         </div>
//     )
// }

// const ViewerContact = () => {
//     return (
//         <div className={styles.viewerContainer} onClick={onClick}>
//             <div className={styles.viewerContainerHeader}>
//                 <div className={styles.viewerContainerAvatar}>

//                 </div>
//                 <div className={styles.viewerContainerInfo}>
//                     <b>
//                         {data.title || 'Nombre del contacto'}
//                     </b>
//                     <p>
//                         {data.text || 'Tipo de contacto'}
//                     </p>
//                     <span>
//                         {data.id || 'Número Fiscal'}
//                     </span>
//                     <span>
//                         {data.id || 'Email address, Zip code, etc.'}
//                     </span>
//                     <div className={styles.viewerContainerButtons}>
//                         <button>
//                             <IconView />
//                             Ver
//                         </button>
//                         <Tags items={items} />
//                     </div>
//                 </div>
//             </div>
//             <div className={styles.viewerContainerActions}>
//                 {viewMore && (
//                     <>
//                         <button>
//                             <IconAttach />
//                         </button>
//                         <button>
//                             <IconTag />
//                         </button>
//                         <button>
//                             <IconWorld />
//                         </button>
//                     </>
//                 )}
//                 {!viewMore && (
//                     <>
//                         <button>
//                             <IconView />
//                         </button>
//                         <button>
//                             <IconPhone />
//                         </button>
//                         <button>
//                             <IconEmail />
//                         </button>
//                     </>
//                 )}
//                 <button className={styles.second}>
//                     <IconEdit />
//                 </button>
//                 <button
//                     className={styles.second}
//                     onClick={onViewMore}
//                 >
//                     <IconPlus />
//                 </button>
//             </div>
//         </div>
//     )
// }

// const ViewerAgent = () => {
//     return (
//         <div className={styles.viewerContainer} onClick={onClick}>
//             <div className={styles.viewerContainerHeader}>

//                 <div className={styles.viewerContainerAvatar}>
//                     <IconAgent />
//                 </div>
//                 <div className={styles.viewerContainerInfo}>
//                     <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
//                         <b>
//                             Nombre del agente
//                         </b>
//                         <div className={styles.viewerContainerLabel}>
//                             <div>
//                                 5 Resp.
//                                 <IconClock />
//                             </div>
//                             <div>
//                                 5
//                                 <IconAutomate />
//                             </div>
//                         </div>
//                     </div>
//                     <span>
//                         Publico, privado, clave: *** asd
//                     </span>
//                     <span>
//                         Descripción del agente
//                     </span>
//                     <Tags items={items} />

//                     <div className={styles.viewerContainerLabelBottom}>
//                         FacturaGPT
//                         <IconStar />
//                         <IconField />
//                         <span>
//                             Hace un año
//                         </span>
//                     </div>
//                 </div>
//             </div>
//             <div className={styles.viewerContainerActions}>

//                 {!viewMore && (
//                     <>
//                         <button>
//                             <IconAgent />
//                         </button>
//                         <button>
//                             <IconChat />
//                         </button>
//                         <button>
//                             <IconShare />
//                         </button>
//                     </>
//                 )}
//                 <button className={styles.second}>
//                     <IconEdit />
//                 </button>
//                 <button
//                     className={styles.second}
//                     onClick={onViewMore}
//                 >
//                     <IconPlus />
//                 </button>
//             </div>
//         </div>
//     )
// }