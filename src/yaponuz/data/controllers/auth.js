import { API_PATH, USER_HASH_ID, AUTH_TOKEN } from "../headers";

class GetAuth {
  static getAuthToken = () => {
    return localStorage.getItem(AUTH_TOKEN);
  };

  static getUserHashId = () => {
    return localStorage.getItem(USER_HASH_ID);
  };

  static getUserId = () => {
    return localStorage.getItem("userId");
  };

  // Add a new method to check if the token is expired
  static isTokenExpired = () => {
    const expiryDate = localStorage.getItem("expiryDateYaponEdu");
    return !expiryDate || new Date().getTime() > parseInt(expiryDate);
  };
}

class AuthLogin {
  static login = async (data) => {
    const url = API_PATH + "auth/login/web";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const json = await response.json();

    if (json.status) {
      localStorage.setItem(AUTH_TOKEN, json?.token);
      localStorage.setItem("userId", json?.object?.id);
      if (json?.object?.accountType === "ADMIN") {
        localStorage.setItem("user", "SADNIJASIDASNA");
      } else if (json?.object?.accountType === "TEACHER") {
        localStorage.setItem("user", "SAFASOFJQWEDWT");
      } else if (json?.object?.accountType === "SUPPORT_CENTER") {
        localStorage.setItem("user", "QWPFOQWOFQWFWS");
      } else if (json?.object?.accountType === "SUPER_ADMIN") {
        localStorage.setItem("user", "QWDPQWMFEWJFSS");
      }

      // Set token expiration time (24 hours from now)
      const expiryDate = new Date().getTime() + 24 * 60 * 60 * 1000;
      // const expiryDate = new Date().getTime() + 60 * 1000;

      localStorage.setItem("expiryDateYaponEdu", expiryDate.toString());
    }

    return json;
  };
}

export { GetAuth, AuthLogin };
