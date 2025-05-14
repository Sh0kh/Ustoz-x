import { API_PATH, header, headerGet } from "../headers";

class device {
    static async getDevice(id) {
        let url = `${API_PATH}device/getAllByUserId?userId=${id}`;
        const response = await fetch(url, {
            method: "GET",
            headers: headerGet,
        });
        return response.json();
    }
    static deleteDivace = async (id) => {
        const url = `${API_PATH}device/delete?id=${id}`;
        const response = await fetch(url, {
            method: 'DELETE',
            headers: headerGet,
        })
        return response.json();
    }


}

export { device };
