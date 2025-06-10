import { API_PATH, headerGet, header } from "../headers";

class personality {

    static createPersonality = async (dataArray) => {
        // dataArray - bu massiv bo'lishi kerak
        const url = `${API_PATH}personality/create`;
        const response = await fetch(url, {
            method: "POST",
            headers: header,
            body: JSON.stringify(dataArray),
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
    static getPersonalityByDate = async (data) => {
        const url = `${API_PATH}personality/getAllByDate?endDate=${data?.endDate}&groupId=${data?.groupId}&page=0&size=20&startDate=${data?.startDate}`;
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