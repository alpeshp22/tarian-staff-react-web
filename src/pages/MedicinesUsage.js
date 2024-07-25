import React, {useState} from "react";
import Sidebar from '../components/sidebar';
import Header from '../components/header';
import { Link } from "react-router-dom";
import * as constants from '../constants'
import { callApi, getAccessToken, getPatient } from '../apiCalls';

const MedicinesUsage = () => {
    const patient = getPatient();

    return (
        <>
            <div className="pageContent medicinesUsagePage">
                <Sidebar />
                <Header />
                <div className="BreadCrumb">
                    <div className="container-fluid">
                        <Link to={ constants.ROUTE_HOME + constants.ROUTE_MEDICINES_USAGE } className="link">{patient?.patient_forename} {patient?.patient_surname} | #{patient?.patient_id}</Link>
                        <span>Medicines Usage</span>
                    </div>
                </div>
                <iframe title="Prescription Requests Report v1" width="1140" height="541.25" src="https://app.powerbi.com/reportEmbed?reportId=87dcf550-500d-4659-97b3-c2ebff119da8&autoAuth=true&embeddedDemo=true" frameborder="0" allowFullScreen="true"></iframe>
            </div>
        </>
    )
}

export default MedicinesUsage;