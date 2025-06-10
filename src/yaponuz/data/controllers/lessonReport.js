import { API_PATH, headerGet, header } from "../headers";

class lessonReport {

    static createLessonReport = async (dataArray) => {
        // dataArray - массив объектов отчётов
        const url = `${API_PATH}lesson/student/daily/report/create`;
        const response = await fetch(url, {
            method: "POST",
            headers: header,
            body: JSON.stringify(dataArray),
        });
        return response.json();
    }

    static getLessonReport = async (data) => {
        const url = `${API_PATH}lesson/student/daily/report/getAllByStudentId?page=${data?.page}&size=${data?.size}&studentId=${data?.studentId}`;
        const response = await fetch(url, {
            method: "GET",
            headers: headerGet,
        });
        return response.json();
    }
    static getLessonReportByDate = async (data) => {
        const url = `${API_PATH}lesson/student/daily/report/getAllByDate?endDate=${data?.endDate}&groupId=${data?.groupId}&page=0&size=20&startDate=${data?.startDate}`;
        const response = await fetch(url, {
            method: "GET",
            headers: headerGet,
        });
        return response.json();
    }

    static deleteLessonReport = async (id) => {
        const url = `${API_PATH}lesson/student/daily/report/delete?id=${id}`;
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

export { lessonReport }