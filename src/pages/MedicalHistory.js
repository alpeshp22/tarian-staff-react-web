import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import * as constants from '../constants';
import { callApi, getAccessToken, getPatient } from '../apiCalls';
import Sidebar from '../components/sidebar';
import Header from '../components/header';
import LoadingSpinner from "../components/LoadingSpinner";
import { Link, useNavigate } from "react-router-dom"

const MedicalHistory = () => {
    const [isLoading, setIsLoading] = useState(false);
    const patient = getPatient();
    const navigate = useNavigate();
    const [immunisation, setImmunisation] = useState([]);
    const [referral, setReferral] = useState([]);
    const [therapy, setTherapy] = useState([]);
    const [problem, setProblem] = useState([]);
    const [score, setScore] = useState([]);
    const [bp, setBp] = useState([]);

    const details = () => {
        try {
            setIsLoading(true);
            const fetchDetails = {
                method: 'post',
                url: constants.API_STAFF_MEDICAL_HISTORY,
                data: {
                    "patientIdAtOrganisation": patient.patient_organisation_id,
                    "dob": patient.patient_date_of_birth
                }
            }

            callApi([fetchDetails], getAccessToken(), navigate).then((response) => {
                let resp = response[constants.API_STAFF_MEDICAL_HISTORY];
                if (resp.success) {
                    console.log(resp.data.medical_history_summary);
                    setImmunisation(resp.data.medical_history_summary?.immunisations);
                    setReferral(resp.data.medical_history_summary?.referrals);
                    setTherapy(resp.data.medical_history_summary?.therapy);
                    setProblem(resp.data.medical_history_summary?.problems);
                    setScore(resp.data.medical_history_summary?.score);
                    setBp(resp.data.medical_history_summary?.bp);
                } else {
                    toast.error(resp.data.detail)
                }
                setIsLoading(false);
            })
        } catch (e) {
            setIsLoading(false);
            console.log(e);
            toast.error("Something went wrong!")
        }
    }
    useEffect(() => {
        details();
    },[]);

    const btns = () => {
        return (
            <>
                <Link to={constants.ROUTE_HOME + constants.ROUTE_PRESCRIPTIONS} className="btn btn-green me-3">Prescriptions</Link>
                <Link to={constants.ROUTE_HOME + constants.ROUTE_PHARMACIES} className="btn btn-green">Pharmacies</Link>
            </>
        )
    }
    return (
        <>
            {isLoading ? <LoadingSpinner /> : ""}
            <div className="pageContent medicalHistoryPage">
                <Sidebar />
                <Header />
                <div className="BreadCrumb">
                    <div className="container-fluid">
                        <Link to={constants.ROUTE_HOME + constants.ROUTE_PATIENT_OVERVIEW} className="link">{patient?.patient_forename} | #{patient?.patient_id}</Link>
                        <span>Medical History</span>
                    </div>
                </div>
                <div className="container-fluid mt-2">
                    <div className="themeTabs">
                        <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                            <li className="nav-item" role="presentation">
                                <button className="nav-link active" data-bs-toggle="pill" data-bs-target="#tab1">
                                    Immunisation
                                </button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button className="nav-link" data-bs-toggle="pill" data-bs-target="#tab2">
                                    Referrals
                                </button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button className="nav-link" data-bs-toggle="pill" data-bs-target="#tab3">
                                    Therapy
                                </button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button className="nav-link" data-bs-toggle="pill" data-bs-target="#tab4">
                                    Problems
                                </button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button className="nav-link" data-bs-toggle="pill" data-bs-target="#tab5">
                                    Score
                                </button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button className="nav-link" data-bs-toggle="pill" data-bs-target="#tab6">
                                    Blood Pressure
                                </button>
                            </li>
                        </ul>
                        <div className="tab-content" id="pills-tabContent">
                            <div className="tab-pane fade show active" id="tab1" role="tabpanel" aria-labelledby="tab1">
                                <table className="table themeTable">
                                    <tbody>
                                        {immunisation?.length > 0 ?
                                            immunisation.map((immun, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>
                                                            <p>{immun.immunisation.immunisation_type}
                                                                <span>{immun.immunisation.text}</span>
                                                            </p>
                                                        </td>
                                                        <td className="dataTd"><p>{immun.immunisation.eventdate}</p></td>
                                                    </tr>
                                                )
                                            })
                                            : "No records right now"
                                        }
                                    </tbody>
                                </table>
                                <div className="btnView mt-4">
                                    {btns()}
                                </div>
                            </div>
                            <div className="tab-pane fade" id="tab2" role="tabpanel" aria-labelledby="tab2">
                                <table className="table themeTable">
                                    <tbody>
                                        {referral?.length > 0 ?
                                            referral.map((refe, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>
                                                            <p>
                                                                {refe.referral.text}
                                                                <span>{refe.referral.source}</span>
                                                                <span>{refe.referral.urgency}</span>
                                                            </p>
                                                        </td>
                                                        <td className="dataTd"><p>{refe.referral.eventdate}</p></td>
                                                    </tr>
                                                )
                                            })
                                            : "No records right now"
                                        }
                                    </tbody>
                                </table>
                                <div className="btnView mt-4">
                                    {btns()}
                                </div>
                            </div>
                            <div className="tab-pane fade" id="tab3" role="tabpanel" aria-labelledby="tab3">
                                <table className="table themeTable">
                                    <tbody>
                                        {therapy?.length > 0 ?
                                            therapy.map((thera, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>
                                                            <p>
                                                                {thera.therapy.drug_code}
                                                                <span>{thera.therapy.dosage}</span>
                                                            </p>
                                                        </td>
                                                        <td className="dataTd"><p>{thera.therapy.eventdate}</p></td>
                                                    </tr>
                                                )
                                            })
                                            : "No records right now"
                                        }
                                    </tbody>
                                </table>
                                <div className="btnView mt-4">
                                    {btns()}
                                </div>
                            </div>
                            <div className="tab-pane fade" id="tab4" role="tabpanel" aria-labelledby="tab4">
                                <table className="table themeTable">
                                    <tbody>
                                        {problem?.length > 0 ?
                                            problem.map((probl, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>
                                                            <p>
                                                                {probl.problem.text}
                                                            </p>
                                                        </td>
                                                        <td className="dataTd"><p>{probl.problem.event_date}</p></td>
                                                    </tr>
                                                )
                                            })
                                            : "No records right now"
                                        }
                                    </tbody>
                                </table>
                                <div className="btnView mt-4">
                                    {btns()}
                                </div>
                            </div>
                            <div className="tab-pane fade" id="tab5" role="tabpanel" aria-labelledby="tab5">
                                <table className="table themeTable">
                                    <tbody>
                                        {score?.length > 0 ?
                                            score.map((scor, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>
                                                            <p>
                                                                {scor.score.text}
                                                            </p>
                                                        </td>
                                                        <td className="dataTd"><p>{scor.score.eventdate}</p></td>
                                                    </tr>
                                                )
                                            })
                                            : "No records right now"
                                        }
                                    </tbody>
                                </table>
                                <div className="btnView mt-4">
                                    {btns()}
                                </div>
                            </div>
                            <div className="tab-pane fade" id="tab6" role="tabpanel" aria-labelledby="tab6">
                                <table className="table themeTable">
                                    <tbody>
                                        {bp?.length > 0 ?
                                            bp.map((bp, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>
                                                            <p>{bp.bp.text}
                                                                <span>{bp.bp.systolic}/{bp.bp.diastolic}</span>
                                                            </p>
                                                        </td>
                                                        <td className="dataTd"><p>{bp.bp.event_date}</p></td>
                                                    </tr>
                                                )
                                            })
                                            : "No records right now"
                                        }
                                    </tbody>
                                </table>
                                <div className="btnView mt-4">
                                    {btns()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default MedicalHistory;
