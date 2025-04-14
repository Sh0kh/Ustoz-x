import { API_PATH, headerGet, header } from "../headers";

class Version {
  // get all versions
  static getAllVersion = async (page, size) => {
    const url = `${API_PATH}version/check/all?page=${page}&size=${size}`;
    const response = await fetch(url, {
      method: "GET",
      headers: headerGet,
    });
    return response.json();
  };

  // create new version
  static createVersion = async (data) => {
    const url = `${API_PATH}version/check/create`;
    const response = await fetch(url, {
      method: "POST",
      headers: header,
      body: JSON.stringify(data),
    });
    return response.json();
  };

  // delete one version
  static deleteVersion = async (id) => {
    const url = `${API_PATH}version/check/delete?id=${id}`;
    const response = await fetch(url, {
      method: "DELETE",
      headers: headerGet,
    });
    return response.json();
  };

  // get one version
  static getOneVersion = async (id) => {
    const url = `${API_PATH}version/check/get-one?id=${id}`;
    const response = await fetch(url, {
      method: "GET",
      headers: headerGet,
    });
    return response.json();
  };

  // update version
  static updateVersion = async (id, data) => {
    const url = `${API_PATH}version/check/update?id=${id}`;
    const response = await fetch(url, {
      method: "PUT",
      headers: header,
      body: JSON.stringify(data),
    });
    return response.json();
  };
}

export { Version };
