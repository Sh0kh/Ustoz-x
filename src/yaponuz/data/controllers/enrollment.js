import { API_PATH, header, headerGet } from "../headers";

class enrollment {

    static async getEnrollment(data) {
        let url = `${API_PATH}course/enrollment/get/all/admin?courseId=${data?.id}&page=${data?.page}&size=${data?.size}&studentId=${data?.userId}`;
        // let url = `${API_PATH}course/enrollment/get/all/admin?page=0&size=20`;
        const response = await fetch(url, {
            method: "GET",
            headers: headerGet,
        });
        return response.json();
    }


    static createEnrollment = async (data) => {
        const url = `${API_PATH}course/enrollment/start`;
        const response = await fetch(url, {
            method: "POST",
            headers: header,
            body: JSON.stringify(data),
        });
        return response.json();
    };


    static updateEnrollment = async (data) => {
        const url = `${API_PATH}course/enrollment/update`;
        const response = await fetch(url, {
            method: "POST",
            headers: header,
            body: JSON.stringify(data),
        });
        return response.json();
    };


}

export { enrollment };
