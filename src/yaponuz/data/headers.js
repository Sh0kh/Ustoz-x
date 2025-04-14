const API_PATH = "https://ustozx.uz/japan/edu/api/";
const API_JUST = "https://ustozx.uz/japan/edu/api/";
// http://52.53.242.81:7088/swagger-ui.html#/

const AUTH_TOKEN = "sos_token";
const USER_HASH_ID = "sos_hashId";
const token = localStorage.getItem(AUTH_TOKEN);

const header = {
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
};

const headerGet = {
  Authorization: `Bearer ${token}`,
};

const headerFile = {
  Authorization: `Bearer ${token}`,
  "Content-Type": "multipart/form-data",
};

const headerPATCH = {
  Authorization: `Bearer ${token}`,
  "Access-Control-Allow-Origin": "*", 
};

export { API_PATH, headerPATCH, API_JUST, AUTH_TOKEN, USER_HASH_ID, header, headerGet, headerFile };