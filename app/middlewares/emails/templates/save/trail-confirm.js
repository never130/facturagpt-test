const dataTrailConfirm = {}

const OrderNum = '1234'
const UserNum = '1'
const OrderType = 'Business'
const OrderPrice = '39$'

const NameDocument = 'Documento.pdf'
const AccountName = 'Carlos Valle López'
const AccountEmail = 'info@aythen.com'
const DateDue = '12/02/24'
const DateExpire = '12/02/24'

dataTrailConfirm['es'] = {
  text0: '¡Tienes una petición de firma!',
  text1: 'Hola [Nombre del Cliente]',
  text2: `🌟 Nos gustaría recortarte que tienes una petición 
  pendiente de ${AccountEmail} para los siguientes documentos, 
  que expirarán el ${DateExpire}.`,
  text3: 'Documento para firmar:',
  text4: `${NameDocument} `,
  text5: `${AccountName} firma del documento, del día ${DateDue}`,
  text6: 'Dirección de la firma',
  text7: `Delight Confection 123 Billing Street Billtown, Kentucky K2P0B0 Estados Unidos`,
  text9: `Firmar Ahora`,
  text10: `Miles de equipos como el tuyo utilizan funciones como [Integración XXX] e [Ilimitado YYY] cada día para asegurar flujos de trabajo fáciles y
  eficientes dentro de su equipo. ¿Cómo lo están haciendo? Echa un vistazo a nuestro`,
  text11: `y foro para obtener consejos y trucos. <br /> ¿No encuentras las respuestas que buscas? Contáctanos directamente en`,
};




module.exports = dataTrailConfirm;
