import { API_PATH, header, headerGet } from "../headers";

class UserAdmin {
    // http://ec2-54-238-164-38.ap-northeast-1.compute.amazonaws.com:7714/sos/api/users/
    static async getUsers(page, size, firstName, lastName, phoneNumber) {
        let url = `${API_PATH}users?page=${page}&size=${size}&firstName=${firstName}&lastName=${lastName}&accountType=ADMIN`;
        if (phoneNumber !== "") {
            url += `&phoneNumber=${phoneNumber.replace("+", "")}`;
        }
        const response = await fetch(url, {
            method: "GET",
            headers: headerGet,
        });
        return response.json();
    }

    static async createUser(data) {
        const response = await fetch(`${API_PATH}users/admin`, {
            method: "POST",
            headers: header, // Вызов функции
            body: JSON.stringify(data),
        });
        return response.json();
    }


}

export { UserAdmin };
