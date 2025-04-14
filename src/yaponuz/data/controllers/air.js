import { API_PATH, header, headerGet } from "../headers";

class Air {
  // http://ec2-54-238-164-38.ap-northeast-1.compute.amazonaws.com:7714/sos/api/air_ticket/all
  static async getAirtickets(page, size, active, title, context, priceFrom, priceTo) {
    const response = await fetch(
      `${API_PATH}air_ticket/all?page=${page}&size=${size}&active=${active}&title=${title}&context=${context}&priceFrom=${priceFrom}&priceTo=${priceTo}`,
      {
        method: "GET",
        headers: headerGet,
      }
    );
    return response.json();
  }

  static async getAllCategory(page, size, active, title, context, priceFrom, priceTo) {
    const response = await fetch(
      `${API_PATH}air_ticket/all?page=${page}&size=${size}&active=${active}&title=${title}&context=${context}&priceFrom=${priceFrom}&priceTo=${priceTo}`,
      {
        method: "GET",
        headers: headerGet,
      }
    );
    return response.json();
  }

  // http://ec2-54-238-164-38.ap-northeast-1.compute.amazonaws.com:7714/sos/api/air_ticket/create
  static async createAiricket(data) {
    const response = await fetch(`${API_PATH}air_ticket/create`, {
      method: "POST",
      headers: header,
      body: JSON.stringify(data),
    });
    return response.json();
  }

  // http://ec2-54-238-164-38.ap-northeast-1.compute.amazonaws.com:7714/sos/api/air_ticket/delete?id=23&userId=2
  static async deleteAirticket(airticketId, userId) {
    const response = await fetch(
      `${API_PATH}air_ticket/delete?id=${airticketId}&userId=${userId}`,
      {
        method: "DELETE",
        headers: headerGet,
      }
    );
    return response.json();
  }

  // http://ec2-54-238-164-38.ap-northeast-1.compute.amazonaws.com:7714/sos/api/air_ticket/update
  static async updateAirticket(data) {
    const response = await fetch(`${API_PATH}air_ticket/update`, {
      method: "PUT",
      headers: header,
      body: JSON.stringify(data),
    });
    return response.json();
  }

  // http://ec2-54-238-164-38.ap-northeast-1.compute.amazonaws.com:7714/sos/api/air_ticket/one?id=24
  static async getOneAirticket(airticketId) {
    const response = await fetch(`${API_PATH}air_ticket/one?id=${airticketId}`, {
      method: "GET",
      headers: headerGet,
    });
    return response.json();
  }
}

export { Air };
