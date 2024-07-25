import React from 'react';
import { toast } from 'react-toastify';
import { Outlet, Navigate } from 'react-router-dom';
import { isLoggedIn, getPatient } from '../apiCalls'
import * as constants from '../constants'

const Patientroute = () => {
    const isauth = isLoggedIn();
    const patient = getPatient();
    if(isauth && patient.patient_id) {
        return <Outlet />
    } else {
        toast.dismiss();
        toast.error("Search patient to view information!");
        return <Navigate to={ constants.ROUTE_PATIENT_SEARCH } />
    }
}
export default Patientroute;
