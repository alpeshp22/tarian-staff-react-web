import axios from 'axios';

import * as constants from '../constants'

export function getResponseData(data,accessToken = undefined,headerData = {}) {
    // console.log("api Callin Params >>>> ", data);

    const api_config = {
        method: data.method || "post",
        baseURL: data.baseURL || constants.API_BASE_URL,
        headers: {
            Accept: "application/json",
            // "Access-Control-Allow-Origin" : "*",
            "Content-Type": data.contentType || "application/json",
            Authorization: accessToken ? "Bearer " + accessToken : "",
            ...headerData,
        },
        ...data,
    };

    // console.log("api config >>>>", api_config);

    return axios(api_config)
    .then((response) => {
        // console.log('api response >>>>> ', response.data);
        var responseObj = {};
        responseObj.data = response.data;
        responseObj.success = true;
        // console.log("success responseObj >>", responseObj);
        return responseObj;
    })
    .catch((error) => {
        // console.log('api error >>>>> ', error);
        var responseObj = {};
        responseObj.data = error.response.data;
        responseObj.success = false;
        // console.log("error responseObj >>", responseObj);
        return responseObj;
    });
}
