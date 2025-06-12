import { item } from "examples/Sidenav/styles/sidenavItem";
import { API_PATH, headerGet, header } from "../headers";

class testResult {

    static createTestResult = async (data) => {
        const body = {
            date: data?.date,
            studentScore: data?.studentScore,
            title: data?.title
        };

        const url = `${API_PATH}quiz/test/result/create`;
        const response = await fetch(url, {
            method: "POST",
            headers: header,
            body: JSON.stringify(body),
        });
        return response.json();
    }
    static getTestResult = async (data) => {
        const url = `${API_PATH}quiz/test/result/getAll/${data?.studentId}`;
        const response = await fetch(url, {
            method: "GET",
            headers: headerGet,
        });
        return response.json();
    }
    static getTestResultByID = async ({ groupId, startDate, endDate }) => {
        const url = `${API_PATH}quiz/test/result/getAllByDate?endDate=${encodeURIComponent(endDate)}&groupId=${groupId}&startDate=${encodeURIComponent(startDate)}`;
        const response = await fetch(url, {
            method: "GET",
            headers: headerGet,
        });
        return response.json();
    }
    static getTestResultByDate = async (data) => {
        const url = `${API_PATH}quiz/test/result/getAll/${data?.studentId}`;
        const response = await fetch(url, {
            method: "GET",
            headers: headerGet,
        });
        return response.json();
    }

    static deleteTestResult = async (id) => {
        const url = `${API_PATH}quiz/test/result/delete/${id}`;
        const response = await fetch(url, {
            method: 'DELETE',
            headers: headerGet,
        })
        return response.json();
    }

    static EditResult = async (data) => {
        const url = `${API_PATH}quiz/test/result/update`;

        const body = {
            id: data?.id,
            date: data?.date,
            score: data?.score,
            studentId: data?.studentId,
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
export { testResult }