import { API_PATH, headerGet, header } from "../headers";

class ArticleCategories {
  static getArticleCategory = async () => {
    const url = API_PATH + "article-category/all";
    const response = await fetch(url, {
      method: "GET",
      headers: headerGet,
    });

    const json = await response.json();

    return json;
  };

  static getArticleParentId = async (parentId) => {
    const url = API_PATH + `article-category/all?parentId=${parentId}`;
    const response = await fetch(url, {
      method: "GET",
      headers: headerGet,
    });

    const json = await response.json();

    return json;
  };

  static getOneId = async (id) => {
    const url = API_PATH + `article-category/get/by/id?id=${id}`;
    const response = await fetch(url, {
      method: "GET",
      headers: headerGet,
    });

    return response.json();
  };

  static getOnePhoto = async (hashId) => {
    const url = API_PATH + "file/view/one/photo?hashId=" + hashId;
    const response = await fetch(url, {
      method: "GET",
      headers: headerGet,
    });

    if (!response.ok) {
      const url = API_PATH + "file/view/one/photo?hashId=24230512646486117225876969106639957765";
      const response = await fetch(url, {
        method: "GET",
        headers: headerGet,
      });

      const blob = await response.blob();
      const urlObject = URL.createObjectURL(blob);

      return urlObject;
    }

    const blob = await response.blob();
    const urlObject = URL.createObjectURL(blob);

    return urlObject;
  };

  static deleteCategory = async (id, userId) => {
    const url = API_PATH + `article-category/delete?id=${id}&userId=${userId}`;
    const response = await fetch(url, {
      method: "DELETE",
      headers: headerGet,
    });

    const json = await response.json();

    return json;
  };

  static createCategory = async (data) => {
    const url = API_PATH + "article-category/create";
    const response = await fetch(url, {
      method: "POST",
      headers: header,
      body: JSON.stringify(data),
    });

    const json = await response.json();

    return json;
  };

  static updateCategory = async (data) => {
    const url = API_PATH + "article-category/update";
    const response = await fetch(url, {
      method: "PUT",
      headers: header,
      body: JSON.stringify(data),
    });

    const json = await response.json();

    return json;
  };

  // get All Admin
  static getAllAdmin = async () => {
    const url = API_PATH + "article-category/all/admin";
    const response = await fetch(url, {
      method: "GET",
      headers: headerGet,
    });

    return response.json();
  };
}

export { ArticleCategories };
