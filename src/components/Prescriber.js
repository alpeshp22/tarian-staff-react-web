import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { getStaffProfile } from '../apiCalls';
import * as constants from '../constants'

const Prescriber = () => {
    const staffUserProfile = getStaffProfile();    
    if(staffUserProfile.Prescriber) {
        return <Outlet/>
    }else{
        return <Navigate to={ constants.ROUTE_PATIENT_OVERVIEW } />
    }
}

export default Prescriber;