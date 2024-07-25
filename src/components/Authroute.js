import React from 'react';
import { toast } from 'react-toastify';
import { Outlet, Navigate } from 'react-router-dom';
import { isLoggedIn } from '../apiCalls'
import * as constants from '../constants'

const Authroute = () => {
    const isauth = isLoggedIn();
    if(isauth) {
        return <Outlet />
    } else {
        toast.dismiss();
        toast.error("Session expired! Please re-login to continue.");
        return <Navigate to={ constants.ROUTE_LOGIN } />
    }
}
export default Authroute;
