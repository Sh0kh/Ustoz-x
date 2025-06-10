const API_PATH = "https://ustozx.uz/edu/api/";
const API_JUST = "https://ustozx.uz/edu/api/";
// const API_PATH = "https://bb06-84-54-73-213.ngrok-free.app/edu/api/";
// const API_JUST = "https://bb06-84-54-73-213.ngrok-free.app/edu/api/";


// http://194.87.151.210:2120/swagger-ui.html#/

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