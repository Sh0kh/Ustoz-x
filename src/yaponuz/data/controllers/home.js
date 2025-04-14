import { header, headerGet, API_PATH } from "../headers";

class Home {
  static getAllHome = async (page, size, address, homeAgent, active, rentFeeMin, rentFeeMax) => {
    try {
      const url =
        API_PATH +
        `home/all?page=${page}&size=${size}&address=${address}&homeAgent=${homeAgent}&active=${active}&rentFeeMin=${rentFeeMin}&rentFeeMax=${rentFeeMax}`;
      const response = await fetch(url, {
        method: "GET",
        headers: headerGet,
      });

      const json = await response.json();

      return json;
    } catch (error) {
      console.log("Error in Home.getAllHome", error);
    }
  };

  static createHome = async (data) => {
    const url = API_PATH + "home/create";
    const response = await fetch(url, {
      method: "POST",
      headers: header,
      body: JSON.stringify(data),
    });

    const json = await response.json();

    return json;
  };

  static deleteHome = async (homeId, userId) => {
    const url = API_PATH + `home/delete?homeId=${homeId}&userId=${userId}`;
    const response = await fetch(url, {
      method: "DELETE",
      headers: headerGet,
    });

    const json = await response.json();

    return json;
  };

  static getOneHome = async (id) => {
    const url = API_PATH + `home/get-one?id=${id}`;
    const response = await fetch(url, {
      method: "GET",
      headers: headerGet,
    });

    const json = await response.json();

    return json;
  };

  static updateHome = async (data) => {
    const url = API_PATH + "home/update";
    const response = await fetch(url, {
      method: "POST",
      headers: header,
      body: JSON.stringify(data),
    });

    const json = await response.json();

    return json;
  };
}

export { Home };
