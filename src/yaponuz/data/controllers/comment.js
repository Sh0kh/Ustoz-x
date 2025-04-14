import { API_PATH, header, headerGet } from "../headers";

class Comment {
  static async getAllComment(page, size, category) {
    const url = `${API_PATH}comment/get/all?page=${page}&size=${size}&category=${category}`;
    const headers = {
      method: "GET",
      headers: headerGet,
    };
    const response = await fetch(url, headers);
    return response.json();
  }
}

export { Comment };
