import axios from 'axios';
import { toast } from 'react-toastify';
import {getResponseData} from './apiCallGetData';
import * as constants from '../constants'

export function callApi(api_inputs, accessToken, navigation) {
    return new Promise((resolve, reject) => {
        var api_container = [];
        api_inputs.map((item, index) => {
            api_container.push(getResponseData(item, accessToken));

            if (index === api_inputs.length - 1) {
                axios
                .all(api_container)
                .then(
                    axios.spread((...responses) => {
                        const result = {};
                        responses.map((item, index) => {
                            return result[api_inputs[index].url] = item;
                        });
                        resolve(result);

                        checkTokenExpire(responses, navigation);
                    }),
                )
                .catch((e) => {
                    reject(e);
                });
            }
        });
    });
}

function checkTokenExpire(responses, navigate) {
    // console.log("responses >> ",responses);
    const isExpired = responses.filter((item) => item.data.code === "token_not_valid");
    if (isExpired.length) {
        // toast.dismiss();
        toast.error("Session expired! Please re-login to continue.");
        logout(navigate);
    }
}

export function logout(navigate) {
    const accessToken = getAccessToken();
    // console.log("accessToken before => ",getAccessToken());
    if(accessToken !== "undefined" || !accessToken) {
        localStorage.clear();
    }
    // console.log("accessToken after => ",getAccessToken());
    navigate('/login');
    // toast.dismiss();
    toast.success("Logged out successfully!");
}

export const isLoggedIn = () => {
    if(localStorage.getItem('accessToken')) {
        return true;
    } else {
        return false;
    }
}

export const getAccessToken = () => {
    return localStorage.getItem('accessToken');
}

export const getRefreshToken = () => {
    return localStorage.getItem('refreshToken');
}

export const setUserDetails = () => {

    try {
        const params = {
            method : 'get',
            url: constants.API_STAFF_USER_CONNECT,
        };
        callApi([params],getAccessToken()).then((response) => {
            let resp = response[constants.API_STAFF_USER_CONNECT];
            if (resp.success) {
                console.log(constants.API_STAFF_USER_CONNECT+'success response >>> ', resp);
                localStorage.setItem('user',JSON.stringify(resp.data));
            } else {
                // console.log("error responseData >> ",resp.data.detail);
                console.log(constants.API_STAFF_USER_CONNECT+'error responseData >>> ', resp);
            }
        })
        .catch((error) => {
            // console.log('catch error >>> ', error);
        });
    } catch (e) {
        // console.log('catch error >>> ', e);
    }
    return getUser();
}

export const getUser = () => {
    if(localStorage.getItem('user')) {
        return JSON.parse(localStorage.getItem('user'));
    }
    return "";

}

export const getStaffProfile = () => {
    if(localStorage.getItem('staffProfile')) {
        return JSON.parse(localStorage.getItem('staffProfile'));
    }
    return "";
}

export const getPatient = () => {
    if(localStorage.getItem('patient')) {
        return JSON.parse(localStorage.getItem('patient'));
    }
    return "";
}

export const getOrganisation = () => {
    if(localStorage.getItem('linked_organisations')) {
        return JSON.parse(localStorage.getItem('linked_organisations'));
    }
    return "";
}

export const getSurgeries = () => {
    if(localStorage.getItem('linked_organisations')) {
        return JSON.parse(localStorage.getItem('linked_organisations'));
    }
    return "";
}

export const getpatientInfo = () => {
    if(localStorage.getItem('patientInfo')) {
        return JSON.parse(localStorage.getItem('patientInfo'));
    }
    return "";
}
