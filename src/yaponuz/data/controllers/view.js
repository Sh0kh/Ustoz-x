import { API_PATH, header, headerGet, headerPATCH } from "../headers";

class View {
  static async getAllView(page, size, count, data) {
    const url = API_PATH + `view/get/all?count=${count}&data=${data}&page=${page}&size=${size}`;
    const response = await fetch(url, {
      method: "GET",
      headers: headerGet,
    });
    return response.json();
  }
}

export { View };
