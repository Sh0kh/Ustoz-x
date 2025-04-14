import { header, headerGet, API_PATH } from "../headers";

class Article {
  //http://ec2-54-238-164-38.ap-northeast-1.compute.amazonaws.com:7714/sos/api/article/get/all?categoryId=42 - GET - only one params categoryId - return all articles byCategoryId
  static getArticleByCategoryId = async (categoryId, page, size, title, active) => {
    const url =
      API_PATH +
      `article/get/all/admin?categoryId=${categoryId}&page=${page}&size=${size}&title=${title}&active=${active}`;
    const response = await fetch(url, {
      method: "GET",
      headers: headerGet,
    });

    const json = await response.json();
    return json;
  };

  // deleteArticle http://ec2-54-238-164-38.ap-northeast-1.compute.amazonaws.com:7714/sos/api/article/delete?articleId=1&userId=4 - DELETE - only two params articleId, userId - return message i mean told you this must be two params
  static deleteArticle = async (articleId, userId) => {
    const url = API_PATH + `article/delete?articleId=${articleId}&userId=${userId}`;
    const response = await fetch(url, {
      method: "DELETE",
      headers: header,
    });

    const json = await response.json();
    return json;
  };

  // createArticleCategory http://ec2-54-238-164-38.ap-northeast-1.compute.amazonaws.com:7714/sos/api/article/create - POST - only one body params - return message
  static createArticleCategory = async (data) => {
    const url = API_PATH + `article/create`;
    const response = await fetch(url, {
      method: "POST",
      headers: header,
      body: JSON.stringify(data),
    });

    const json = await response.json();
    return json;
  };

  // updateArticle - http://ec2-54-238-164-38.ap-northeast-1.compute.amazonaws.com:7714/sos/api/article/update/ - PUT - one params data json
  static updateArticle = async (data) => {
    const url = API_PATH + `article/update/`;
    const response = await fetch(url, {
      method: "PUT",
      headers: header,
      body: JSON.stringify(data),
    });

    const json = await response.json();
    return json;
  };

  // getOne - http://ec2-54-238-164-38.ap-northeast-1.compute.amazonaws.com:7714/sos/api/article/get/one?userId=3 - only one params userId - return all articles byUserId
  static getArticleByUserId = async (userId) => {
    const url = API_PATH + `article/get/one?userId=${userId}`;
    const response = await fetch(url, {
      method: "GET",
      headers: headerGet,
    });

    const json = await response.json();
    return json;
  };

  // get all Article
  static getAllAdmin = async (page, size) => {
    let url =
      API_PATH + `article/get/all/admin?categoryId=100&noFilter=true&page=${page}&size=${size}`;

    const response = await fetch(url, {
      method: "GET",
      headers: headerGet,
    });

    return response.json();
  };
}

export { Article };
