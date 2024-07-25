import React, { useState,useEffect } from 'react';
import { toast } from 'react-toastify';
import * as constants from '../constants'
import { callApi,getAccessToken, getPatient } from '../apiCalls';
import Sidebar from '../components/sidebar';
import Header from '../components/header';
import { useNavigate } from "react-router-dom"
import LoadingSpinner from "../components/LoadingSpinner";
import { Link } from "react-router-dom";

const Overview = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const patient = getPatient();

    const [patientDetail, setPatientDetail] = useState(null);

    const fetchPatientDetail = () => {
        try {
            setIsLoading(true);
            const params = {
                method: 'post',
                url: constants.API_STAFF_PATIENT_RECORD,
                data : { "patientIdAtOrganisation": patient.patient_organisation_id, "dob":patient.patient_date_of_birth }
            };

            callApi([params],getAccessToken(),navigate).then((response) => {
                let resp = response[constants.API_STAFF_PATIENT_RECORD];
                // console.log(constants.API_STAFF_PATIENT_RECORD+' resp >>> ', resp);
                if (resp.success) {
                    setPatientDetail(resp.data.patient_details);
                    localStorage.setItem("patientInfo",JSON.stringify(resp.data.patient_details.patient));
                    // console.log(patientDetail.patient.phone_numbers);
                    // console.log("All numbers >> ", (patientDetail.patient.phone_numbers).map(prodData => prodData.number).join(', '));
                } else {
                    // console.log("error resp >> ",resp.data.detail);
                    toast.error(resp.data.detail);
                }
                setIsLoading(false)
            })
            .catch((error) => {
                setIsLoading(false)
                // console.log('catch error >>> ', error);
            });
        } catch (e) {
            setIsLoading(false)
            // console.log('catch error >>> ', e);
        }
    }

    useEffect(() => {
        fetchPatientDetail();
    }, []);

    return (
        <>
        {isLoading ? <LoadingSpinner /> : ""}
        <div className="pageContent overviewPage">
            <Sidebar />
            <Header />
            <div className="BreadCrumb">
                <div className="container-fluid">
                    <Link to={ constants.ROUTE_HOME + constants.ROUTE_PATIENT_OVERVIEW } className="link">{patient?.patient_forename} {patient?.patient_surname} | #{patient?.patient_id}</Link>
                    <span>Overview</span>
                </div>
            </div>
            <div className="container-fluid mt-2">
                <div className="Row">
                    <div className="card themeCard w-500">
                        <div className="card-header">
                            <h5>Patient Overview</h5>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-6">
                                    <p>Patient Name:</p>
                                </div>
                                <div className="col-md-6">
                                    <p>{patient?.patient_forename} {patient?.patient_surname}</p>
                                </div>
                                <div className="col-md-6">
                                    <p>Patient Id Number:</p>
                                </div>
                                <div className="col-md-6">
                                    <p>#{patient?.patient_id}</p>
                                </div>
                                <div className="col-md-6">
                                    <p>Contact Number (Home): </p>
                                </div>
                                <div className="col-md-6">
                                    <p>{ patientDetail ? ((patientDetail.patient?.phone_numbers?.find(numb => numb._type === 'H')?.number)):"-"}</p>
                                </div>
                                <div className="col-md-6">
                                    <p>Contact Number (Mobile): </p>
                                </div>
                                <div className="col-md-6">
                                    <p>{ patientDetail ? ((patientDetail.patient?.phone_numbers?.find(numb => numb._type === 'M')?.number)):"-"}</p>
                                </div>
                                <div className="btnView col-12">
                                    <Link to={ constants.ROUTE_HOME + constants.ROUTE_CONTACT_PREFERENCES } className="btn btn-green">Contact Preferences</Link>
                                    <Link to={ constants.ROUTE_HOME + constants.ROUTE_PATIENT_INFORMATION } className="btn btn-green">Patient Information</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card themeCard health-score-card w-400">
                        <div className="card-header bg-white">
                            <h5>Health Score</h5>
                        </div>
                        <div className="card-body bg-green">
                            {/* Semi circle Progressbar */}
                            <div className="Progress-bar">
                                <div className="barOverflow">
                                    <div className="bar"></div>
                                </div>
                                <h6>High Risk</h6>
                                <h5>Q-Risk</h5>
                                <h4><span>50</span>%</h4>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="Row mt-4">
                    <div className="card themeCard w-500">
                        <div className="card-header">
                            <h5>Surgery/GP Information</h5>
                        </div>
                        <div className="card-body w-70">
                            <div className="row">
                                <div className="col-md-6">
                                    <p>GP Name:</p>
                                </div>
                                <div className="col-md-6">
                                    <p>{ patientDetail?.patient.usualgp }</p>
                                </div>
                                <div className="col-md-6">
                                    <p>Surgery ID Number:</p>
                                </div>
                                <div className="col-md-6">
                                    <p>#{ patient?.organisation_id }</p>
                                </div>
                                <div className="col-md-6">
                                    <p>Surgery Name:</p>
                                </div>
                                <div className="col-md-6">
                                    <p>{ patient?.surgery_name }</p>
                                </div>
                                <div className="btnView col-12">
                                    <Link to={ constants.ROUTE_HOME + constants.ROUTE_APPOINTMENTS_EVENTS } className="btn btn-green">Appointments/Events</Link>
                                    <Link to={ constants.ROUTE_HOME + constants.ROUTE_PRESCRIPTIONS } className="btn btn-green">Prescriptions</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card themeCard map-card w-800">
                        <div className="card-header bg-white">
                            <h5>Surgery Map</h5>
                        </div>
                        <div className="card-body p-0">
                            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2474.2586334039897!2d-3.030393183967905!3d51.673408779662886!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4871de70305dc805%3A0x7eefbfdd7830754f!2sAcacia%20Ave%2C%20Cwmbran%2C%20UK!5e0!3m2!1sen!2sin!4v1678714648367!5m2!1sen!2sin" title="YouTube video" allowFullScreen></iframe>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}
export default Overview;
