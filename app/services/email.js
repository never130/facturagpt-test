const fs = require("fs");

const path = require("path");
const nodemailer = require("nodemailer");
const {
  generateUniqueToken,
  calculateExpirationDateForOneDay,
} = require("../helpers/tokenGenerator");

const token = generateUniqueToken();
const expiration = calculateExpirationDateForOneDay();

const { getData } = require("../middlewares/emails/templates");
const {
  templateHtml,
} = require("../middlewares/emails/templates/templateHtml.js");

const getTemplate = async (name) => {
  try {
    const filePath = path.join(
      __dirname,
      "../middlewares/emails/templates/",
      name + ".html"
    );


    const html = await fs.readFile(filePath, "utf8");

    return { status: 200, html };
  } catch (error) {
    return { status: 404, error };
  }
};

const insertData = (htmlTemplate, data) => {
  try {
    const variableRegex = /\{{([^}]+)\}}/g;

    const replacedTemplate = htmlTemplate.replace(
      variableRegex,
      (match, variable) => {
        if (data.hasOwnProperty(variable)) {
          return data[variable];
        } else {
          return `not found ${variable}`;
        }
      }
    );

    return replacedTemplate;
  } catch (error) {
    throw new Error("Error during variable replacement");
  }
};

const setEmail = async (template, item) => {
  const resp = await getTemplate(template);
  if (resp.status == 404) {
    return false;
  }

  let data = getData(template, (lan = item?.lan || "es"));
  data = { backgroundColor: "red", ...data, ...item };

  data.footerHtml = templateHtml.footerHtml;

  const html = insertData(resp.html, data);
  return html;
};

async function sendEmail(email, template, data) {

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "info@aythen.com",
      pass: "mpgy xkya lzkh guas",
    },
  });


  let mailOptions = {
    from: data.from || `info@aythen.com`,
    to: email,
    subject: data.subject || "Invitacion a mi workspace",
    text: `Hola, te invito a formar parte de mi espacio de trabajo`,
    html: await setEmail(template, data),
  };

  if (data.attachment) {
    mailOptions.attachments = [
      {
        filename: "attachment.pdf",
        content: data.attachment,
        encoding: "base64",
      },
      {
        filename: "GreenLogo.png",
        path: "./assets/GreenLogo.png",
        cid: "unique@logo.cid",
      },
    ];
  }

  try {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error al enviar el correo electrónico:", error);
      } 
    });
  } catch (error) {
    console.error("Error al enviar el correo electrónico:", error);
  }
}

const getEmail = async (req, res) => {
  const { id } = req.params;
  const html = await setEmail(id);

  return res.send(html);
};

async function sendOtpEmail(nombre, email, otp, language = "Español",type="sendOtp") {
    console.log('1234')
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "info@aythen.com",
      pass: "fyin lnvb fapo ezfp",
    },
    tls: {
      rejectUnauthorized: false, 
  },
  });
  
  const templatePath = path.join(__dirname, `translations/${language||'Español'}`, `${type}.html`);
  let htmlTemplate = fs.readFileSync(templatePath, "utf8");

  const htmlContent = htmlTemplate
    .replace(/{{\s*nombre\s*}}/g, nombre)
    .replace(/{{\s*otp\s*}}/g, otp);
    const subjects = {
      sendOtp: {
        English: "Your OTP Code",
        Español: "Tu código OTP",
        普通话: "您的OTP验证码",
        日本語: "あなたのOTPコード",
        Italiano: "Il tuo codice OTP",
        Deutsch: "Ihr OTP-Code",
        Français: "Votre code OTP",
        Português: "Seu código OTP",
      },
      send2FA: {
        English: "Two-step authentication",
        Español: "Autenticación en dos pasos",
        普通话: "两步验证",
        日本語: "2段階認証",
        Italiano: "Autenticazione a due fattori",
        Deutsch: "Zwei-Faktor-Authentifizierung",
        Français: "Authentification en deux étapes",
        Português: "Autenticação em duas etapas",
      },
      welcome: {
        Español: "Bienvenido",
      },
      bill: {
        Español: "Factura",
      },
      impago: {
        Español: "Impago",
      },
    };
    const subjectMap = subjects[type] || subjects["sendOtp"];
    const subject = subjectMap[language] || subjectMap["Español"]; 

  const mailOptions = {
    from: "info@aythen.com",
    to: email,
    subject:  subject,
    html: htmlContent,
    attachments: [
      {
        filename: "GreenLogo.png",
        path: path.join(__dirname, "assets/GreenLogo.png"),
        cid: "logo",
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error al enviar el OTP:", error);
    throw new Error("No se pudo enviar el OTP.");
  }
}
async function sendInvoiceEmail(nombre, email, language = "Español") {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "info@aythen.com",
      pass: "fyin lnvb fapo ezfp",
    },
    tls: {
      rejectUnauthorized: false, 
  },
  });
  
  const templatePath = path.join(__dirname, `translations/${language||'Español'}`, `impago.html`);
  let htmlTemplate = fs.readFileSync(templatePath, "utf8");

  const htmlContent = htmlTemplate
    .replace(/{{\s*nombre\s*}}/g, nombre)
    .replace(/{{\s*yourLicense\s*}}/g, 'tu licencia')
    .replace(/{{\s*date\s*}}/g, 'fecha actual')
    const subjects = {
    
      impago: {
        Español: "Impago",
      },
    };
    const subjectMap = subjects['impago'] || subjects["impago"];
    const subject = subjectMap[language] || subjectMap["Español"]; 

  const mailOptions = {
    from: "info@aythen.com",
    to: email,
    subject:  subject,
    html: htmlContent,
    attachments: [
      {
        filename: "GreenLogo.png",
        path: path.join(__dirname, "assets/GreenLogo.png"),
        cid: "logo",
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error al enviar el OTP:", error);
    throw new Error("No se pudo enviar el OTP.");
  }
}
async function sendBillEmail(nombre, email, language = "Español") {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "info@aythen.com",
      pass: "fyin lnvb fapo ezfp",
    },
    tls: {
      rejectUnauthorized: false, 
  },
  });
  
  const templatePath = path.join(__dirname, `translations/${language||'Español'}`, `bill.html`);
  let htmlTemplate = fs.readFileSync(templatePath, "utf8");

  const htmlContent = htmlTemplate
    .replace(/{{\s*nombre\s*}}/g, nombre)
    .replace(/{{\s*OrderNum\s*}}/g, 'tu licencia')
    .replace(/{{\s*date\s*}}/g, 'fecha actual')
    const subjects = {
    
      bill: {
        Español: "Factura",
      },
    };
    const subjectMap = subjects['bill'] || subjects["bill"];
    const subject = subjectMap[language] || subjectMap["Español"]; 

  const mailOptions = {
    from: "info@aythen.com",
    to: email,
    subject:  subject,
    html: htmlContent,
    attachments: [
      {
        filename: "GreenLogo.png",
        path: path.join(__dirname, "assets/GreenLogo.png"),
        cid: "logo",
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error al enviar el OTP:", error);
    throw new Error("No se pudo enviar el OTP.");
  }
}

async function sendWelcomeEmail(nombre, email, language = "Español") {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "info@aythen.com",
      pass: "fyin lnvb fapo ezfp",
    },
    tls: {
      rejectUnauthorized: false, 
  },
  });
  
  const templatePath = path.join(__dirname, `translations/${language||'Español'}`, `welcome.html`);
  let htmlTemplate = fs.readFileSync(templatePath, "utf8");

  const htmlContent = htmlTemplate
    .replace(/{{\s*nombre\s*}}/g, nombre)
    const subjects = {
    
      welcome: {
        Español: "Bienvenido",
      },
    };
    const subjectMap = subjects['welcome'] || subjects["welcome"];
    const subject = subjectMap[language] || subjectMap["Español"]; 

  const mailOptions = {
    from: "info@aythen.com",
    to: email,
    subject:  subject,
    html: htmlContent,
    attachments: [
      {
        filename: "GreenLogo.png",
        path: path.join(__dirname, "assets/GreenLogo.png"),
        cid: "logo",
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error al enviar el OTP:", error);
    throw new Error("No se pudo enviar el OTP.");
  }
}
async function sendWorkspacesInvitation(
  nombre,
  email,
  language = "Español",
  workspaceId
) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "info@aythen.com",
      pass: "fyin lnvb fapo ezfp",
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const templatePath = path.join(
    __dirname,
    `translations/${language || "Español"}`,
    `workspaceInvitation.html`
  );
  let htmlTemplate = fs.readFileSync(templatePath, "utf8");

  const acceptUrl = `http://localhost:3005/admin/home/accept-invite/${workspaceId}/settings/workspace`;

  const htmlContent = htmlTemplate
    .replace(/{{\s*nombre\s*}}/g, nombre)
    .replace(/{{\s*inviteLink\s*}}/g, acceptUrl);

  const subjects = {
    workspaceInvitation: {
      Español: "Bienvenido",
    },
  };
  const subjectMap = subjects["workspaceInvitation"];
  const subject = subjectMap[language] || subjectMap["Español"];

  const mailOptions = {
    from: "info@aythen.com",
    to: email,
    subject: subject,
    html: htmlContent,
    attachments: [
      {
        filename: "GreenLogo.png",
        path: path.join(__dirname, "assets/GreenLogo.png"),
        cid: "logo",
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error al enviar la invitación:", error);
    throw new Error("No se pudo enviar la invitación.");
  }
}


const sendRecoveryCode = async (email, recoveryCode, language = "es", name) => {
  const defaultNames = {
    English: "FacturaGPT user",
    Español: "usuario de FacturaGPT",
    普通话: "FacturaGPT 用户",
    日本語: "FacturaGPTのユーザー",
    Italiano: "utente di FacturaGPT",
    Deutsch: "FacturaGPT-Benutzer",
    Français: "utilisateur de FacturaGPT",
    Português: "usuário do FacturaGPT",
  };

  const safeName = name?.trim() ? name : defaultNames[language] || defaultNames["Español"];

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "info@aythen.com",
      pass: "fyin lnvb fapo ezfp",
    },
  });

  
  const templatePath = path.join(__dirname, `translations/${language}`, `sendRecoveryCode.html`);
  let htmlTemplate = fs.readFileSync(templatePath, "utf8");

  const htmlContent = htmlTemplate
    .replace(/{{\s*name\s*}}/g, safeName)
    .replace(/{{\s*recoveryCode\s*}}/g, recoveryCode);

    const subject = {
      English: "Your Recovery Code FacturaGPT",
      Español: "Tu Código de Recuperación FacturaGPT",
      普通话: "您的FacturaGPT恢复代码",
      日本語: "FacturaGPTの復元コード",
      Italiano: "Il tuo codice di recupero FacturaGPT",
      Deutsch: "Ihr Wiederherstellungscode für FacturaGPT",
      Français: "Votre code de récupération FacturaGPT",
      Português: "Seu código de recuperação FacturaGPT"
    };
    

  const mailOptions = {
    from: "info@aythen.com",
    to: email,
    subject:subject[language],
    html: htmlContent,
    attachments: [
      {
        filename: "GreenLogo.png",
        path: path.join(__dirname, "assets/GreenLogo.png"),
          cid: "logo", 
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
    return {
      success: true,
      message: "Correo enviado correctamente",
    };
    
  } catch (error) {
    console.error("Error al enviar el código de recuperación:", error);
    throw new Error("No se pudo enviar el código de recuperación.");
  }
};


module.exports = {
  getTemplate: getTemplate,
  getEmail: getEmail,
  sendEmail: sendEmail,
  sendOtpEmail: sendOtpEmail,
  sendInvoiceEmail: sendInvoiceEmail,
  sendBillEmail: sendBillEmail,
  sendWelcomeEmail: sendWelcomeEmail,
  sendRecoveryCode: sendRecoveryCode,
  sendWorkspacesInvitation: sendWorkspacesInvitation,
};
