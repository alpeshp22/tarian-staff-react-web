import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { isLoggedIn } from '../apiCalls'
import * as constants from '../constants'

const Authroute = () => {
    const isauth = isLoggedIn();
    return isauth ? <Navigate to={ constants.ROUTE_PATIENT_SEARCH } /> : <Outlet />
}
export default Authroute;
