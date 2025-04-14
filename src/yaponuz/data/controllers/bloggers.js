import { API_PATH, headerGet, header } from "../headers";

class Bloggers {
  // Get All Bloggers
  static getAllBloggers = async () => {
    const url = `${API_PATH}bloggers/get/all/admin`;
    const response = await fetch(url, {
      method: "GET",
      headers: headerGet,
    });
    return response.json();
  };

  // Add new Blogger
  static addBlogger = async (data) => {
    const url = `${API_PATH}bloggers/add`;
    const response = await fetch(url, {
      method: "POST",
      headers: header,
      body: JSON.stringify(data),
    });
    return response.json();
  };

  // Update the Blogger
  static updateBlogger = async (data) => {
    const url = `${API_PATH}bloggers/update`;
    const response = await fetch(url, {
      method: "PUT",
      headers: header,
      body: JSON.stringify(data),
    });
    return response.json();
  };
}

export { Bloggers };
