import { API_PATH, header, headerGet } from "../headers";

class Lesson {
  static getAllLessons = async (page = 0, size = 30, moduleId = 0, name = "") => {
    let url = `${API_PATH}lesson/get/admin?page=${page}&size=${size}`;

    if (moduleId  !== 0) {
      url += `&moduleId=${moduleId}`;
    }

    if (name !== "") {
      url += `&name=${encodeURIComponent(name)}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: headerGet,
    });
    return response.json();
  };

  // Create User
  static async createLesson(data) {
    const response = await fetch(`${API_PATH}lesson/create`, {
      method: "POST",
      headers: header,
      body: JSON.stringify(data),
    });
    return response.json();
  }

  // delete one version
  static deleteLesson = async (id) => {
    const url = `${API_PATH}lesson/delete?lessonId=${id}`;
    const response = await fetch(url, {
      method: "DELETE",
      headers: headerGet,
    });
    return response.json();
  };

  // update lesson
  static updateLesson = async (data) => {
    const url = `${API_PATH}lesson/update`;

    const response = await fetch(url, {
      method: "PUT",
      headers: header,
      body: JSON.stringify(data),
    });
    return response.json();
  };
}

export { Lesson };
