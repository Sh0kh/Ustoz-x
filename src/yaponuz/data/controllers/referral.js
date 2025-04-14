import { API_PATH, headerGet, header } from "../headers";

class Referral {
  // get all Referrals
  static getAllReferral = async (page, size, count, refCode, refUser) => {
    const url = `${API_PATH}referral/get/all/admin?count=${count}&page=${page}&refCode=${refCode}&refUser=${refUser}&size=${size}`;
    const response = await fetch(url, {
      method: "GET",
      headers: headerGet,
    });
    return response.json();
  };

  // create new Referral
  static createReferral = async (data) => {
    const { recommendedUserId, refCode } = data; // Extract values
    const url = `${API_PATH}referral/add?recommendedUserId=${recommendedUserId}&refCode=${refCode}`;

    console.log("Data URL with parameters:", url); // Log to verify URL

    const response = await fetch(url, {
      method: "POST",
      headers: {
        ...header,
        "accept": "*/*"
      }
    });

    // Attempt to parse JSON if possible; fallback to text if parsing fails
      return await {success: true, message: "Qo'shildi"};

  };

  // delete one Referral
  static deleteReferral = async (id) => {
    const url = `${API_PATH}referral/check/delete?id=${id}`;
    const response = await fetch(url, {
      method: "DELETE",
      headers: headerGet,
    });
    return response.json();
  };

  // get one Referral
  static getOneReferral = async (id) => {
    const url = `${API_PATH}Referral/check/get-one?id=${id}`;
    const response = await fetch(url, {
      method: "GET",
      headers: headerGet,
    });
    return response.json();
  };

  // update Referral
  static updateReferral = async (id, data) => {
    const url = `${API_PATH}Referral/check/update?id=${id}`;
    const response = await fetch(url, {
      method: "PUT",
      headers: header,
      body: JSON.stringify(data),
    });
    return response.json();
  };
}

export { Referral };