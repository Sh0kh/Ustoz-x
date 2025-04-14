import { API_PATH, headerGet, header } from "../headers";

function formatDate(inputDate) {
  const date = new Date(inputDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function arrayToQueryParams(array, paramName = 'studentIdList') {
  return array.map(value => `${paramName}=${value}`).join('&');
}

class Attendance {
  // get all groups
    static getAllAttendance = async (list, date) => {
      const queryParams = arrayToQueryParams(list, 'studentIdList');
      const url = `${API_PATH}attendance/get/list?${queryParams}&date=${date}`;
      const response = await fetch(url, {
        method: "GET",
        headers: headerGet,
      });
      return response.json();
    };

  // create new group
  static createAttendance = async (data) => {
    const url = `${API_PATH}attendance/create/list`;
    const response = await fetch(url, {
      method: "POST",
      headers: header,
      body: JSON.stringify(data),
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
  static deleteAttendance = async (id) => {
    const url = `${API_PATH}attendance/delete?id=${id}`;
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

export { Attendance };
