import { API_PATH, headerGet, header } from "../headers";

class report {
    static createReport = async (data) => {
        const body = {
            context: data?.info,
            fileId: data?.fileId,
            reportType: data?.selectType?.value,
            studentId: data?.studentId,
            title: data?.title
        }
        const url = `${API_PATH}quiz/report/create`;
        const response = await fetch(url, {
            method: "POST",
            headers: header,
            body: JSON.stringify(body),
        });
        return response.json();
    }

    static getReport = async (data) => {
        const url = `${API_PATH}quiz/report/get/all?studentId=${data?.studentId}&type=${data?.type}`;
        const response = await fetch(url, {
            method: "GET",
            headers: headerGet,
        });
        return response.json();
    }

    static deleteReport = async (id) => {
        const url = `${API_PATH}quiz/report/delete/${id}`;
        const response = await fetch(url, {
            method: 'DELETE',
            headers: headerGet,
        })
        return response.json();
    }

    static EditReport = async (data) => {
        const url = `${API_PATH}quiz/report/update`;
        const body = {
            id: data?.id,
            context: data?.info,
            fileId: data?.fileId,
            reportType: data?.selectType?.value,
            studentId: data?.studentId,
            title: data?.title
        }
        const response = await fetch(url, {
            method: "PUT",
            headers: header,
            body: JSON.stringify(body),
        });
        return response.json();
    }
}

export { report }