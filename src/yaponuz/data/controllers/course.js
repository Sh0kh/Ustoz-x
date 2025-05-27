import { API_PATH, headerGet, header } from "../headers";

class Course {
  // get all courses
  static getAllCourses = async (page, size) => {
    const url = `${API_PATH}course/admin/get/all?page=${page}&size=${size}`;
    const response = await fetch(url, {
      method: "GET",
      headers: headerGet,
    });
    return response.json();
  };
  static getOneCourse = async (id) => {
    const url = `${API_PATH}course/get/one?courseId=${id}`;
    const response = await fetch(url, {
      method: "GET",
      headers: headerGet,
    });
    return response.json();
  };

  // create new course
  static createCourse = async (data) => {
    const url = `${API_PATH}course/create`;
    console.log(data, "salom");
    const response = await fetch(url, {
      method: "POST",
      headers: header,
      body: JSON.stringify(data),
    });
    return response.json();
  };

  // delete one course
  static deleteCourse = async (id) => {
    const url = `${API_PATH}course/delete/one?courseId=${id}`;
    const response = await fetch(url, {
      method: "DELETE",
      headers: headerGet,
    });
    return response.json();
  };

  // update course
  static updateCourse = async (data) => {
    const url = `${API_PATH}course/update`;
    const response = await fetch(url, {
      method: "PUT",
      headers: header,
      body: JSON.stringify(data),
    });
    return response.json();
  };
}

export { Course };
