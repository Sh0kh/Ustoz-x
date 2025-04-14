import { API_PATH, headerGet, header } from "../headers";

function formatDate(inputDate) {
  const date = new Date(inputDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

class Module {
  // get all groups
  static getAllModule = async (page, size) => {
    const url = `${API_PATH}module/get/admin?page=${page}&size=${size}`;
    const response = await fetch(url, {
      method: "GET",
      headers: headerGet,
    });
    return response.json();
  };

  static getModuleById = async (id) => {
    const url = `${API_PATH}module/get?courseId=${id}`;
    const response = await fetch(url, {
      method: "GET",
      headers: headerGet,
    });
    return response.json();
  };

  // create new group
  static createModule = async (data) => {
    console.log(data);
    const url = `${API_PATH}module/create`;
    const response = await fetch(url, {
      method: "POST",
      headers: header,
      body: JSON.stringify(data),
    });
    return response.json();
  };

  // delete one version
  static deleteModul = async (id) => {
    const url = `${API_PATH}module/delete?moduleId=${id}`;
    const response = await fetch(url, {
      method: "DELETE",
      headers: headerGet,
    });
    return response.json();
  };

  static updateModule = async (data) => {
    const url = `${API_PATH}module/update`;

    const response = await fetch(url, {
      method: "PUT",
      headers: header,
      body: JSON.stringify(data),
    });
    return response.json();
  };
}

export { Module };
