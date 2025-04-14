import axios from "axios";
import { API_PATH, headerFile, headerGet } from "../headers";

class File {
  static uploadFile = async (file, category, userHashId) => {
    const url = API_PATH + "file/upload";

    const formData = new FormData();
    formData.append("file", file);

    const config = {
      headers: {
        ...headerFile,
        "Content-Type": "multipart/form-data",
      },
      params: {
        category: category,
        userHashId: userHashId,
      },
    };

    try {
      const response = await axios.post(url, formData, config);
      return response.data;
    } catch (error) {
      console.error("Error uploading file:", error.message);
    }
  };

  static getOnePhoto = async (hashId) => {
    const url = API_PATH + "file/view/one/photo?hashId=" + hashId;
    const response = await fetch(url, {
      method: "GET",
      headers: headerGet,
    });

    if (!response.ok) {
      return response;
    }

    const blob = await response.blob();
    const urlObject = URL.createObjectURL(blob);

    return urlObject;
  };

  static getAllFiles = async (page, size) => {
    const url = `${API_PATH}group/get/all/admin?page=${page}&size=${size}`;
    const response = await fetch(url, {
      method: "GET",
      headers: headerGet,
    });
    return response.json();
  };
}

export { File };
