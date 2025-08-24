import Telematel from "../../../../assets/telematel.svg";

export const json = [
  {
    endpoint: "http://[#host#]/gomanage/static/auth/j_spring_security_check",
    method: "POST",
    module: "security",
    name: "Seguridad. Login. Token",
    description: `Este método permitirá obtener un token de seguridad para la aplicación Go!Manage.`,
    type: "Telematel",
    image: Telematel,
    data: [
      {
        type: "character",
        required: true,
        description: "Usuario de la aplicación Go!Manage",
        title: "j_username",
      },
      {
        type: "character",
        required: true,
        description: "Password de la aplicación Go!Manage",
        title: "j_password",
      }
    ],
  },
  {
    endpoint: "/gomanage-web/web/data/apitmt-purchases-invoicenotifications/",
    method: "POST",
    module: "Prueba 1",
    name: "Crea una notificación de factura de compra",
    description: `Este método permitirá que se puedan registrar notificaciones que 
    provienen de albaranes y notificacaciones de facturas directas que incluyan 
    líneas de gastos /servicios y textos (estas facturas no proceden de ningún albarán).
Las líneas de notificaciones que provienen de albaranes se registrarán en la tabla gcnflin 
asignando el tipo de línea "A".
Las líneas de notificaciones de facturas directas (servicios/gastos) se registrarán en la tabla 
gcnflin asignando el tipo de línea "S" (servicios) ó "T" (texto).`,
    type: "Telematel",
    image: Telematel,
    data: [
      {
        type: "character",
        required: true,
        description: "CIF Proveedor",
        title: "vat_number",
      },
      {
        type: "date",
        required: true,
        description: "Fecha Notifiación",
        title: "date",
      },
      {
        type: "character",
        required: true,
        description: "Referencia",
        title: "reference",
      },
      {
        type: "json",
        required: true,
        description: "Líneas de la notificación",
        title: "lines",
        data: [
          {
            type: "character",
            required: true,
            description: "Descripción",
            title: "title",
          },
          {
            type: "character2",
            required: true,
            description: "Descripción2",
            title: "title2",
          }
        ]
      },
      {
        type: "json",
        required: true,
        description: "Vencimientos de Notificaciones",
        title: "receipts",
        data: [
          {
            type: "character",
            required: true,
            description: "Descripción",
            title: "title",
          },
          {
            type: "character2",
            required: true,
            description: "Descripción2",
            title: "title2",
          }
        ]
      },
      {
        type: "json",
        required: true,
        description: "Impuestos de Notificaciones",
        title: "taxes",
        data: [
          {
            type: "character",
            required: true,
            description: "Descripción",
            title: "title",
          },
          {
            type: "character2",
            required: true,
            description: "Descripción2",
            title: "title2",
          }
        ]
      },
      {
        type: "decimal",
        required: false,
        description: "Importe Bruto B2B",
        title: "gross_amount",
      },
      {
        type: "decimal",
        required: false,
        description: "UsrChar1_gcnfcab",
        title: "user_char1",
      },
      {
        type: "character",
        required: false,
        description: "UsrChar2_gcnfcab",
        title: "user_char2",
      },
      {
        type: "character",
        required: false,
        description: "CIF Cliente G2G",
        title: "customer_vat_id",
      },
      {
        type: "character",
        required: false,
        description: "Medio Pago",
        title: "mean_payment",
      },
      {
        type: "integer",
        required: false,
        description: "Delegación",
        title: "branch_id"
      },
      {
        type: "integer",
        required: false,
        description: "Empresa",
        title: "company_id"
      },
      {
        type: "integer",
        required: false,
        description: "Proveedor",
        title: "supplier_id"
      },
      {
        type: "character",
        required: false,
        description: "Protocolo",
        title: "protocol"
      },
      {
        type: "decimal",
        required: false,
        description: "UsrDec1_gcnfcab",
        title: "user_dec1"
      },
      {
        type: "decimal",
        required: false,
        description: "UsrDec2_gcnfcab",
        title: "user_dec2"
      },
      {
        type: "decimal",
        required: false,
        description: "UsrDec3_gcnfcab",
        title: "user_dec3"
      },
      {
        type: "decimal",
        required: false,
        description: "UsrDec4_gcnfcab",
        title: "user_dec4"
      },
      {
        type: "decimal",
        required: false,
        description: "UsrDec5_gcnfcab",
        title: "user_dec5"
      },
      {
        type: "decimal",
        required: false,
        description: "UsrDec6_gcnfcab",
        title: "user_dec6"
      },
      {
        type: "character",
        required: false,
        description: "Descripción Medio Pago",
        title: "payment_description"
      },
      {
        type: "character",
        required: false,
        description: "Descripción Tipo Factura",
        title: "invoice_type_description"
      },
      {
        type: "character",
        required: false,
        description: "UsrEdi1_gcnfcab",
        title: "user_edi1"
      },
      {
        type: "character",
        required: false,
        description: "UsrEdi2_gcnfcab",
        title: "user_edi2"
      },
      {
        type: "character",
        required: false,
        description: "Número Factura Proveedor",
        title: "supplier_invoice_id"
      },
      {
        type: "date",
        required: false,
        description: "UsrFec1_gcnfcab",
        title: "user_fec1"
      },
      {
        type: "date",
        required: false,
        description: "UsrFec2_gcnfcab",
        title: "user_fec2"
      },
      {
        type: "date",
        required: false,
        description: "UsrFec3_gcnfcab",
        title: "user_fec3"
      },
      {
        type: "character",
        required: false,
        description: "Imagen",
        title: "notification_image"
      },
      {
        type: "character",
        required: false,
        description: "Observaciones",
        title: "notes"
      },
      {
        type: "character",
        required: false,
        description: "Punto Venta",
        title: "sale_point"
      },
      {
        type: "character",
        required: false,
        description: "Situación",
        title: "status"
      },
      {
        type: "character",
        required: false,
        description: "Solicitante",
        title: "applicant"
      },
      {
        type: "character",
        required: false,
        description: "Tipo Factura",
        title: "invoice_type"
      },
      {
        type: "decimal",
        required: false,
        description: "Importe Total B2B",
        title: "amount"
      }
    ],
  },
  {
    endpoint: "/gomanage-web/web/data/apitmt-purchases-deliverynotifications/",
    method: "POST",
    module: "Prueba 2",
    name: "Crea notificación de entrega de compras",
    description: `Este método permitirá que se puedan registrar notificaciones que 
    provienen de albaranes y notificacaciones de facturas directas que incluyan 
    líneas de gastos /servicios y textos (estas facturas no proceden de ningún albarán).`,
    type: "Telematel",
    image: Telematel,
    data: [
      {
        type: "integer",
        required: true,
        description: "Proveedor",
        title: "vendor_id",
      }, {
        type: "character",
        required: true,
        description: "Num. Albarán Proveedor",
        title: "vendor_delivery_note_id"
      }, {
        type: "TABLE",
        required: true,
        description: "Líneas Not Entrega",
        title: "lines"
      }, {
        type: "integer",
        required: false,
        description: "Número Bultos",
        title: "parcels"
      }, {
        type: "character",
        required: false,
        description: "UsrChar1_gcnocab",
        title: "user_char1"
      }, {
        type: "character",
        required: false,
        description: "CIF Proveedor",
        title: "vat_number"
      }, {
        type: "character",
        required: false,
        description: "C.Entrega",
        title: "delivery_terms"
      }, {
        type: "integer",
        required: false,
        description: "Delegación",
        title: "branch_id"
      }, {
        type: "integer",
        required: false,
        description: "Empresa",
        title: "company_id"
      }, {
        type: "character",
        required: false,
        description: "País cliente",
        title: "customer_country_id"
      }, {
        type: "character",
        required: false,
        description: "País centro exped.",
        title: "expedition_country_id"
      },
      {
        type: "character",
        required: false,
        description: "País",
        title: "shipping_country_id"
      },
      {
        type: "character",
        required: false,
        description: "Protocolo",
        title: "protocol"
      },
      {
        type: "integer",
        required: false,
        description: "Provincia cliente",
        title: "customer_province_id"
      },
      {
        type: "integer",
        required: false,
        description: "Provincia centro exped.",
        title: "expedition_province_id"
      },
      {
        type: "integer",
        required: false,
        description: "Província",
        title: "shipping_province_id"
      },
      {
        type: "integer",
        required: false,
        description: "Transportista",
        title: "carrier_id"
      },
      {
        type: "character",
        required: false,
        description: "Unidad Medida Peso",
        title: "measurement_unit_weight"
      },
      {
        type: "character",
        required: false,
        description: "Unidad Medida Volumen",
        title: "measurement_unit_volume"
      },
      {
        type: "character",
        required: false,
        description: "Tipo Vía Cliente",
        title: "customer_street_type"
      },
      {
        type: "character",
        required: false,
        description: "Tipo Vía Centro Exped.",
        title: "expedition_street_type"
      },
      {
        type: "character",
        required: false,
        description: "Vía",
        title: "shipping_street_type"
      },
      {
        type: "character",
        required: false,
        description: "C.Postal cliente",
        title: "customer_postal_code"
      },
      {
        type: "character",
        required: false,
        description: "C.Postal Centro Exped.",
        title: "expedition_postal_code"
      },
      {
        type: "character",
        required: false,
        description: "Dirección Cliente",
        title: "customer_address"
      },
      {
        type: "decimal",
        required: false,
        description: "UsrDec1_gcnocab",
        title: "user_dec1"
      },
      {
        type: "decimal",
        required: false,
        description: "UsrDec2_gcnocab",
        title: "user_dec2"
      },
      {
        type: "decimal",
        required: false,
        description: "UsrDec3_gcnocab",
        title: "user_dec3"
      },
      {
        type: "decimal",
        required: false,
        description: "UsrDec4_gcnocab",
        title: "user_dec4"
      },
      {
        type: "decimal",
        required: false,
        description: "UsrDec5_gcnocab",
        title: "user_dec5"
      },
      {
        type: "decimal",
        required: false,
        description: "UsrDec6_gcnocab",
        title: "user_dec6"
      },
      {
        type: "character",
        required: false,
        description: "Destinatario Mercancías",
        title: "receiver"
      },
      {
        type: "character",
        required: false,
        description: "Dirección Centro Exped.",
        title: "expedition_address"
      },
      {
        type: "character",
        required: false,
        description: "Dirección",
        title: "shipping_address"
      },
      {
        type: "character",
        required: false,
        description: "Descrp.Cond.Entrega",
        title: "delivery_terms_description"
      },
      {
        type: "integer",
        required: false,
        description: "C. Postal",
        title: "shipping_postal_code"
      },
      {
        type: "character",
        required: false,
        description: "e-mail cliente",
        title: "customer_email"
      },
      {
        type: "character",
        required: false,
        description: "UsrEdi1_gcnocab",
        title: "user_edi1"
      },
      {
        type: "character",
        required: false,
        description: "UsrEdi2_gcnocab",
        title: "user_edi2"
      },
      {
        type: "character",
        required: false,
        description: "e-mail centro exped.",
        title: "expedition_email"
      },
      {
        type: "character",
        required: false,
        description: "e-mail",
        title: "shipping_email"
      },
      {
        type: "logical",
        required: false,
        description: "Material Entregado",
        title: "delivered_material"
      },
      {
        type: "character",
        required: false,
        description: "Número expedición",
        title: "expedition_id"
      },
      {
        type: "character",
        required: false,
        description: "Fabricante PTL",
        title: "vendor_ptl_id"
      },
      {
        type: "character",
        required: false,
        description: "Fabricante externo",
        title: "vendor_external_id"
      },
      {
        type: "character",
        required: false,
        description: "Fax",
        title: "shipping_fax"
      },
      {
        type: "character",
        required: false,
        description: "Fax cliente",
        title: "customer_fax"
      },
      {
        type: "date",
        required: false,
        description: "UsrFec1_gcnocab",
        title: "user_date1"
      },
      {
        type: "date",
        required: false,
        description: "UsrFec2_gcnocab",
        title: "user_date2"
      },
      {
        type: "date",
        required: false,
        description: "UsrFec3_gcnocab",
        title: "user_date3"
      },
      {
        type: "date",
        required: false,
        description: "Fecha Entrega",
        title: "delivery_date"
      },
      {
        type: "character",
        required: false,
        description: "Fax centro exped.",
        title: "expedition_fax"
      },
      {
        type: "character",
        required: false,
        description: "Quien firma entrega",
        title: "delivery_signed_by"
      },
      {
        type: "character",
        required: false,
        description: "Lugar entrega",
        title: "delivery_place"
      },
      {
        type: "character",
        required: false,
        description: "Nombre cliente",
        title: "customer_name"
      },
      {
        type: "character",
        required: false,
        description: "Nombre Centro Exped.",
        title: "expedition_center_name"
      },
      {
        type: "character",
        required: false,
        description: "NIF Cliente",
        title: "customer_vat_number"
      },
      {
        type: "character",
        required: false,
        description: "Número",
        title: "shipping_street_number"
      },
      {
        type: "character",
        required: false,
        description: "Observaciones",
        title: "notes"
      },
      {
        type: "character",
        required: false,
        description: "Población Cliente",
        title: "customer_city"
      },
      {
        type: "decimal",
        required: false,
        description: "Peso",
        title: "weight"
      },
      {
        type: "character",
        required: false,
        description: "Población Centro Exped.",
        title: "expedition_city"
      },
      {
        type: "character",
        required: false,
        description: "Población",
        title: "shipping_city"
      },
      {
        type: "character",
        required: false,
        description: "Razón social",
        title: "shipping_business_name"
      },
      {
        type: "character",
        required: false,
        description: "Referencia",
        title: "reference"
      },
      {
        type: "character",
        required: false,
        description: "Teléfono cliente",
        title: "customer_phone"
      },
      {
        type: "character",
        required: false,
        description: "Telefono",
        title: "shipping_phone"
      },
      {
        type: "character",
        required: false,
        description: "Teléfono Centro Exped.",
        title: "expedition_phone"
      },
      {
        type: "character",
        required: false,
        description: "Transportista No Habitual",
        title: "carrier_name"
      },
      {
        type: "character",
        required: false,
        description: "Número cliente",
        title: "customer_id"
      },
      {
        type: "character",
        required: false,
        description: "Número Centro Exped.",
        title: "expedition_center_id"
      },
      {
        type: "decimal",
        required: false,
        description: "Volumen",
        title: "volume"
      }
    ],
  },

];
