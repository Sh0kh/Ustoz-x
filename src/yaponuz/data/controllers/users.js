import { API_PATH, header, headerGet } from "../headers";

class Users {
  static async getUsers(page, size, firstName, lastName, phoneNumber,) {
    let url = `${API_PATH}users?page=${page}&size=${size}&firstName=${firstName}&lastName=${lastName}&accountType=STUDENT`;
    // let url = `${API_PATH}users?page=${page}&size=${size}&firstName=${firstName}&lastName=${lastName}&accountType=STUDENT&groupId=${groupId}`;
    if (phoneNumber !== "") {
      url += `&phoneNumber=${phoneNumber.replace("+", "")}`;
    }
    const response = await fetch(url, {
      method: "GET",
      headers: headerGet,
    });
    return response.json();
  }
  static async getUsersAttendance(page, size, firstName, lastName, phoneNumber, groupId) {
    let url = `${API_PATH}users?page=${page}&size=${size}&firstName=${firstName}&lastName=${lastName}&accountType=STUDENT&groupId=${groupId}`;
    if (phoneNumber !== "") {
      url += `&phoneNumber=${phoneNumber.replace("+", "")}`;
    }
    const response = await fetch(url, {
      method: "GET",
      headers: headerGet,
    });
    return response.json();
  }

  // http://ec2-54-238-164-38.ap-northeast-1.compute.amazonaws.com:7714/sos/api/users/ put method and has body  data
  static async updateUser(data) {
    const response = await fetch(`${API_PATH}users/edit`, {
      method: "PUT",
      headers: header,
      body: JSON.stringify(data),
    });
    return response.json();
  }

  // http://ec2-54-238-164-38.ap-northeast-1.compute.amazonaws.com:7714/sos/api/users/10 getOneUser
  static async getOneUser(userId) {
    const response = await fetch(`${API_PATH}users/${userId}`, {
      method: "GET",
      headers: headerGet,
    });
    return response.json();
  }

  // http://ec2-54-238-164-38.ap-northeast-1.compute.amazonaws.com:7714/sos/api/users/by-id/432f45b44c432414d2f97df0e5743
  static async getUserByHashId(userId) {
    const response = await fetch(`${API_PATH}users/by-id/${userId}`, {
      method: "GET",
      headers: headerGet,
    });
    return response.json();
  }

  static async getReferealByID(userId) {
    const response = await fetch(`${API_PATH}referral/get/by/userid?page=0&size=30&userId=${userId}`, {
      method: "GET",
      headers: headerGet,
    });
    return response.json();
  }

  static async getAdreesByID(userId) {
    const response = await fetch(`${API_PATH}users/get/one/address?studentId=${userId}`, {
      method: "GET",
      headers: headerGet,
    });
    return response.json();
  }
  static async getEducation(userId) {
    const response = await fetch(`${API_PATH}users/get/one/education?studentId=${userId}`, {
      method: "GET",
      headers: headerGet,
    });
    return response.json();
  }

  // http://ec2-54-238-164-38.ap-northeast-1.compute.amazonaws.com:7714/sos/api/users/delete-account/23 deleteUser
  static async deleteUser(id) {
    const response = await fetch(`${API_PATH}users/delete-account/${id}`, {
      method: "DELETE",
      headers: headerGet,
    });
    return response.json();
  }

  // http://ec2-54-238-164-38.ap-northeast-1.compute.amazonaws.com:7714/sos/api/users/get/me
  static async getMe() {
    const response = await fetch(`${API_PATH}users/get/me`, {
      method: "GET",
      headers: headerGet,
    });
    return response.json();
  }

  // Create User
  static async createUser(data) {
    const response = await fetch(`${API_PATH}users/admin`, {
      method: "POST",
      headers: header, // Вызов функции
      body: JSON.stringify(data),
    });
    return response.json();
  }
}

export { Users };
