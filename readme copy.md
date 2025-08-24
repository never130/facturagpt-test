pm2 start npm --name "frontend" -- run start
pm2 start app/index.js --name "backend"
pm2 start app/monitor.js --name "monitor"


sudo nano /etc/systemd/system/facturagpt-backend.service

systemctl daemon-reload

sudo systemctl enable facturagpt-backend
sudo systemctl disable facturagpt-backend

# Detener el servicio
sudo systemctl stop facturagpt-backend

# Reiniciar el servicio
sudo systemctl restart facturagpt-backend

# Status del servicio
sudo systemctl status facturagpt-backend

# Ver los logs
sudo journalctl -u facturagpt-backend -f

pm2 stop backend



<h2 align="center">A. Comandos Utiles</h2>

- Poder eliminar los procesos del puerto [3004]:
kill -9 $(lsof -t -i:3006) 

- Ejecutar pm2 en deploy

- Ejecutar para programar
npm run start && nodemon service app/service

- Crear un certificado
sudo certbot certonly --standalone -d facturagpt.com -d www.facturagpt.com

<h2 align="center">B. Funcionalidad</h2>

Roles de Usuario

- <b>db_accounts</b>: 
Vamos a tener todos los usuarios con acceso a la plataforma estos usuarios tienen PIN que los nuevos usuarios podran asociarse

- <b>db_otp</b>:
Todos los códigos de verificación generados por la aplicación.

https://facturagpt.com/api/user/db/217dce0d-a818-4f7c-8927-1634a155d80c

En esta ruta nos vamos a encontrar todas las bases de datos asociados a la cuenta que serán db_[id]_[name].


- <b>[name]auth</b>: Los tokens de las conexiones API del usuario
- <b>[name]chat</b>: Las conversaciones con facturaGPT
- <b>[name]clients</b>: Los clientes obtenidos del OCR (no son cuentas)
- <b>[name]products</b>: Los productos/activos obtenidos del OCR
- <b>[name]docs</b>: Las transaciones obtenidos del OCR
- <b>[name]notifications</b>: 
- <b>[name]automations</b>: 


<h2 align="center">C. Automatizaciones</h2>


@/services/automate/index.js

En este archivo habrá el inicio de la automatización
se puede iniciar de forma manual o de forma automatica.

De forma manual será subiendo un archivo y de forma automatica si el usuario tiene definida automatizaciones.

Todas las automatizaciones tienen que tener una entrada y opcionalmente una salida.


Una vez el archivo es leido, se procede a pasar por uno de los filtros disponibles [gmail, outlook, drive, dropbox, whatsapp..], y los filtros de salida [telematel, sheets, ftp, xml, agencia..].

Las automatizaciones de entrada sirven para recoger/capturar archivos
segun filtros y condiciones desde facturaGPT. Una vez el documento es procesado se guarda para que no se pueda volver a procesar por una segunda vez. Un documento procesado por una entrada podrá ser pasado a una salida para ejecutar una automatización. Las salidas tienen parametros diferentes que la entrada. 


Cuando la automatización se lee, por ejemplo de una factura, se crea un nuevo registro de un cliente, de todos los productos y del propio documento de forma automatica.

Una vez los datos están en la base de datos, el objetivo es poder conversar con ellos a través del chatGPT. 

Todas las automatizaciones se registran y se pueden editar. El objetivo es que una vez ejecutado FacturaGPT se cree un node-schedule que permita el proceso de cada automatización.


<h2 align="center">D. Notificaciones</h2>


Las notificaciones sirven para guardar el registro de lo que sucede en la aplicación, no solo nos da información sobre las automatizaciones usadas. Sino un especifico registro temporal del gasto ocasionado por el proceso de datos. 

<h2 align="center">E. Colaboradores</h2>

Los colaboradores no compartiran documentos como se hace en [google, dropbox..], sino se trata de compartir los dashboards de [clientes, productos, transacciones..] que se han generado en FacturaGPT. Incluso poder conversar con ellos cuando se tenga acceso.