import { API_JUST, header, headerGet, headerPATCH } from "../headers";

class SMS {
  static async getAllSMS(page, size) {
    const url = API_JUST + `sms/all/sms?page=${page}&size=${size}`;
    const response = await fetch(url, {
      method: "GET",
      headers: headerGet,
    });
    return response.json();
  }

  static async smsTest(data) {
    const url = API_JUST + "sms/send/sms";
    const response = await fetch(url, {
      method: "POST",
      headers: header,
      body: JSON.stringify(data),
    });

    const json = await response.json();

    return json;
  }
  static async sendSMS(data) {
    const url = API_JUST + "sms/send/sms";
    const response = await fetch(url, {
      method: "POST",
      headers: header,
      body: JSON.stringify(data),
    });

    const json = await response.json();

    return json;
  }

  static async refreshToken() {
    const url = API_JUST + "sms/refresh/token";
    const response = await fetch(url, {
      method: "GET",
      headers: headerPATCH,
    });

    const json = await response.json();

    return json;
  }
}

export { SMS };
