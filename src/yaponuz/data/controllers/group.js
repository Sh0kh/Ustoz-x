import { API_PATH, headerGet, header } from "../headers";

function formatDate(inputDate) {
  const date = new Date(inputDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

class Group {
  // get all groups
  static getAllGroup = async (page, size) => {
    const url = `${API_PATH}group/get/all/admin?page=${page}&size=${size}`;
    const response = await fetch(url, {
      method: "GET",
      headers: headerGet,
    });
    return response.json();
  };
  static getMyGroups = async () => {
    const url = `${API_PATH}group/get/all/${localStorage.getItem('userId')}`;
    const response = await fetch(url, {
      method: "GET",
      headers: headerGet,
    });
    return response.json();
  };

  // create new group
  static createGroup = async (data) => {
    const userId = localStorage.getItem("userId");

    const body = {
      creatorId: userId,
      courserId:data?.courseId,
      endDate: formatDate(data.endDate),
      name: data.groupName,
      startDate: formatDate(data.startDate),
      teacherId:data?.teacherId
    };

    const url = `${API_PATH}group/create`;
    const response = await fetch(url, {
      method: "POST",
      headers: header,
      body: JSON.stringify(body),
    });
    return response.json();
  };

  // delete one version
  static deleteGroup = async (id) => {
    const url = `${API_PATH}group/delete?groupId=${id}`;
    const response = await fetch(url, {
      method: "DELETE",
      headers: headerGet,
    });
    return response.json();
  };

  // update group
  static updateGroup = async (data) => {
    const url = `${API_PATH}group/update`;

    const body = {
      id: data.id,
      endDate: formatDate(data.endDate),
      name: data.groupName,
      startDate: formatDate(data.startDate),
    };

    const response = await fetch(url, {
      method: "PUT",
      headers: header,
      body: JSON.stringify(body),
    });
    return response.json();
  };
}

export { Group };
