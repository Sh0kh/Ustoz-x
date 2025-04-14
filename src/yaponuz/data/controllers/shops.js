import { header, headerGet, API_PATH } from "../headers";

class Shops {
  static getAllShops = async (page, size, shopType, active, title) => {
    try {
      const url =
        API_PATH +
        `shop/all?shopType=${shopType}&page=${page}&size=${size}&active=${active}&title=${title}`;
      const response = await fetch(url, {
        method: "GET",
        headers: headerGet,
      });

      const json = await response.json();

      return json;
    } catch (error) {
      console.log("Error in Shop Get", error);
    }
  };

  static getShops = async (page, size, shopType) => {
    try {
      const url = API_PATH + `shop/admin/all?shopType=${shopType}&page=${page}&size=${size}`;
      const response = await fetch(url, {
        method: "GET",
        headers: headerGet,
      });

      const json = await response.json();

      return json;
    } catch (error) {
      console.log("Error in Shop Get", error);
    }
  };

  static createShop = async (data) => {
    const url = API_PATH + "shop/create";
    const response = await fetch(url, {
      method: "POST",
      headers: header,
      body: JSON.stringify(data),
    });

    const json = await response.json();

    return json;
  };

  static deleteShop = async (homeId, userId) => {
    const url = API_PATH + `shop/delete?shopId=${homeId}&userId=${userId}`;
    const response = await fetch(url, {
      method: "DELETE",
      headers: headerGet,
    });

    const json = await response.json();

    return json;
  };

  static getOneShop = async (id) => {
    const url = API_PATH + `shop/one?id=${id}`;
    const response = await fetch(url, {
      method: "GET",
      headers: headerGet,
    });

    const json = await response.json();

    return json;
  };

  static updateShop = async (data) => {
    const url = API_PATH + "shop/update";
    const response = await fetch(url, {
      method: "PUT",
      headers: header,
      body: JSON.stringify(data),
    });

    const json = await response.json();

    return json;
  };
}

export { Shops };
