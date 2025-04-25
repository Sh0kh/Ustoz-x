import { API_PATH, headerGet, header } from "../headers";

class personality {

    static createPersonality = async (data) => {
        const body = {
            score: data?.score,
            lessonId: data?.lessonId,
            date: data?.date,
            studentId: data?.studentId,
            comment: data?.info
        }
        const url = `${API_PATH}personality/create`;
        const response = await fetch(url, {
            method: "POST",
            headers: header,
            body: JSON.stringify(body),
        });
        return response.json();
    }

    static getPersonality = async (data) => {
        const url = `${API_PATH}personality/admin/getAll?studentId=${data?.studentId}`;
        const response = await fetch(url, {
            method: "GET",
            headers: headerGet,
        });
        return response.json();
    }

    static deletePersonality = async (id) => {
        const url = `${API_PATH}personality/delete?id=${id}`;
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

export { personality }