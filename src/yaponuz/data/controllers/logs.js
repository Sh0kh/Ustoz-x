import { API_PATH, headerGet, header } from "../headers";

class Logs {
  static getAllLogs = async (page, size) => {
    const url = `${API_PATH}logs/all/logs/admin?page=${page}&size=${size}`;
    const response = await fetch(url, {
      method: "GET",
      headers: headerGet,
    });

    const json = await response.json();
    return json;
  };
  static getAllTrashLogs = async (page, size) => {
    const url = `${API_PATH}logs/all/trash/user/admin?page=${page}&size=${size}`;
    const response = await fetch(url, {
      method: "GET",
      headers: headerGet,
    });

    const json = await response.json();
    return json;
  };
}

export { Logs };
