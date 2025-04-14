import { API_PATH, header, headerGet } from "../headers";

class Schools {
  // http://ec2-54-238-164-38.ap-northeast-1.compute.amazonaws.com:7714/sos/api/school-agency/all?page=0&size=50
  static async getSchools(page, size, active, searchText) {
    const response = await fetch(
      `${API_PATH}school-agency/all?page=${page}&size=${size}&active=${active}`,
      {
        method: "GET",
        headers: headerGet,
      }
    );
    return response.json();
  }

  // http://ec2-54-238-164-38.ap-northeast-1.compute.amazonaws.com:7714/sos/api/school-agency/create
  static async createSchool(data) {
    const response = await fetch(`${API_PATH}school-agency/create`, {
      method: "POST",
      headers: header,
      body: JSON.stringify(data),
    });
    return response.json();
  }

  // http://ec2-54-238-164-38.ap-northeast-1.compute.amazonaws.com:7714/sos/api/school-agency/delete?agencyId=21&userId=2
  static async deleteSchool(agencyId, userId) {
    const response = await fetch(
      `${API_PATH}school-agency/delete?agencyId=${agencyId}&userId=${userId}`,
      {
        method: "DELETE",
        headers: headerGet,
      }
    );
    return response.json();
  }

  // http://ec2-54-238-164-38.ap-northeast-1.compute.amazonaws.com:7714/sos/api/school-agency/one?id=20
  static async getSchool(agencyId) {
    const response = await fetch(`${API_PATH}school-agency/one?id=${agencyId}`, {
      method: "GET",
      headers: headerGet,
    });
    return response.json();
  }

  // http://ec2-54-238-164-38.ap-northeast-1.compute.amazonaws.com:7714/sos/api/school-agency/update
  static async updateSchool(data) {
    const response = await fetch(`${API_PATH}school-agency/update`, {
      method: "PUT",
      headers: header,
      body: JSON.stringify(data),
    });
    return response.json();
  }
}

export { Schools };
