const path = require("path");
const fs = require("fs");
const nano = require("nano")("http://admin:1234@127.0.0.1:5984");
const { v4: uuidv4 } = require("uuid");
const { connectDB } = require("./utils");
const jwt = require("jsonwebtoken");
const { catchedAsync } = require("../utils/err");
const { sendWorkspacesInvitation } = require("../services/email");

const createWorkspaceController = async (req, res) => {
  try {
    const { workspace, createdBy, owner } = req.body;
    if (!workspace || typeof workspace !== "object") {
      return res.status(400).json({ message: "Datos de workspace inválidos." });
    }

    const db = await connectDB("db_workspaces"); // usa el nombre correcto de tu base

    // Asegurar un _id único si no viene uno del frontend
    const newWorkspace = {
      _id: uuidv4(),
      ...workspace,
      createdAt: workspace.createdAt || new Date().toISOString(),
      createdBy,
      members: [
        {
          _id: createdBy,
          role: {
            type: "owner",
          },
          email: owner?.email,
          name: owner?.nombre,
          profileImage: owner?.profileImage,
          memberSince: new Date().toISOString(),
        },
      ],
    };

    // Insertar el nuevo workspace
    await db.insert(newWorkspace);

    // Conectar a la base de cuentas
    const dbAccounts = await connectDB("db_accounts");

    // Buscar la cuenta que coincida con el email del owner
    let account;
    try {
      // Buscar por índice de email (si existe) o recorrer todos los documentos
      // Aquí se asume que el campo es "email" en la cuenta
      const selector = {
        selector: {
          email: owner?.email
        },
        limit: 1
      };
      const result = await dbAccounts.find(selector);
      account = result.docs && result.docs.length > 0 ? result.docs[0] : null;
    } catch (err) {
      console.error("Error buscando la cuenta del owner:", err);
      account = null;
    }

    if (account) {
      // Inicializar los campos si no existen
      if (!Array.isArray(account.workspacesOwner)) {
        account.workspacesOwner = [];
      }
      if (!Array.isArray(account.workspacesMember)) {
        account.workspacesMember = [];
      }

      // Agregar el id del nuevo workspace a workspacesOwner y workspacesMember si corresponde
      if (!account.workspacesOwner.includes(newWorkspace._id)) {
        account.workspacesOwner.push(newWorkspace._id);
      }
      if (!account.workspacesMember.includes(newWorkspace._id)) {
        account.workspacesMember.push(newWorkspace._id);
      }

      // Actualizar la cuenta en la base de datos
      try {
        await dbAccounts.insert({
          ...account,
          _rev: account._rev
        });
      } catch (err) {
        console.error("Error actualizando la cuenta con los workspaces:", err);
        // No retornamos error, solo lo notificamos en consola
      }
    } else {
      console.warn("No se encontró la cuenta del owner para actualizar los workspaces.");
    }

    res.status(201).json({
      message: "Workspace creado exitosamente.",
      workspace: newWorkspace,
    });
  } catch (error) {
    console.error("Error creando workspace:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};

const updateWorkspaceController = async (req, res) => {
  try {
    const { workspace: workspaceUpdates, workspaceId } = req.body;

    if (!workspaceId) {
      return res
        .status(400)
        .json({ message: "workspaceId is required in params." });
    }

    if (!workspaceUpdates || typeof workspaceUpdates !== "object") {
      return res
        .status(400)
        .json({ message: "workspace updates must be an object." });
    }

    const db = await connectDB("db_workspaces");

    // Obtener el workspace existente
    const existing = await db.get(workspaceId).catch((err) => {
      if (err.statusCode === 404) return null;
      throw err;
    });

    if (!existing) {
      return res.status(404).json({ message: "Workspace not found." });
    }

    const updatedWorkspace = {
      ...existing,
      ...workspaceUpdates,
      updatedAt: new Date().toISOString(),
      _rev: existing._rev,
    };

    const insertResult = await db.insert(updatedWorkspace);

    updatedWorkspace._rev = insertResult.rev;

    res.status(200).json({
      message: "Workspace updated successfully.",
      workspace: updatedWorkspace,
    });
  } catch (error) {
    console.error("Error updating workspace:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const getWorkspacesByMemberController = async (req, res) => {
  try {
    const { userId } = req.params;
    const { search } = req.query;
    if (!userId) {
      return res.status(400).json({ message: "Falta el parámetro userId." });
    }

    // Primero, buscar la cuenta del usuario para obtener los IDs de workspaces donde es miembro
    const accountsDb = await connectDB("db_accounts");
    const userAccount = await accountsDb.get(userId).catch((err) => {
      if (err.statusCode === 404) return null;
      throw err;
    });

    if (!userAccount) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    const workspacesMember = Array.isArray(userAccount.workspacesMember)
      ? userAccount.workspacesMember
      : [];

    if (workspacesMember.length === 0) {
      return res.status(200).json({ workspaces: [] });
    }

    // Ahora buscar los workspaces cuyos _id estén en el arreglo workspacesMember
    const workspacesDb = await connectDB("db_workspaces");

    let selector = {
      _id: { $in: workspacesMember },
    };

    // Aplica búsqueda por título usando regex (case-insensitive)
    if (search) {
      selector.title = {
        $regex: `(?i)${search}`,
      };
    }

    const result = await workspacesDb.find({
      selector,
      limit: 999999,
    });

    // Buscar el currentMember para cada workspace (opcional, para mantener compatibilidad)
    const workspaces = (result.docs || []).map((workspace) => {
      const members = Array.isArray(workspace.members) ? workspace.members : [];
      const currentMember = members.find((m) => m._id === userId) || null;
      return {
        ...workspace,
        currentMember,
      };
    });

    res.status(200).json({
      workspaces,
    });
  } catch (error) {
    console.error("Error al obtener workspaces por miembro:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};

const inviteUsersToWorkspaceController = async (req, res) => {
  try {
    let { emails, workspaceId, role } = req.body;

    // Normalizar: puede venir string con comas, o array (cada elemento también puede tener comas)
    if (typeof emails === "string") {
      emails = emails.split(",");
    } else if (Array.isArray(emails)) {
      emails = emails.flatMap((e) =>
        typeof e === "string" ? e.split(",") : []
      );
    }

    // Trim y filtrar vacíos
    emails = (emails || [])
      .map((e) => (typeof e === "string" ? e.trim() : ""))
      .filter((e) => e);

    if (!Array.isArray(emails) || emails.length === 0) {
      return res
        .status(400)
        .json({ message: "El campo 'emails' debe ser un array no vacío." });
    }

    if (!workspaceId) {
      return res.status(400).json({ message: "El campo 'workspaceId' es requerido." });
    }
    if (!role || typeof role !== "object") {
      return res
        .status(400)
        .json({ message: "El campo 'role' es requerido y debe ser un objeto." });
    }

    const accountsDb = await connectDB("db_accounts");
    const workspacesDb = await connectDB("db_workspaces");

    // Buscar cuentas por email
    const accountsRes = await accountsDb.find({
      selector: {
        email: { $in: emails },
      },
      fields: ["_id", "email", "nombre", "profileImage", "workspacesMember", "workspacesOwner"],
    });

    const foundAccounts = accountsRes.docs || [];
    const foundEmails = foundAccounts.map((a) => a.email);
    const notFoundEmails = emails.filter((e) => !foundEmails.includes(e));
    if (foundAccounts.length === 0) {
      return res.json({
        success: false,
        code: "NO_ACCOUNTS_FOUND",
        message: "No se encontraron cuentas para los emails proporcionados.",
        notFoundEmails,
      });
    }

    // Obtener workspace
    const workspaceDoc = await workspacesDb.get(workspaceId).catch((err) => {
      if (err.statusCode === 404) return null;
      throw err;
    });

    if (!workspaceDoc) {
      return res.status(404).json({ message: "Workspace no encontrado." });
    }

    // Asegurar que members exista como arreglo
    const existingMembers = Array.isArray(workspaceDoc.members)
      ? workspaceDoc.members
      : [];

    // Agregar cada cuenta (sin duplicados) con role y status pending
    const accountIdsToAdd = foundAccounts.map((acc) => acc._id);
    const newMembers = accountIdsToAdd.reduce((accum, accountId) => {
      const already = existingMembers.find((m) => m._id === accountId);
      if (!already) {
        const account = foundAccounts.find((a) => a._id === accountId);
        accum.push({
          _id: accountId,
          role,
          status: "pending",
          email: account?.email,
          name: account?.nombre,
          language: account?.language || "Español",
          profileImage: account?.profileImage,
        });
      }
      return accum;
    }, []);

    // Enviar invitaciones por cada nuevo miembro (no bloquea si alguna falla)
    if (newMembers.length > 0) {
      await Promise.allSettled(
        newMembers.map((member) =>
          sendWorkspacesInvitation(
            member.name,
            member.email,
            member.language || "Español",
            workspaceId
          )
        )
      );
    }

    // Actualizar cuentas de usuario para agregar el workspaceId a workspacesMember
    // y crear workspacesMember/workspacesOwner si no existen
    for (const account of foundAccounts) {
      let needsUpdate = false;
      let updatedAccount = { ...account };

      // Si no existen los campos, los creamos como arrays
      if (!Array.isArray(updatedAccount.workspacesMember)) {
        updatedAccount.workspacesMember = [];
        needsUpdate = true;
      }
    

      // Si el workspaceId no está en workspacesMember, lo agregamos
      if (!updatedAccount.workspacesMember.includes(workspaceId)) {
        updatedAccount.workspacesMember.push(workspaceId);
        needsUpdate = true;
      }

      // Solo actualizamos si hubo cambios
      if (needsUpdate) {
        // Necesitamos la _rev para actualizar, así que la buscamos si no está
        let dbAccount = account;
        if (!account._rev) {
          dbAccount = await accountsDb.get(account._id);
        }
        await accountsDb.insert({
          ...dbAccount,
          workspacesMember: updatedAccount.workspacesMember,
        });
      }
    }

    if (newMembers.length === 0) {
      return res.status(200).json({
        message:
          "No se agregaron nuevos miembros (puede que ya estén en el workspace).",
        workspace: workspaceDoc,
        notFoundEmails,
      });
    }

    // Actualizar workspace con los nuevos miembros
    const updatedWorkspace = {
      ...workspaceDoc,
      members: [...existingMembers, ...newMembers],
    };

    // Guardar con la misma _rev
    await workspacesDb.insert(updatedWorkspace);

    res.status(200).json({
      message: "Invitaciones creadas (pendientes) para los usuarios.",
      workspace: updatedWorkspace,
      notFoundEmails,
    });
  } catch (error) {
    console.error("Error al invitar usuarios al workspace:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};

const getMembersSelectedWorkspacesController = async (req, res) => {
  try {
    // const { userId } = req.params;
    const { user } = req;
    const { search } = req.query;
    const userId = user._id;

    if (!userId) {
      return res.status(400).json({ message: "Missing userId parameter." });
    }

    const accountsDb = await connectDB("db_accounts");
    const workspacesDb = await connectDB("db_workspaces");

    // Obtener la cuenta
    const account = await accountsDb.get(userId).catch((err) => {
      if (err.statusCode === 404) return null;
      throw err;
    });

    if (!account) {
      return res.status(404).json({ message: "Account not found." });
    }

    const { selectedWorkspace } = account;
    if (!selectedWorkspace) {
      return res
        .status(400)
        .json({ message: "User does not have a selectedWorkspace." });
    }

    // Obtener el workspace correspondiente
    const workspace = await workspacesDb
      .get(selectedWorkspace, {
        // Proyección para traer solo el campo members
        fields: ["members"],
      })
      .catch((err) => {
        if (err.statusCode === 404) return null;
        throw err;
      });
    if (!workspace) {
      return res.status(404).json({ message: "Selected workspace not found." });
    }

    const originalMembers = Array.isArray(workspace.members)
      ? workspace.members
      : [];

    // Guardar currentMember desde los datos originales
    const currentMember = originalMembers.find((m) => m._id === userId) || null;

    // Aplicar filtro de búsqueda sobre una copia
    let filteredMembers = originalMembers;
    if (search && search.trim() !== "") {
      const lowerSearch = search.toLowerCase();
      filteredMembers = originalMembers.filter(
        (m) =>
          (typeof m.name === "string" &&
            m.name.toLowerCase().includes(lowerSearch)) ||
          (typeof m.email === "string" &&
            m.email.toLowerCase().includes(lowerSearch))
      );
    }

    res
      .status(200)
      .json({ members: filteredMembers, accountInfo: currentMember });
  } catch (error) {
    console.error("Error fetching selected workspace members for user:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
const updateMemberStatusController = async (req, res) => {
  try {
    const { userId, workspaceId, type } = req.body;
    console.log('se esta ejecutando el updateMemberStatusController',type)

    if (!userId || !workspaceId || !type) {
      return res
        .status(400)
        .json({ message: "userId, workspaceId y type son requeridos." });
    }

    if (!["denied", "accepted"].includes(type)) {
      return res
        .status(400)
        .json({ message: "type debe ser 'denied' o 'accepted'." });
    }

    const workspacesDb = await connectDB("db_workspaces");
    const accountsDb = await connectDB("db_accounts");

    // Obtener workspace
    const workspaceDoc = await workspacesDb.get(workspaceId).catch((err) => {
      if (err.statusCode === 404) return null;
      throw err;
    });

    if (!workspaceDoc) {
      return res.status(404).json({ message: "Workspace no encontrado." });
    }

    const existingMembers = Array.isArray(workspaceDoc.members)
      ? workspaceDoc.members
      : [];

    const memberIndex = existingMembers.findIndex((m) => m._id === userId);
    if (memberIndex === -1) {
      return res
        .status(404)
        .json({ message: "Miembro no encontrado en el workspace." });
    }

    const updatedMembers = [...existingMembers];
    let shouldIncrement = false;
    if (type === "denied") {
      // Eliminar el usuario de los miembros del workspace
      updatedMembers.splice(memberIndex, 1);

      // --- También eliminar el workspace de la cuenta del usuario ---
      try {
        // Buscar la cuenta por userId
        const selector = {
          selector: {
            _id: userId
          },
          limit: 1
        };
        const result = await accountsDb.find(selector);
        let account = result.docs && result.docs.length > 0 ? result.docs[0] : null;

        if (account) {
          if (Array.isArray(account.workspacesMember)) {
            account.workspacesMember = account.workspacesMember.filter(id => id !== workspaceId);
          }
          // Actualizar la cuenta en la base de datos
          await accountsDb.insert({
            ...account,
            _rev: account._rev
          });
        } else {
          // Si no existe la cuenta, solo notificar
          console.warn("No se encontró la cuenta del usuario para actualizar workspacesMember.");
        }
      } catch (err) {
        console.error("Error al actualizar la cuenta del usuario al denegar:", err);
      }
    } else if (type === "accepted") {
      const member = { ...updatedMembers[memberIndex] };

      const wasPending = member.status === "pending";
      if ("status" in member) {
        delete member.status;
      }

      if (!member.memberSince) {
        member.memberSince = new Date().toISOString();
      }

      updatedMembers[memberIndex] = member;

      const historical = Array.isArray(workspaceDoc.historicalMembers)
        ? workspaceDoc.historicalMembers
        : [];

      if (!historical.includes(userId)) {
        shouldIncrement = true;
      }

      // --- Aquí se actualiza la cuenta del usuario en db_accounts ---
      try {
        // Buscar la cuenta por userId
        const selector = {
          selector: {
            _id: userId
          },
          limit: 1
        };
        const result = await accountsDb.find(selector);
        let account = result.docs && result.docs.length > 0 ? result.docs[0] : null;

        if (account) {
          if (!Array.isArray(account.workspacesMember)) {
            account.workspacesMember = [];
          }
          if (!account.workspacesMember.includes(workspaceId)) {
            account.workspacesMember.push(workspaceId);
          }
          // Actualizar la cuenta en la base de datos
          await accountsDb.insert({
            ...account,
            _rev: account._rev
          });
        } else {
          // Si no existe la cuenta, podrías crearla o solo notificar
          console.warn("No se encontró la cuenta del usuario para actualizar workspacesMember.");
        }
      } catch (err) {
        console.error("Error actualizando workspacesMember en la cuenta:", err);
        // No retornamos error, solo lo notificamos en consola
      }
      // --- Fin actualización db_accounts ---
    }

    // Preparar histórico (solo se agrega en accepted si no estaba)
    const newHistorical = Array.isArray(workspaceDoc.historicalMembers)
      ? [...workspaceDoc.historicalMembers]
      : [];

    if (type === "accepted" && !newHistorical.includes(userId)) {
      newHistorical.push(userId);
    }

    // Construir workspace actualizado
    const updatedWorkspace = {
      ...workspaceDoc,
      members: updatedMembers,
      historicalMembers: newHistorical,
      countMembers:
        typeof workspaceDoc.countMembers === "number"
          ? workspaceDoc.countMembers + (shouldIncrement ? 1 : 0)
          : shouldIncrement
            ? 1
            : 0,
    };

    await workspacesDb.insert(updatedWorkspace);

    res.status(200).json({
      message: "Actualización de miembro aplicada.",
      workspace: updatedWorkspace,
    });
  } catch (error) {
    console.error("Error actualizando el estado del miembro:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};


const deleteWorkspaceController = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    if (!workspaceId) {
      return res.status(400).json({ message: "Falta el parámetro workspaceId." });
    }

    const db = await connectDB("db_workspaces");

    // Contar la cantidad de workspaces existentes
    const allWorkspaces = await db.list({ include_docs: false });
    const totalWorkspaces = allWorkspaces.rows.length;

    if (totalWorkspaces <= 1) {
      return res.status(400).json({
        message: "No se puede eliminar el último workspace. Debe haber al menos uno."
      });
    }

    // Obtener el documento del workspace
    const doc = await db.get(workspaceId).catch((err) => {
      if (err.statusCode === 404) {
        return null;
      }
      throw err;
    });

    if (!doc) {
      return res.status(404).json({ message: "Workspace no encontrado." });
    }

    // --- Eliminar el workspaceId del campo workspacesMember de cada miembro ---
    const members = Array.isArray(doc.members) ? doc.members : [];
    const accountsDb = await connectDB("db_accounts");

    for (const member of members) {
      const memberId = member._id;
      if (!memberId) continue;

      // Buscar la cuenta del miembro
      const account = await accountsDb.get(memberId).catch((err) => {
        if (err.statusCode === 404) return null;
        throw err;
      });

      let debeActualizar = false;
      let newWorkspacesMember = account && Array.isArray(account.workspacesMember)
        ? account.workspacesMember.filter(id => id !== workspaceId)
        : undefined;
      let newWorkspacesOwner = account && Array.isArray(account.workspacesOwner)
        ? account.workspacesOwner.filter(id => id !== workspaceId)
        : undefined;

      // Verificar si hay cambios en workspacesMember
      if (
        account &&
        Array.isArray(account.workspacesMember) &&
        newWorkspacesMember.length !== account.workspacesMember.length
      ) {
        debeActualizar = true;
      }

      // Verificar si hay cambios en workspacesOwner
      if (
        account &&
        Array.isArray(account.workspacesOwner) &&
        newWorkspacesOwner.length !== account.workspacesOwner.length
      ) {
        debeActualizar = true;
      }

      if (account && debeActualizar) {
        await accountsDb.insert({
          ...account,
          workspacesMember: newWorkspacesMember !== undefined ? newWorkspacesMember : account.workspacesMember,
          workspacesOwner: newWorkspacesOwner !== undefined ? newWorkspacesOwner : account.workspacesOwner,
          _rev: account._rev
        });
      }
    }
    // --- Fin actualización de cuentas de miembros y owners ---

    // También eliminar el workspaceId del campo workspacesOwner del owner original (createdBy)
    if (doc.createdBy) {
      const ownerAccount = await accountsDb.get(doc.createdBy).catch((err) => {
        if (err.statusCode === 404) return null;
        throw err;
      });
      if (ownerAccount && Array.isArray(ownerAccount.workspacesOwner)) {
        const newWorkspacesOwner = ownerAccount.workspacesOwner.filter(id => id !== workspaceId);
        if (newWorkspacesOwner.length !== ownerAccount.workspacesOwner.length) {
          await accountsDb.insert({
            ...ownerAccount,
            workspacesOwner: newWorkspacesOwner,
            _rev: ownerAccount._rev
          });
        }
      }
    }

    // Eliminar el workspace
    await db.destroy(workspaceId, doc._rev);

    return res.status(200).json({ message: "Workspace eliminado exitosamente." });
  } catch (error) {
    console.error("Error al eliminar el workspace:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};
const getSelectedWorkspaceController = async (req, res) => {
  try {
    const { user } = req; // Suponiendo que `user` viene del middleware de autenticación
    const userId = user?._id;

    // Alternativa: si usas params en lugar del user del token
    // const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "Missing userId." });
    }

    const accountsDb = await connectDB("db_accounts");
    const workspacesDb = await connectDB("db_workspaces");

    // 1. Obtener la cuenta del usuario
    const account = await accountsDb.get(userId).catch((err) => {
      if (err.statusCode === 404) return null;
      throw err;
    });

    if (!account) {
      return res.status(404).json({ message: "Account not found." });
    }

    const { selectedWorkspace } = account;
    if (!selectedWorkspace) {
      return res.status(400).json({
        message: "User does not have a selected workspace.",
      });
    }

    // 2. Obtener el workspace completo usando el selectedWorkspace como _id
    const workspace = await workspacesDb.get(selectedWorkspace).catch((err) => {
      if (err.statusCode === 404) return null;
      throw err;
    });

    if (!workspace) {
      return res.status(404).json({ message: "Selected workspace not found in database." });
    }

  

    // 4. Retornar el workspace completo + información útil
    return res.status(200).json({
      workspace, // ← Todo el objeto del workspace
    });
  } catch (error) {
    console.error("Error fetching selected workspace:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
const updateMemberRoleController = async (req, res) => {
  try {
    const { workspaceId, memberId } = req.params;
    const { role } = req.body;

    // Validaciones
    if (!workspaceId || !memberId) {
      return res.status(400).json({
        message: "Missing workspaceId or memberId in URL parameters.",
      });
    }

    if (!role) {
      return res.status(400).json({
        message: "Missing role in request body.",
      });
    }

    const db = await connectDB("db_workspaces"); // Asume que tienes una función connectDB

    // 1. Obtener el workspace
    let workspace;
    try {
      workspace = await db.get(workspaceId);
    } catch (err) {
      if (err.statusCode === 404) {
        return res.status(404).json({ message: "Workspace not found." });
      }
      throw err;
    }

    // 2. Verificar que tenga miembros
    if (!Array.isArray(workspace.members)) {
      return res.status(400).json({ message: "Workspace has no members list." });
    }
console.log('memberId',memberId)
    // 3. Buscar y actualizar el miembro
    const memberIndex = workspace.members.findIndex(m => m._id === memberId);

    if (memberIndex === -1) {
      return res.status(404).json({ message: "Member not found in workspace." });
    }

    // Actualizar el rol
    workspace.members[memberIndex].role = role;
    workspace.updatedAt = new Date().toISOString(); // Opcional: actualizar timestamp

    // 4. Guardar el documento actualizado
    try {
      const response = await db.insert(workspace);
      return res.status(200).json({
        message: "Member role updated successfully.",
        rev: response.rev,
        workspaceId,
        memberId,
        role,
      });
    } catch (err) {
      console.error("Error saving updated workspace:", err);
      return res.status(500).json({ message: "Failed to save updated workspace." });
    }
  } catch (error) {
    console.error("Error in updateMemberRoleController:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};


const removeMemberFromWorkspaceController = async (req, res) => {
  try {
    const { workspaceId, memberId } = req.params;

    // Validaciones iniciales
    if (!workspaceId || !memberId) {
      return res.status(400).json({
        message: "Missing workspaceId or memberId in URL parameters.",
      });
    }

    const db = await connectDB("db_workspaces"); // Asume que tienes connectDB

    let workspace;
    try {
      workspace = await db.get(workspaceId);
    } catch (err) {
      if (err.statusCode === 404) {
        return res.status(404).json({ message: "Workspace not found." });
      }
      throw err;
    }

    // Verificar que el campo `members` exista y sea un array
    if (!Array.isArray(workspace.members)) {
      return res.status(400).json({ message: "Invalid members list." });
    }

    // Buscar el índice del miembro
    const memberIndex = workspace.members.findIndex(m => m._id === memberId);

    if (memberIndex === -1) {
      return res.status(404).json({ message: "Member not found in workspace." });
    }

    // ⚠️ Opcional: Evitar eliminar al creador del workspace
    if (workspace.createdBy === memberId) {
      return res.status(400).json({
        message: "Cannot remove the creator of the workspace.",
      });
    }

    // Eliminar al miembro del array
    workspace.members.splice(memberIndex, 1);
    workspace.updatedAt = new Date().toISOString();

    // Guardar el documento actualizado
    try {
      const response = await db.insert(workspace);
      return res.status(200).json({
        message: "Member removed successfully.",
        rev: response.rev,
        workspaceId,
        memberId,
      });
    } catch (err) {
      console.error("Error saving updated workspace:", err);
      return res.status(500).json({ message: "Failed to save changes." });
    }
  } catch (error) {
    console.error("Error in removeMemberFromWorkspaceController:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};


module.exports = {
  createWorkspaceController: catchedAsync(createWorkspaceController),
  getWorkspacesByMemberController: catchedAsync(
    getWorkspacesByMemberController
  ),
  inviteUsersToWorkspaceController: catchedAsync(
    inviteUsersToWorkspaceController
  ),
  getMembersSelectedWorkspacesController: catchedAsync(
    getMembersSelectedWorkspacesController
  ),
  updateMemberStatusController: catchedAsync(updateMemberStatusController),
  updateWorkspaceController: catchedAsync(updateWorkspaceController),
  deleteWorkspaceController: catchedAsync(deleteWorkspaceController),
  getSelectedWorkspaceController: catchedAsync(getSelectedWorkspaceController),
  updateMemberRoleController: catchedAsync(updateMemberRoleController),
  removeMemberFromWorkspaceController: catchedAsync(removeMemberFromWorkspaceController),
};
