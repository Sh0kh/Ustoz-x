import { API_PATH, headerGet, header } from "../headers";

class Notification {
  // get all Notifications
  static getAllNotification = async (page, size, studentId) => {
    const url = `${API_PATH}notification/get?page=${page}&size=${size}&studentId=${studentId}`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: headerGet,
      });
      return response.json();
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  };

  // create new Notification
  static createNotification = async (data) => {
    const url = `${API_PATH}notification/send`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: header,
        body: JSON.stringify(data),
      });
      return response.json();
    } catch (error) {
      console.error("Error creating notification:", error);
      throw error;
    }
  };

  // delete one Referral
  static deleteReferral = async (id) => {
    const url = `${API_PATH}referral/check/delete?id=${id}`;
    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: headerGet,
      });
      return response.json();
    } catch (error) {
      console.error("Error deleting referral:", error);
      throw error;
    }
  };

  // get one Referral
  static getOneReferral = async (id) => {
    const url = `${API_PATH}Referral/check/get-one?id=${id}`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: headerGet,
      });
      return response.json();
    } catch (error) {
      console.error("Error fetching referral:", error);
      throw error;
    }
  };

  // update Referral
  static updateReferral = async (id, data) => {
    const url = `${API_PATH}Referral/check/update?id=${id}`;
    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: header,
        body: JSON.stringify(data),
      });
      return response.json();
    } catch (error) {
      console.error("Error updating referral:", error);
      throw error;
    }
  };
}

export { Notification };
