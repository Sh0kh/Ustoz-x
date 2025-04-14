import { API_PATH, header, headerGet } from "../headers";

class Other {
  // other/service/all
  static async getAllOthers(page, size, active) {
    const response = await fetch(
      `${API_PATH}other/service/all?page=${page}&size=${size}&active=${active}`,
      {
        method: "GET",
        headers: headerGet,
      }
    );
    return response.json();
  }

  static async getOne(serviceId) {
    const response = await fetch(`${API_PATH}other/service/one?serviceId=${serviceId}`, {
      method: "GET",
      headers: headerGet,
    });
    return response.json();
  }

  // other/service/create
  static async createOther(data) {
    const response = await fetch(`${API_PATH}other/service/create`, {
      method: "POST",
      headers: header,
      body: JSON.stringify(data),
    });
    return response.json();
  }

  static async deleteOther(serviceId, userId) {
    const response = await fetch(
      `${API_PATH}other/service/delete?serviceId=${serviceId}&userId=${userId}`,
      {
        method: "DELETE",
        headers: headerGet,
      }
    );

    return response.json();
  }

  static async updateOther(data) {
    const response = await fetch(`${API_PATH}other/service/update`, {
      method: "PUT",
      headers: header,
      body: JSON.stringify(data),
    });
    return response.json();
  }
}

export { Other };
