export function getDateFilter(date) {
  try {
    let mydate = new Date(date).toISOString().replace(/T/, " ").replace(/\..+/, "");
    return mydate;
  } catch (err) {
    console.log("Error from getDateFilter() function: ", err);
    return date;
  }
}

export function getSizableJSX(data) {
  try {
  } catch (err) {
    console.log("Error from getSizableJSX() function: ", err);
    return data;
  }
}
