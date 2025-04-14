import { API_PATH, headerGet } from "../headers";

class Guest {
  static deleteGuest = async (id) => {
    const url = `${API_PATH}admin/delete/guest/users?id=${id}`;
    const response = await fetch(url, {
      method: "DELETE",
      headers: headerGet,
    });
    return response.json();
  };

  static getFilePath = async (page, size) => {
    const url = `${API_PATH}admin/get/file/path?page=${page}&size=${size}`;
    const response = await fetch(url, {
      method: "GET",
      headers: headerGet,
    });
    return response.json();
  };

  static getAllGuest = async (page, size) => {
    const url = `${API_PATH}admin/get/guest/users?page=${page}&size=${size}`;
    const response = await fetch(url, {
      method: "GET",
      headers: headerGet,
    });
    return response.json();
  };
}

export { Guest };
