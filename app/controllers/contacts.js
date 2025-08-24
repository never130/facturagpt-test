const { catchedAsync } = require("../utils/err");
const { connectDB } = require("./utils");

const { v4: uuidv4 } = require("uuid");

const createContactController = async (req, res) => {
  try {
    const { user } = req;

    const { data } = req.body;

    const now = new Date().toISOString();
    const dataWithDate = {...data,createdAt: now, updatedAt: now,}

    const dataToProcess = Array.isArray(dataWithDate) ? dataWithDate : [dataWithDate];

    const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'
    const dbClients = await connectDB(`db_${selectedWorkspace}_contacts`);

    try {
      const clientDocs = [];

      for (let clientDoc of dataToProcess) {

        const email = "info@aythen.com";
        const existingClient = await dbClients.find({
          selector: { email: email },
          limit: 1,
        });

        if (existingClient.docs.length > 0) {
        } else {
          const clientId = uuidv4();

          try {
            const result = await dbClients.insert(clientDoc);

            if (clientDoc.image && clientDoc.image.startsWith("data:image")) {
              const matches = clientDoc.image.match(/^data:(.+);base64,(.+)$/);
              if (matches) {
                const contentType = matches[1];
                const base64Data = matches[2];

                const buffer = Buffer.from(base64Data, "base64");

                try {
                  await dbClients.attachment.insert(
                    result.id, 
                    "profile.jpg", 
                    buffer,
                    contentType,
                    { rev: result.rev } 
                  );
                } catch (err) {
                  console.error(
                    "Error al guardar la imagen como adjunto:",
                    err
                  );
                }
              }
            }
          } catch (err) {
            console.error("Error inserting client document:", err);
          }

          clientDocs.push(clientDoc);
        }
      }

      return res.status(200).send(clientDocs);
    } catch (error) {
      console.error("Error creating clients:", error);
      throw new Error("Failed to create clients");
    }
  } catch (err) {
    console.error("err", err);
    return res.status(500).send("Error on createClientController");
  }
};

const getAllContactsController = async (req, res) => {
  try {
    const { user } = req;
    const { limit = 999999, skip, search } = req.query;
    const { sortAlpha, statusFilter,sortDate,dateOrder } = req.body;

    const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'
    const dbClients = await connectDB(`db_${selectedWorkspace}_contacts`);
    let selector = {};


    if (sortDate) {
      const now = new Date();
      let limitDate = new Date();
      switch (sortDate) {
        case "1month": limitDate.setMonth(now.getMonth() - 1); break;
        case "3month": limitDate.setMonth(now.getMonth() - 3); break;
        case "6month": limitDate.setMonth(now.getMonth() - 6); break;
        case "1year": limitDate.setFullYear(now.getFullYear() - 1); break;
        default: limitDate = null;
      }

      if (limitDate) {
        selector.$or = [
          { createdAt: { $gt: limitDate.toISOString() } },
          { updatedAt: { $gt: limitDate.toISOString() } },
        ];
      }
    }

    if (search) {
      selector.contactName = {
          $regex: `(?i)${search}`,
      };
    }
    if (statusFilter && statusFilter !== "Todos") {
      selector.status = statusFilter;
    }
    let clients
    let totalClients
    if(search || sortDate){
      totalClients = await dbClients.find({
        selector,
        limit: 999999
      });

       clients = await dbClients.find({
        selector,
        limit: parseInt(limit),
        skip: parseInt(skip),
      });
    }
   else if(selector.status){
       clients = await dbClients.find({
        selector,
        limit: parseInt(limit),
        skip: parseInt(skip),
      });
       totalClients = await dbClients.find({
        selector,
        limit: 999999
      });
    }   else{
       clients = await dbClients.find({
        selector,
        limit: parseInt(limit),
        skip: parseInt(skip),
      });
    }
   
    const total = await dbClients.find({
      selector: {},
      fields: ["_id"],
      limit: 999999,
    });

    let contacts = clients.docs;


    if (sortAlpha) {
      contacts.sort((a, b) => {
        const aName = a.contactName?.toLowerCase() || "";
        const bName = b.contactName?.toLowerCase() || "";
        return sortAlpha === "A-Z"
          ? aName.localeCompare(bName)
          : bName.localeCompare(aName);
      });
    }

       if (dateOrder) {
      contacts.sort((a, b) => {
        const aDate = a.createdAt?.toLowerCase() || "";
        const bDate = b.createdAt?.toLowerCase() || "";
        return dateOrder === "falling"
          ? aDate.localeCompare(bDate)
          : bDate.localeCompare(aDate);
      });
    }
    const cleanedContacts = contacts
    let localSkip = skip
    let localTotal = total.docs.length
    if(statusFilter === "Todos" || statusFilter === null){
      if(search){
          localSkip = 1
          localTotal = totalClients.docs.length
      }
    }else {
      localSkip = 1
      localTotal = totalClients?.docs?.length || 0
    }
const dbDocs = await connectDB(`db_${selectedWorkspace}_docs`);

for (const contact of contacts) {
  try {
    const docsResult = await dbDocs.find({
      selector: { contactId: contact._id },
      fields: ["_id"],
      limit: 999999,
    });
    contact.totalDocs = docsResult.docs.length;
  } catch (err) {
    console.error(`Error obteniendo docs para contacto ${contact._id}`, err);
    contact.totalDocs = 0; 
  }
}


    return res.status(200).send({
      success: true,
      contacts: cleanedContacts,
      total: localTotal,
      limit: parseInt(limit),
      skip: parseInt(localSkip),
      pages: Math.ceil(total.docs.length / limit),
    });
  } catch (err) {
    console.error("err", err);
    return res.status(500).send("Error on getAllContactsController");
  }
};

const updateContactController = async (req, res) => {
  try {
    const { contactId } = req.params;
    const clientData = req.body;
    const user = req.user;

    const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'
    const dbClients = await connectDB(`db_${selectedWorkspace}_contacts`);

    const clientDoc = await dbClients.get(contactId);

    const updatedDoc = {
      ...clientDoc,
      contactName: clientData.contactData.contactName,
      companyEmail: clientData.contactData.companyEmail,
      type: clientData.contactData.type,
      companyPhoneNumber: clientData.contactData.companyPhoneNumber,
      codeCountry: clientData.contactData.codeCountry,
      webSite: clientData.contactData.webSite,
      billingEmail: clientData.contactData.billingEmail,
      contactZip: clientData.contactData.contactZip,
      country: clientData.contactData.country,
      dni: clientData.contactData.dni,
      selectedtags: clientData.contactData.selectedtags,
      tags: clientData.contactData.tags,
      fileTitle: clientData.contactData.fileTitle,
      taxNumber: clientData.contactData.taxNumber,
      contactCif: clientData.contactData.contactCif,
      preferredCurrency: clientData.contactData.preferredCurrency,
      cardNumber: clientData.contactData.cardNumber,
      companyAddress: clientData.contactData.companyAddress,
      companyCity: clientData.contactData.companyCity,
      companyProvince: clientData.contactData.companyProvince,
      companyCountry: clientData.contactData.companyCountry,
      infoBill: clientData.contactData.infoBill,
      paymethod: clientData.contactData.paymethod,
    };

    if (
      clientData.contactData.image &&
      clientData.contactData.image.startsWith("data:image")
    ) {
      updatedDoc.image = clientData.contactData.image;
    }

    const updateResponse = await dbClients.insert(updatedDoc);

    if (
      clientData.contactData.image &&
      clientData.contactData.image.startsWith("data:image")
    ) {
      const matches = clientData.contactData.image.match(
        /^data:(.+);base64,(.+)$/
      );
      if (matches) {
        const contentType = matches[1];
        const base64Data = matches[2];
        const buffer = Buffer.from(base64Data, "base64");

        try {
          await dbClients.attachment.insert(
            updateResponse.id,
            "profile.jpg",
            buffer,
            contentType,
            { rev: updateResponse.rev }
          );
        } catch (err) {
          console.error("Error al guardar la imagen como adjunto:", err);
        }
      }
    }

    return res.status(200).json({
      message: "Contacto actualizado",
      data: updateResponse,
    });
  } catch (err) {
    console.error("Error en updateContactController:", err);
    return res
      .status(500)
      .send("Error en el controlador al actualizar el contacto");
  }
};

const getOneContactController = async (req, res) => {
  try {
    const { clientId, userId } = req.params;
    const user = req.user

    const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'
    const dbClients = await connectDB(`db_${selectedWorkspace}_contacts`);

    const clientDoc = await dbClients.get(clientId);

    return res.status(200).send(clientDoc);
  } catch (err) {
    console.error("Error in getOneClientController:", err);
    return res.status(500).send("Error on getOneClientController");
  }
};

const deleteContactController = async (req, res) => {
  try {
    let { contactsSelected } = req.body;
    const user = req.user;
    const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'

    if (typeof contactsSelected === "string") {
      contactsSelected = [contactsSelected];
    }

    const dbClients = await connectDB(`db_${selectedWorkspace}_contacts`);

    try {
      const contactsToDelete = await Promise.all(
        contactsSelected.map(async (contactId) => {
          const contactDoc = await dbClients.get(contactId);
          return { _id: contactDoc._id, _rev: contactDoc._rev, _deleted: true };
        })
      );
      const response = await dbClients.bulk({ docs: contactsToDelete });
      return res
        .status(200)
        .json({ message: "Contacto eliminados correctamente", data: response });
    } catch (err) {
      console.error("Error getting user document:", err);
      return res.status(404).send("User document not found");
    }
  } catch (err) {
    console.error("Error on deleteClientsController:", err);
    return res.status(500).send("Error on deleteClientsController");
  }
};

const deleteAllContactsController = async (req, res) => {
  try {
    const user = req.user;
    const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'

    const dbClients = await connectDB(`db_${selectedWorkspace}_contacts`);

    const result = await dbClients.find({
      selector: {},
      limit: 9999999, 
    });

    if (!result.docs.length) {
      return res.status(200).json({ message: "No hay contactos para eliminar" });
    }

    const contactsToDelete = result.docs.map(doc => ({
      _id: doc._id,
      _rev: doc._rev,
      _deleted: true,
    }));

    const response = await dbClients.bulk({ docs: contactsToDelete });

    res.status(200).json({
      message: "Todos los contactos han sido eliminados correctamente",
      data: response,
    });
  } catch (err) {
    console.error("Error en deleteAllContactsController:", err);
    res.status(500).send("Error eliminando todos los contactos");
  }
};


const getContactImageController = async (req, res) => {
  try {
    const { user } = req;
    const { contactId } = req.params;

    const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'
    const dbClients = await connectDB(`db_${selectedWorkspace}_contacts`);

    const clientDoc = await dbClients.get(contactId);

    if (clientDoc.image) {
      return res.status(200).json({ image: clientDoc.image });
    } else {
      return res.status(404).json({ message: "El contacto no tiene imagen." });
    }
  } catch (err) {
    console.error("Error al obtener el campo image del contacto:", err);
    return res
      .status(500)
      .json({ message: "Error al obtener la imagen del contacto." });
  }
};

const getContactsStatusViewed = async (req, res) => {
  try {
    const { user } = req;
    const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'
    const dbClients = await connectDB(`db_${selectedWorkspace}_contacts`);

    const result = await dbClients.find({
      selector: {
        $or: [
          { seen: false },
          { seen: { $exists: false } },
        ],
      },
      fields: ["_id"],
    });

    return res.status(200).json({
      totalUnseenContacts: result.docs.length,
    });
  } catch (err) {
    console.error("Error al obtener contactos no vistos:", err);
    return res.status(500).json({
      message: "Error al obtener el estado de los contactos.",
    });
  }
};
const markContactAsSeen = async (req, res) => {
  try {
    const { user } = req;
    const { _id } = req.params;

    const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'
    const dbClients = await connectDB(`db_${selectedWorkspace}_contacts`);

    const contactDoc = await dbClients.get(_id);

    if (contactDoc.seen === true) {
      return res.status(200).json({
        message: "El contacto ya estaba marcado como visto.",
        alreadySeen: true,
        updatedId: contactDoc._id,
      });
    }

    const updatedDoc = {
      ...contactDoc,
      seen: true,
    };

    const response = await dbClients.insert(updatedDoc);

    return res.status(200).json({
      message: "Contacto marcado como visto.",
      alreadySeen: false,
      updatedId: response.id,
    });
  } catch (err) {
    console.error(`Error al marcar contacto como visto:`, err);
    return res.status(500).json({
      message: "Error al actualizar el estado del contacto.",
    });
  }
};




module.exports = {
  createContactController: catchedAsync(createContactController),
  getAllContactsController: catchedAsync(getAllContactsController),
  deleteContactController: catchedAsync(deleteContactController),
  deleteAllContactsController: catchedAsync(deleteAllContactsController),
  updateContactController: catchedAsync(updateContactController),
  getOneContactController: catchedAsync(getOneContactController),
  getContactImageController: catchedAsync(getContactImageController),
  getContactsStatusViewed: catchedAsync(getContactsStatusViewed),
  markContactAsSeen: catchedAsync(markContactAsSeen),
};
