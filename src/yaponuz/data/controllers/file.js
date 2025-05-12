import axios from "axios";
import { API_PATH, headerFile, headerGet } from "../headers";

class FileController {
  static uploadFile = async (file, category, userId) => {
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
        userId: userId,
      },
    };

    try {
      const response = await axios.post(url, formData, config);
      return response.data;
    } catch (error) {
      console.error("Error uploading file:", error.message);
    }
  };

  static getAllFiles = async (page, size) => {
    const url = `${API_PATH}file/get/all?page=${page}&size=${size}`;
    const response = await fetch(url, {
      method: "GET",
      headers: headerGet,
    });
    return response.json();
  };

  static getStudentFiles = async (id) => {
    const url = `${API_PATH}user/info/files/get/one?studentId=${id}`;
    const response = await fetch(url, {
      method: "GET",
      headers: headerGet,
    });
    return response.json();
  };

  static editFile = async (data) => {
    const url = `${API_PATH}user/info/files/edit`;

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        ...headerGet,
        "Content-Type": "application/json", 
      },
      body: JSON.stringify(data), 
    });

    return response.json();
  };

  static EditFileType = async (data) => {
    const url = `${API_PATH}file/update/fileType?fileType=${data?.fileType}&id=${data?.id}`;

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        ...headerGet,
        "Content-Type": "application/json", 
      },
      body: JSON.stringify(data), 
    });

    return response.json();
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

  static deleteFile = async (fileHashId, userId) => {
    const url = `${API_PATH}file/delete?fileHashId=${fileHashId}&userId=${userId}`;
    const response = await fetch(url, {
      method: "DELETE",
      headers: headerGet,
    });
    return response.json();
  };
}

export { FileController };
