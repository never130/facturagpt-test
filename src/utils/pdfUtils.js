import apiBackend from "../apiBackend"; 


export const handleFileUpload = async (file, location,nameDoc,id,type,infoBill,currentPath) => {


  const formData = new FormData();
  formData.append("pdf", file);
  formData.append("location", location);
  formData.append("nameDoc", nameDoc);

  formData.append("contactId", id);
  formData.append("type", type);
  formData.append("infoBill", JSON.stringify(infoBill));
  formData.append("currentPath", currentPath);


  try {
    const user = localStorage.getItem("user");
    if (!user) return;

    const userJson = JSON.parse(user);
    const token = userJson?.accessToken;
    if (!token) return;

    const response =  await apiBackend.post("/user/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Error al subir archivo:", error);
    return { error: error.message }; 
  }
};

export const fetchPDF = async (currentId) => {
  if (!currentId) return null;

  try {
    const user = localStorage.getItem("user");
    if (!user) return null;

    const userJson = JSON.parse(user);
    const token = userJson?.accessToken;
    if (!token) return null;

    const response = await apiBackend.get(`/user/get-file-pdf/${currentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/pdf",
      },
      responseType: "blob", 
    });

    return URL.createObjectURL(response.data);
  } catch (error) {
    console.error("Error al obtener el PDF:", error);
    return null;
  }
};
export const getUniqueFileWithPDFBase64 = async (currentId) => {
  if (!currentId) return null;

  try {
    const user = localStorage.getItem("user");
    if (!user) return null;

    const userJson = JSON.parse(user);
    const token = userJson?.accessToken;
    if (!token) return null;

    const response = await apiBackend.get(`/user/getUniqueFileWithPdfBase64/${currentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/pdf",
      },
    });

    return response;
  } catch (error) {
    console.error("Error al obtener el PDF:", error);
    return null;
  }
};

export const getPdfBase64 = async (pdfId) => {
  if (!pdfId) return null;

  try {
    const user = localStorage.getItem("user");
    if (!user) return null;

    const userJson = JSON.parse(user);
    const token = userJson?.accessToken;
    if (!token) return null;

    const response = await apiBackend.get(`/user/getPdfBase64/${pdfId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/pdf",
      },
    });

    return response;
  } catch (error) {
    console.error("Error al obtener el PDF:", error);
    return null;
  }
};

export const fetchMetadataPDF = async (currentId) => {
  if (!currentId) return null;

  try {
    const user = localStorage.getItem("user");
    if (!user) return null;

    const userJson = JSON.parse(user);
    const token = userJson?.accessToken;
    if (!token) return null;

    const response = await apiBackend.get(`/user/get-metadata-file-pdf/${currentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/pdf",
      },
    });
    return response.data
  } catch (error) {
    console.error("Error al obtener el PDF:", error);
    return null;
  }
};


export const weighFolder = async (currentPath) => {
  if (!currentPath) return false;
  try {
    const user = localStorage.getItem("user");
    if (!user) return false;

    const userJson = JSON.parse(user);
    const token = userJson?.accessToken;
    if (!token) return false;

    const encodedPath = encodeURIComponent(currentPath);

    const response = await apiBackend.get(`/user/weigh-folder/${encodedPath}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data ;
  } catch (error) {
    console.error("Error al eliminar el PDF:", error);
    return false;
  }
};
export const moveManyFileLocally = async ({initialPath,destinationPath}) => {
  if (!destinationPath) return false;
  console.log('esto es destinationPath', destinationPath)
  console.log('esto es initialPath', initialPath)
  try {
    const user = localStorage.getItem("user");
    if (!user) return false;

    const userJson = JSON.parse(user);
    const token = userJson?.accessToken;
    if (!token) return false;

    const encodedInitialPath = encodeURIComponent(initialPath);
    const encodedDestinationPath = encodeURIComponent(destinationPath);

    const response = await apiBackend.post(`/user/move-many-file-locally`, {
      initialPath,
      destinationPath
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data ;
  } catch (error) {
    console.error("Error al eliminar el PDF:", error);
    return false;
  }
};

export const deletePDF = async (Key) => {
  if (!Key) return false;

  try {
    const user = localStorage.getItem("user");
    if (!user) return false;

    const userJson = JSON.parse(user);
    const token = userJson?.accessToken;
    if (!token) return false;

    await apiBackend.delete(`/user/delete-file-pdf/${Key}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return true; 
  } catch (error) {
    console.error("Error al eliminar el PDF:", error);
    return false;
  }
};

export const deleteManyPDF = async (currentPath) => {
  if (!currentPath) return false;
  try {
    const user = localStorage.getItem("user");
    if (!user) return false;

    const userJson = JSON.parse(user);
    const token = userJson?.accessToken;
    if (!token) return false;

    const encodedPath = encodeURIComponent(currentPath);

      await apiBackend.delete(`/user/delete-many-file-pdf/${encodedPath}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return true; 
  } catch (error) {
    console.error("Error al eliminar el PDF:", error);
    return false;
  }
};

export const handleFileUpdate = async (metadata) => {
 try {
    const user = localStorage.getItem("user");
    if (!user) return;

    const userJson = JSON.parse(user);
    const token = userJson?.accessToken;
    if (!token) return;

    const dataToSend = { ...metadata };
    if (dataToSend.destinationKey) {
      dataToSend.destinationKey = encodeURIComponent(dataToSend.destinationKey);
    }

    const response =  await apiBackend.post("/user/updateFile", dataToSend, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Error al subir archivo:", error);
    return { error: error.message }; 
  }
};
