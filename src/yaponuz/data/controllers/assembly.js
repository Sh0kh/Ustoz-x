import { API_PATH, headerGet, header } from "../headers";

class Assembly {
    // create
    static createAssembly = async (data) => {
        const body = {
            date: data?.date,
            description: data?.info,
            googleMeetUrl: data?.link,
            groupId: data?.selectedGroup?.value,
            time: data?.time,
            title: data?.title
        }
        const url = `${API_PATH}assembly/create`;
        const response = await fetch(url, {
            method: "POST",
            headers: header,
            body: JSON.stringify(body),
        });
        return response.json();
    }
    // Get 
    static getAllAssembly = async (page, size) => {
        const url = `${API_PATH}assembly/admin/getAll?page=${page}&size=${size}`;
        const response = await fetch(url, {
            method: "GET",
            headers: headerGet,
        });
        return response.json();
    }
    // Delete
    static deleteAssembly = async (id) => {
        const url = `${API_PATH}assembly/delete?id=${id}`;
        const response = await fetch(url, {
            method: 'DELETE',
            headers: headerGet,
        })
        return response.json();
    }
    // Edit
    static EditAssembly = async (data) => {
        const url = `${API_PATH}assembly/update`;

        const body = {
            id: data?.id,
            date: data?.date,
            description: data?.info,
            googleMeetUrl: data?.link,
            groupId: data?.selectedGroup?.value,
            time: data?.time,
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

export { Assembly }