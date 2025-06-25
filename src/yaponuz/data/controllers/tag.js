import { API_PATH, headerGet, header } from "../headers";

class TagController {
    // create
    static createTag = async (name) => {
        const body = {
            name: name?.name
        }
        const url = `${API_PATH}quiz/tag/create`;
        const response = await fetch(url, {
            method: "POST",
            headers: header,
            body: JSON.stringify(body),
        });
        return response.json();
    }
    // Get 
    static getAllTag = async () => {
        const url = `${API_PATH}quiz/tag/getAll`;
        const response = await fetch(url, {
            method: "GET",
            headers: headerGet,
        });
        return response.json();
    }
    // Delete
    static deleteTag = async (id) => {
        const url = `${API_PATH}quiz/tag/delete?id=${id}`;
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

export { TagController }