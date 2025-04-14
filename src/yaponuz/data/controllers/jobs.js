import { API_PATH, headerGet, header } from "../headers";

class Jobs {
  // http://ec2-54-238-164-38.ap-northeast-1.compute.amazonaws.com:7714/sos/api/jobs/all-by-title?active=true
  static getAllJobs = async (page, size, active, title, address) => {
    const url =
      API_PATH +
      `jobs/all-by-title?page=${page}&size=${size}&active=${active}&title=${title}&address=${address}`;
    const response = await fetch(url, {
      method: "GET",
      headers: headerGet,
    });

    const json = await response.json();

    return json;
  };

  //http://ec2-54-238-164-38.ap-northeast-1.compute.amazonaws.com:7714/sos/api/jobs/create
  static createJob = async (data) => {
    const url = API_PATH + "jobs/create";
    const response = await fetch(url, {
      method: "POST",
      headers: header,
      body: JSON.stringify(data),
    });

    const json = await response.json();

    return json;
  };

  //http://ec2-54-238-164-38.ap-northeast-1.compute.amazonaws.com:7714/sos/api/jobs/delete?jobId=35&userId=2
  static deleteJob = async (jobId, userId) => {
    const url = API_PATH + `jobs/delete?jobId=${jobId}&userId=${userId}`;
    const response = await fetch(url, {
      method: "DELETE",
      headers: headerGet,
    });

    const json = await response.json();

    return json;
  };

  // http://ec2-54-238-164-38.ap-northeast-1.compute.amazonaws.com:7714/sos/api/jobs/get/one?jobId=34
  static getOneJob = async (jobId) => {
    const url = API_PATH + `jobs/get/one?jobId=${jobId}`;
    const response = await fetch(url, {
      method: "GET",
      headers: headerGet,
    });

    const json = await response.json();

    return json;
  };

  // http://ec2-54-238-164-38.ap-northeast-1.compute.amazonaws.com:7714/sos/api/jobs/update
  static updateJob = async (data) => {
    const url = API_PATH + "jobs/update";
    const response = await fetch(url, {
      method: "PUT",
      headers: header,
      body: JSON.stringify(data),
    });

    const json = await response.json();

    return json;
  };
}

export { Jobs };
