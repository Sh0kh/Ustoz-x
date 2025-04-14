import { API_PATH, header, headerGet } from "../headers";

class Chat {
  // http://ec2-54-238-164-38.ap-northeast-1.compute.amazonaws.com:7714/sos/api/chat/all/chat/admin
  static getAllChatAdmin = async (page, size) => {
    const response = await fetch(`${API_PATH}chat/get/all/admin?page=${0}&size=${size}`, {
      method: "GET",
      headers: headerGet,
    });
    return response.json();
  };
  
  static getAllChat = async (page, size, userId) => {
    const response = await fetch(
      `${API_PATH}chat/all/chat/admin?page=${page}&size=${size}&userId=${userId}`,
      {
        method: "GET",
        headers: headerGet,
      }
    );
    return response.json();
  };

  //
  static getAllMessages = async (page, size, chatId) => {
    const response = await fetch(
      `${API_PATH}chat/all/chat/message?page=${page}&size=${size}&chatId=${chatId}`,
      {
        method: "GET",
        headers: headerGet,
      }
    );

    return response.json();
  };

  static getMessages = async (userOne, userTwo) => {
    const response = await fetch(
      `${API_PATH}chat/all/chat/message/service?userOne=${userOne}&userTwo=${userTwo}`,
      { method: "GET", headers: headerGet }
    );
    return response.json();
  };

  static addMessage = async (data) => {
    const response = await fetch(`${API_PATH}chat/add`, {
      method: "POST",
      headers: header,
      body: JSON.stringify(data),
    });
    return response.json();
  };
}

export { Chat };
