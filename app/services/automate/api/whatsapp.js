const path = require("path");
const { connectDB } = require("../../../controllers/utils");
const { Client, LocalAuth } = require("whatsapp-web.js");

const sendWhatsAppMessage = async ({
  userId,
  deviceId,
  phoneNumberArray,
  message,
  id,
}) => {
  if (!userId || !deviceId || !Array.isArray(phoneNumberArray) || !message) {
    throw new Error(
      "Se requieren ID de usuario, ID de dispositivo, array de números y mensaje."
    );
  }

  const docId = `whatsapp_${userId}_${deviceId}`;
  const sessionFolderName = `${userId}_${deviceId}`.replace(/[^a-zA-Z0-9_-]/g, "_");
  let client = null;

  try {
    const dbAuth = await connectDB(`db_${id}_auth`);

    
    let deviceDoc;
    try {
        deviceDoc = await dbAuth.get(docId);
    } catch (err) {
      if (err.statusCode === 404) {
        throw new Error("Dispositivo no registrado.");
      }
      throw err;
    }

    if (deviceDoc.status !== "authenticated" && deviceDoc.status !== "ready") {
      throw new Error(`El dispositivo no está listo (estado: ${deviceDoc.status}).`);
    }

    const sessionPath = path.resolve(__dirname, "../../../services/automate/whatsapp_sessions");

    client = new Client({
      authStrategy: new LocalAuth({
        clientId: sessionFolderName,
        dataPath: sessionPath,
      }),
      puppeteer: {
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      },
    });

    let ready = false;
    let disconnectedReason = null;

    client.on("ready", () => {
      ready = true;
    });

    client.on("disconnected", (reason) => {
      console.error(`Cliente desconectado: ${reason}`);
      disconnectedReason = reason;
      ready = false;
    });

    client.on("auth_failure", () => {
      console.error("Fallo de autenticación.");
      throw new Error("Fallo de autenticación en WhatsApp.");
    });

    await client.initialize();

    let attempts = 0;
    const maxAttempts = 30; 
    while (!ready && !disconnectedReason && attempts < maxAttempts) {
      await new Promise((res) => setTimeout(res, 500));
      attempts++;
    }

    if (!ready) {
      if (disconnectedReason) {
        throw new Error(`Cliente desconectado: ${disconnectedReason}`);
      }
      await client.destroy();
      throw new Error("Cliente no llegó a estado 'ready' a tiempo.");
    }

    const sendMessageToNumber = async (phoneNumber) => {
      const formattedNumber = phoneNumber.includes("@")
        ? phoneNumber
        : `${phoneNumber.replace(/\D/g, "")}@c.us`;

      try {
        const result = await client.sendMessage(formattedNumber, message);

        return {
          number: formattedNumber,
          status: "success",
          messageId: result.id.id,
          ack: result.ack,
          timestamp: result.timestamp,
        };
      } catch (error) {
        console.error(`Error al enviar mensaje a ${formattedNumber}:`, error.message);
        return {
          number: formattedNumber,
          status: "failed",
          error: error.message,
        };
      }
    };

    const results = await Promise.allSettled(phoneNumberArray.map(sendMessageToNumber));

    await client.destroy();

    return {
      success: true,
      results: results.map((r) =>
        r.status === "fulfilled" ? r.value : { error: r.reason.message }
      ),
    };
  } catch (error) {
    console.error(`Error general al enviar mensajes desde ${docId}:`, error.message);
    if (client && typeof client.destroy === "function") {
      await client.destroy().catch((e) =>
        console.error(`Error al destruir cliente en catch: ${e.message}`)
      );
    }
    throw error;
  }
};

module.exports = { sendWhatsAppMessage };