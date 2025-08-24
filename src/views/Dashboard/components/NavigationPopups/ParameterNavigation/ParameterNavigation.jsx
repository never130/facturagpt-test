import React from 'react'
import { useTranslation } from 'react-i18next';
import { ReactComponent as ContactIdentification } from "../../../assets/contactIdentificationIcon.svg";
import { ReactComponent as TextBoxIcon } from "../../../assets/TextBoxIcon.svg";
import { ReactComponent as NumberIcon } from "../../../assets/NumberIcon.svg";
import { ReactComponent as UnitOfMeasurementIcon } from "../../../assets/UnitOfMeasurementIcon.svg";
import { ReactComponent as AmountIcon } from "../../../assets/AmountIcon.svg";
import { ReactComponent as DiscountIcon } from "../../../assets/DiscountIcon.svg";
import { ReactComponent as PercentageIcon } from "../../../assets/PercentageIcon.svg";
import { ReactComponent as DateIcon } from "../../../assets/DateIcon.svg";
import { ReactComponent as DateRangesIcon } from "../../../assets/DateRangesIcon.svg";
import { ReactComponent as LocationIcon } from "../../../assets/LocationIcon.svg";
import { ReactComponent as FilesMediaIcon } from "../../../assets/FilesMediaIcon.svg";
import { ReactComponent as listIcon } from "../../../assets/ListIconNew.svg";
import { ReactComponent as CategoryIcon } from "../../../assets/CategoryIcon.svg";
import { ReactComponent as TagIcon } from "../../../assets/TagIconNew.svg";
import { ReactComponent as StatusIcon } from "../../../assets/StatusIcon.svg";
import { ReactComponent as ChecklistIcon } from "../../../assets/ChecklistIcon.svg";
import { ReactComponent as EmailIcon } from "../../../assets/EmailIconNew.svg";
import { ReactComponent as PhoneIcon } from "../../../assets/phoneIcon.svg";
import { ReactComponent as ContactIcon } from "../../../assets/ContactIcon.svg";
import { ReactComponent as AssetIcon } from "../../../assets/AssetIcon.svg";
import { ReactComponent as UrlIcon } from "../../../assets/UrlIcon.svg";
import { ReactComponent as ChronometerIcon } from "../../../assets/ChronometerIcon.svg";
import { ReactComponent as VoiceRecorderIcon } from "../../../assets/VoiceRecorderIcon.svg";
import { ReactComponent as LanguageIcon } from "../../../assets/LanguageIcon.svg";
import { ReactComponent as FormulaIcon } from "../../../assets/FormulaIcon.svg";
import { ReactComponent as AssessmentIcon } from "../../../assets/AssessmentIcon.svg";
import ItemNavigation from '../ItemNavigation/ItemNavigation';
const ParameterNavigation = ({setParameterType, initialParameterType, FunctionsValidation=true}) => {
  const [t] = useTranslation("Contacts");

    
    const agentItems = [
        { id: "textBox", label: t('textBox'),Icon:TextBoxIcon, desc:"Campo de entrada de texto simple" },
        { id: "number", label: t('number'),Icon:NumberIcon , desc:"Campo para valores numéricos"},
        { id: "unitOfMeasurement", label: t('unitOfMeasurement'),Icon:UnitOfMeasurementIcon , desc:"Campo para seleccionar o escribir una unidad de medida (kg, cm, h, etc.)."},
        { id: "amount", label: t('amount'),Icon:AmountIcon , desc:"Campo numérico para precios, tarifas o PVP."},
        // { id: "discount", label: t('discount'),Icon:DiscountIcon , desc:""},
        { id: "percentage", label: t('percentage'),Icon:PercentageIcon , desc:"Campo específico para introducir descuentos, impuestos u otros valores en %."},
        { id: "email", label: t('emailInboxes'),Icon:EmailIcon , desc:"Campo para direcciones de correo electrónico"},
        { id: "url", label: t('Url'),Icon:UrlIcon , desc:"Campo para URLs y direcciones web"},
        { id: "phone", label: t('phone'),Icon:PhoneIcon , desc:"Campo para números telefónicos"},
        { id: "date", label: t('date'),Icon:DateIcon , desc:"Campo para seleccionar fechas"},
        { id: "hour", label: t('hour'),Icon:DateIcon , desc:"Campo para seleccionar hora específica"},
        {id:'dateAndHour',label:t('dateAndHour'),Icon:DateIcon, desc:"Campo para fecha y hora combinadas"},
        { id: "chronometer", label: t('chronometer'),Icon:ChronometerIcon , desc:"Campo para duraciones (ej. 2h 15m)"},
        { id: "richTextEditor", label: t('richTextEditor'),Icon:ChronometerIcon , desc:"Editor de texto con formato avanzado"},
        { id: "tag", label: t('tag'),Icon:TagIcon , desc:"Campo de etiquetas múltiples con autocompletado"},
        { id: "html", label: t('html'),Icon:TagIcon , desc:"Campo que admite contenido HTML"},
        { id: "array", label: t('array'),Icon:TagIcon , desc:"Lista desplegable de elementos (acabados, categorías, colecciones)"},
        { id: "object", label: t('object'),Icon:TagIcon , desc:"Objeto compuesto con propiedades anidadas"},
        { id: "filesMedia", label: t('filesMedia'),Icon:FilesMediaIcon , desc:"Campo para cargar múltiples archivos"},
        // { id: "recorder", label: t('recorder'),Icon:FilesMediaIcon , desc:""},
        // { id: "dateRanges", label: t('dateRanges'),Icon:DateRangesIcon , desc:""},
        { id: "voiceRecorder", label: t('voiceRecorder'),Icon:VoiceRecorderIcon , desc:"Campo que permite grabar y guardar mensajes de voz"},
        { id: "checklist", label: t('checklist'),Icon:ChecklistIcon , desc:"Lista de casillas que permiten múltiples selecciones"},
        { id: "json", label: t('json'),Icon:ChecklistIcon , desc:"Campo para datos en formato JSON"},
        { id: "xml", label: t('xml'),Icon:ChecklistIcon , desc:"Campo para datos en formato XML"},
        { id: "currency", label: t('currency'),Icon:ChecklistIcon , desc:"Campo para valores monetarios"},
        { id: "uuid", label: t('uuid'),Icon:ChecklistIcon , desc:"Código identificador universal único"},
        { id: "qr", label: t('qr'),Icon:ChecklistIcon , desc:"Campo para generar y visualizar un código QR escaneable."},
        { id: "barCode", label: t('barCode'),Icon:ChecklistIcon , desc:"Campo para generar o escanear códigos de barras estándar."},
        { id: "digitalSignature", label: t('digitalSignature'),Icon:ChecklistIcon , desc:"Campo para firma digital o manual"},
        { id: "coordinates", label: t('coordinates'),Icon:ChecklistIcon , desc:"Campo para introducir latitud y longitud geográfica."},
        { id: "location", label: t('location'),Icon:LocationIcon , desc:"Campo para escribir una dirección libre o ubicación local específica"},
        // { id: "language", label: t('language'),Icon:LocationIcon , desc:""},
        // { id: "List", label: t('list'),Icon:listIcon , desc:""},
        // { id: "category", label: t('category'),Icon:CategoryIcon , desc:""},
        { id: "colorList", label: t('colorList'),Icon:ContactIdentification , desc:"Selector de color hexadecimal o visual."},
        { id: "status", label: t('status'),Icon:StatusIcon , desc:"Campo para seleccionar un estado o fase predefinida"},
        { id: "contact", label: t('contact'),Icon:ContactIcon , desc:"Selector de contacto vinculado a tus tablas internas."},
        { id: "asset", label: t('asset'),Icon:AssetIcon , desc:"Selector de activo (producto, recurso, ítem...) vinculado a inventarios internos."},
        { id: "language", label: t('language'),Icon:LanguageIcon , desc:"Selector de idioma para definir localización del contenido"},
        { id: "audio", label: t('audio'),Icon:LanguageIcon , desc:"Campo para archivos de audio"},
        { id: "formula", label: t('formula'),Icon:FormulaIcon , desc:"Campo para fórmulas y expresiones dinámicas"},
        { id: "assessment", label: t('assessment'),Icon:AssessmentIcon , desc:"Campo para puntuar con estrellas, valores numéricos o porcentajes."},
      ];
  return (
 <ItemNavigation items={agentItems} setTypeState={setParameterType} father="parameter" initialParameterType={initialParameterType} FunctionsValidation={FunctionsValidation}/>

  )
}

export default ParameterNavigation