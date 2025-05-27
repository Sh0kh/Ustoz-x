import { API_PATH, headerGet, header } from "../headers";

class Reting {
    // get all Referrals
    static getAllRating = async (data) => {
        const url = `${API_PATH}course/rating/get/admin?courseId=${data?.id}&page=${data?.page}&size=${data?.size}`;
        const response = await fetch(url, {
            method: "GET",
            headers: headerGet,
        });
        return response.json();
    };



    static deleteReferral = async (id) => {
        const url = `${API_PATH}course/rating/delete?ratingId=${id}`;
        const response = await fetch(url, {
            method: "DELETE",
            headers: headerGet,
        });
        return response.json();
    };

    // update Referral
    static updateRating = async ( data) => {
        const url = `${API_PATH}course/rating/update`;
        const response = await fetch(url, {
            method: "POST",
            headers: header,
            body: JSON.stringify(data),
        });
        return response.json();
    };
}

export { Reting };