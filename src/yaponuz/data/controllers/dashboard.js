import { API_PATH, header, headerGet } from "../headers";

class Dashboard {
    static async getReport() {
        let url = `${API_PATH}admin/get/report`;
        const response = await fetch(url, {
            method: "GET",
            headers: headerGet,
        });
        return response.json();
    }


}

export { Dashboard };
