import { API_PATH, headerGet, header } from "../headers";

class Theme {
  // get all Themes
  static getAllTheme = async () => {
    const url = `${API_PATH}edu/theme/get`;
    const response = await fetch(url, {
      method: "GET",
      headers: headerGet,
    });
    return response.json();
  };

  // create new Theme
  static createTheme = async (data) => {
    const url = `${API_PATH}edu/theme/create`;
    const response = await fetch(url, {
      method: "POST",
      headers: header,
      body: JSON.stringify(data),
    });
    return response.json();
  };

  // delete one Theme
  static deleteTheme = async (id) => {
    const url = `${API_PATH}edu/theme/delete/one?id=${id}`;
    const response = await fetch(url, {
      method: "DELETE",
      headers: headerGet,
    });
    return response.json();
  };

  // get one Theme
  static getOneTheme = async (id) => {
    const url = `${API_PATH}Theme/check/get-one?id=${id}`;
    const response = await fetch(url, {
      method: "GET",
      headers: headerGet,
    });
    return response.json();
  };

  // update Theme
  static updateTheme = async (data) => {
    const url = `${API_PATH}edu/theme/update`;
    const response = await fetch(url, {
      method: "PUT",
      headers: header,
      body: JSON.stringify(data),
    });
    return response.json();
  };
}

export { Theme };
