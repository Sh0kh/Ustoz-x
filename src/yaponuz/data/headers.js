const API_PATH = "https://ustozx.uz/edu/api/";
const API_JUST = "https://ustozx.uz/edu/api/";

const AUTH_TOKEN = "sos_token";
const USER_HASH_ID = "sos_hashId";

const getToken = () => localStorage.getItem(AUTH_TOKEN);

const header = () => ({
  Authorization: `Bearer ${getToken()}`,
  "Content-Type": "application/json",
});

const headerGet = () => ({
  Authorization: `Bearer ${getToken()}`,
});

const headerFile = () => ({
  Authorization: `Bearer ${getToken()}`,
  "Content-Type": "multipart/form-data",
});

const headerPATCH = () => ({
  Authorization: `Bearer ${getToken()}`,
  "Access-Control-Allow-Origin": "*",
});

export {
  API_PATH,
  API_JUST,
  AUTH_TOKEN,
  USER_HASH_ID,
  header ,
  headerGet ,
  headerFile ,
  headerPATCH,
};
