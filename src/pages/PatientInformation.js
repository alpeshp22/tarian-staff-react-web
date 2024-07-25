import React, { useState,useEffect } from 'react';
import { toast } from 'react-toastify';
import * as constants from '../constants'
import Sidebar from '../components/sidebar';
import Header from '../components/header';
import { useNavigate } from "react-router-dom"
import { callApi,getAccessToken, getPatient, getpatientInfo } from '../apiCalls';
import LoadingSpinner from "../components/LoadingSpinner";
import { Link } from "react-router-dom"
import moment from 'moment'

const PatientInformation = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const patient = getPatient();
    const patientInfo = getpatientInfo();
    // const [patientDetail, setPatientDetail] = useState(null);
    const [bloodPressure, setBloodPressure] = useState([]);
    const [bloodTest, setBloodTest] = useState([]);
    const [weight, setWeight] = useState([]);
    const [height, setHeight] = useState([]);
    const [allergy, setAllergy] = useState([]);
    const [acute, setAcute] = useState([]);
    const [medication, setMedication] = useState([]);

    // const fetchPatientDetail = () => {
    //     try {
    //         setIsLoading(true);
    //         const params = {
    //             method: 'post',
    //             url: constants.API_STAFF_PATIENT_RECORD,
    //             data : { "patientIdAtOrganisation": patient.patient_organisation_id, "dob":patient.patient_date_of_birth }
    //         };

    //         callApi([params],getAccessToken(),navigate).then((response) => {
    //             let resp = response[constants.API_STAFF_PATIENT_RECORD];
    //             // console.log(constants.API_STAFF_PATIENT_RECORD+' resp >>> ', resp);
    //             if (resp.success) {
    //                 setPatientDetail(resp.data.patient_details);
    //                 fetchHealthDetail();
    //                 // console.log(patientDetail.patient.phone_numbers);
    //                 // console.log("All numbers >> ", (patientDetail.patient.phone_numbers).map(prodData => prodData.number).join(', '));
    //             } else {
    //                 // console.log("error resp >> ",resp.data.detail);
    //                 toast.error(resp.data.detail);
    //             }
    //             setIsLoading(false)
    //         })
    //         .catch((error) => {
    //             setIsLoading(false)
    //             // console.log('catch error >>> ', error);
    //         });
    //     } catch (e) {
    //         setIsLoading(false)
    //         // console.log('catch error >>> ', e);
    //     }
    // }
    const fetchHealthDetail = () => {
        try {
            setIsLoading(true);
            const params = {
                method: 'post',
                url: constants.API_STAFF_CARE_RECORD_HEALTH_SUMMARY,
                data : { "patientIdAtOrganisation": patient.patient_organisation_id, "dob":patient.patient_date_of_birth }
            };

            callApi([params],getAccessToken(),navigate).then((response) => {
                let resp = response[constants.API_STAFF_CARE_RECORD_HEALTH_SUMMARY];
                // console.log(constants.API_STAFF_CARE_RECORD_HEALTH_SUMMARY+' resp >>> ', resp);
                if (resp.success) {
                    console.log(resp.data.patient_health);
                    const patient_health = resp.data.patient_health;
                    setBloodPressure(patient_health.health_response.filter((item) => item.bp).map((item) => item.bp));
                    setBloodTest(patient_health.health_response.filter((item) => item.blood_test_result).map((item) => item.blood_test_result));
                    setWeight(patient_health.health_response.filter((item) => item.weight).map((item) => item.weight));
                    setHeight(patient_health.health_response.filter((item) => item.height).map((item) => item.height));
                    setAllergy(patient_health.allergy_response.filter((item) => item.allergy).map((item) => item.allergy));
                    setAcute(patient_health.therapy_response.filter((item) => item.acute).map((item) => item.acute));
                    setMedication(patient_health.therapy_response.filter((item) => item.issue).map((item) => item.issue));
                } else {
                    toast.error(resp.data.detail);
                }
                setIsLoading(false)
            })
            .catch((error) => {
                setIsLoading(false)
                // console.log('catch error >>> ', error);
                toast.error(error);
            });
        } catch (e) {
            setIsLoading(false)
            // console.log('catch error >>> ', e);
        }
    }
    useEffect(() => {
        fetchHealthDetail();
    },[]);

    // console.log("bloodPressure > ",bloodPressure);
    // console.log("weight > ",weight);
    return (
        <>
        {isLoading ? <LoadingSpinner /> : ""}
        <div className="pageContent pInfoPage">
            <Sidebar />
            <Header />
            <div className="BreadCrumb">
                <div className="container-fluid">
                    <Link to={ constants.ROUTE_HOME + constants.ROUTE_PATIENT_OVERVIEW } className="link">{patient?.patient_forename} {patient?.patient_surname} | #{patient?.patient_id}</Link>
                    <span>Patient Information</span>
                </div>
            </div>
            <div className="container-fluid mt-2">
                <div className="card">
                    <div className="card-header">
                        <h5>Patient Details</h5>
                    </div>
                    <div className="card-body">
                        <div className="pInfoRow">
                            <label>Patient Name:</label>
                            <p>{patient?.patient_forename} {patient?.patient_surname}</p>
                        </div>
                        <div className="pInfoRow">
                            <label>Patient Id Number:</label>
                            <p>#{patient?.patient_id}</p>
                        </div>
                        <div className="pInfoRow">
                            <label>Contact Number (Home):</label>
                            <p>{ patientInfo ? (patientInfo.phone_numbers?.find(numb => numb._type === 'H')?.number) : "-" }</p>
                        </div>
                        <div className="pInfoRow">
                            <label>Contact Number (Mobile):</label>
                            <p>{ patientInfo ? (patientInfo.phone_numbers?.find(numb => numb._type === 'M')?.number) : "-" }</p>
                        </div>
                        <div className="pInfoRow">
                            <label>Date of Birth:</label>
                            <p>{ (typeof patient.patient_date_of_birth !== "undefined") ? moment(patient.patient_date_of_birth).format('DD/MM/yyyy') : "" }</p>
                        </div>
                        <div className="pInfoRow">
                            <label>Blood Pressure:</label>
                            <p>{ bloodPressure.length > 0 && bloodPressure[0].systolic+'/'+bloodPressure[0].diastolic+' Last Measured: '+moment(bloodPressure[0].event_date).format('DD/MM/yyyy') }</p>
                        </div>
                        <div className="pInfoRow">
                            <label>Blood Test Results:</label>
                            <p>{ bloodTest.length > 0 && bloodTest[0].value+''+bloodTest[0].unit+' Last Measured: '+moment(bloodTest[0].event_date).format('DD/MM/yyyy') }</p>
                        </div>
                        <div className="pInfoRow">
                            <label>Weight:</label>
                            <p>{ weight.length > 0 && weight[0].value+''+weight[0].unit+' Last Measured: '+moment(weight[0].event_date).format('DD/MM/yyyy') }</p>
                        </div>
                        <div className="pInfoRow">
                            <label>Height:</label>
                            <p>{ height.length > 0 && height[0].value+''+height[0].unit+' Last Measured: '+moment(height[0].event_date).format('DD/MM/yyyy') }</p>
                        </div>
                    </div>
                </div>

                <div className="themeTabs mt-4">
                    <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                        <li className="nav-item" role="presentation">
                            <button className="nav-link active" data-bs-toggle="pill" data-bs-target="#tab1">Allergies</button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button className="nav-link" data-bs-toggle="pill" data-bs-target="#tab2">Acute Medication</button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button className="nav-link" data-bs-toggle="pill" data-bs-target="#tab3">Medication Usage</button>
                        </li>
                    </ul>
                    <div className="tab-content" id="pills-tabContent">
                        <div className="tab-pane fade show active" id="tab1" role="tabpanel" aria-labelledby="tab1">
                            {allergy.length !== 0 ? allergy.map((d) => {
                                return (
                                <div className="pInfoRow">
                                    <label>{d.category}<br/>{d.drug}</label>
                                    <p>Recorded : {moment(d.event_date).format('DD/MM/yyyy')}</p>
                                </div>
                                )
                            })
                            : "No record"
                        }
                        </div>
                        <div className="tab-pane fade" id="tab2" role="tabpanel" aria-labelledby="tab2">
                            {acute.length !== 0 ? acute.map((d) => {
                                return (
                                <div className="pInfoRow">
                                    <label>{d.drug_code}<br/>{d.dosage}</label>
                                    <p>Recorded : {moment(d.eventdate).format('DD/MM/yyyy')}</p>
                                </div>
                                )
                            }
                            ):"No record"}
                        </div>
                        <div className="tab-pane fade" id="tab3" role="tabpanel" aria-labelledby="tab3">
                            {medication.length !== 0 ? medication.map((d) => {
                                return (
                                <div className="pInfoRow">
                                    <label>{d.drug_code}<br/>{d.dosage}<br/>{d.drug_source}</label>
                                    <p>Recorded : {moment(d.eventdate).format('DD/MM/yyyy')}</p>
                                </div>
                                )
                            }
                            ): "No record"}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}
export default PatientInformation;
