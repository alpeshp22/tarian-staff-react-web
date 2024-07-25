import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import * as constants from '../constants'
import { useNavigate } from "react-router-dom"
import { callApi, getAccessToken, getPatient } from '../apiCalls';
import Sidebar from '../components/sidebar';
import Header from '../components/header';
import LoadingSpinner from "../components/LoadingSpinner";
import { Link } from "react-router-dom"
import moment from 'moment'

const Appointments = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isLoading2, setIsLoading2] = useState(false);
    const [appointmentDetails, setAppointmentDetails] = useState([]);
    const [timeLine, setTimeLine] = useState([]);
    const patient = getPatient();

    const fetchAppDet = (appType) => {
        setAppointmentDetails([]);
        try {
            setIsLoading(true);
            const params = {
                method: 'get',
                url: constants.API_STAFF_APPOINTMENT_DETAIL + `/${appType}`
            };
            callApi([params], getAccessToken(), navigate).then((response) => {
                console.log("API_STAFF_APPOINTMENT_DETAIL > ", response);
                let resp = response[constants.API_STAFF_APPOINTMENT_DETAIL + '/' + appType];
                if (resp.success) {
                    if (resp.data.patient_appointments?.slots) {
                        setAppointmentDetails(resp.data.patient_appointments.slots.slot);
                    } else {
                        setAppointmentDetails([]);
                    }
                } else {
                    toast.error('No result found, try after sometimes');
                }
                setIsLoading(false)
            });
        } catch (e) {
            setIsLoading(false)
            toast.error('something went wrong!');
        }
    }

    const eventTimeline = () => {
        try {
            setIsLoading2(true)
            const timelineCall = {
                method: 'post',
                url: constants.API_STAFF_PATIENT_TIMELINE,
                data: {
                    "patientIdAtOrganisation": patient.patient_organisation_id,
                    "dob": patient.patient_date_of_birth,
                    "filter": [
                        "appointments"
                    ],
                    "appointment_filter": [
                        "future",
                        "past"
                    ],
                    "startDate": moment(new Date()).format("YYYY-MM-DD"),
                    "Durations": {
                        "pre": "P6M",
                        "post": "P3M"
                    },
                    "sorted": "True"
                }
            }
            callApi([timelineCall], getAccessToken(), navigate).then((response) => {
                console.log("API_STAFF_APPOINTMENT_TIMELINE > ", response);
                let resp = response[constants.API_STAFF_PATIENT_TIMELINE]
                if (resp.success) {
                    setTimeLine(resp.data.timeline_results)
                } else {
                    toast.error(resp.data.detail);
                }
                setIsLoading2(false)
            })
        } catch (e) {
            setIsLoading2(false)
            toast.error('Something went wrong! Please try refreshing page again')
        }
    }

    useEffect(() => {
        fetchAppDet("future");
        eventTimeline();
    }, []);

    function cancel(slot_id, reason_id) {
        confirmAlert({
            title: 'Cancel Appointment',
            message: `Are you sure you want to cancel the appointment?`,
            buttons: [
                {
                    label: 'No',
                },
                {
                    label: 'Yes',
                    onClick: () => {
                        setIsLoading(true);
                        let cancelurl = constants.API_STAFF_CANCEL_BOOKING + '/' + slot_id + '/' + reason_id;
                        const params = {
                            method: 'post',
                            url: cancelurl,
                        };

                        callApi([params], getAccessToken(), navigate).then((response) => {
                            let resp = response[cancelurl];
                            console.log(' resp >>> ', resp);
                            if (resp.success) {
                                fetchAppDet("all");
                            } else {
                                toast.error(resp.data.detail);
                            }
                            setIsLoading(false)
                        })
                            .catch((error) => {
                                setIsLoading(false)
                                console.log('catch error >>> ', error);
                            });
                    }
                }
            ]
        });
    };

    function rebook(slot_id, reason_id) {
        confirmAlert({
            title: 'Rebook Appointment',
            message: `Are you sure you want to rebook the appointment?`,
            buttons: [
                {
                    label: 'No',
                },
                {
                    label: 'Yes',
                    onClick: () => {
                        setIsLoading(true);
                        let cancelurl = constants.API_STAFF_CANCEL_BOOKING + '/' + slot_id + '/' + reason_id;
                        const params = {
                            method: 'post',
                            url: cancelurl,
                        };

                        callApi([params], getAccessToken(), navigate).then((response) => {
                            let resp = response[cancelurl];
                            console.log(' resp >>> ', resp);
                            if (resp.success) {
                                fetchAppDet("all");
                            } else {
                                toast.error(resp.data.detail);
                            }
                            navigate("/"+constants.ROUTE_APPOINTMENT_CREATE);
                            setIsLoading(false)
                        })
                            .catch((error) => {
                                setIsLoading(false)
                                console.log('catch error >>> ', error);
                            });
                    }
                }
            ]
        });
    };
    return (
        <>
            {isLoading ? <LoadingSpinner /> : ""}
            <div className="pageContent appointmentsPage">
                <Sidebar />
                <Header />
                <div className="BreadCrumb">
                    <div className="container-fluid">
                        <Link to={constants.ROUTE_HOME + constants.ROUTE_PATIENT_OVERVIEW} className="link">{patient?.patient_forename} {patient?.patient_surname} | #{patient?.patient_id}</Link>
                        <span>Appointments</span>
                        <div className="ms-auto">
                            <Link to={constants.ROUTE_HOME + constants.ROUTE_APPOINTMENT_CREATE} className="btn btn-green">Create a New Appointments</Link>
                        </div>
                    </div>
                </div>
                <div className="container-fluid mt-2">
                    <div className="card themeCard appoListCard">
                        <div className="card-header">
                            <h5>Appointments List</h5>
                        </div>
                        <div className="card-body p-0">
                            <div className="themeTabs">
                                <ul className="nav nav-pills" id="pills-tab" role="tablist">
                                    {/* <li className="nav-item" role="presentation">
                                        <button className="nav-link active" data-bs-toggle="pill" data-bs-target="#appTab1" onClick={() => fetchAppDet("all")}>
                                            All Appointments
                                        </button>
                                    </li> */}
                                    <li className="nav-item" role="presentation">
                                        <button className="nav-link active" data-bs-toggle="pill" data-bs-target="#appTab2" onClick={() => fetchAppDet("future")}>
                                            Upcoming Appointments
                                        </button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <button className="nav-link" data-bs-toggle="pill" data-bs-target="#appTab3" onClick={() => fetchAppDet("past")}>
                                            Past Appointments
                                        </button>
                                    </li>
                                </ul>
                                <div className="tab-content p-0" id="pills-tabContent">
                                    {/* <div className="tab-pane fade show active" id="appTab1" role="tabpanel" aria-labelledby="appTab1">
                                        <table className="table appointmentsListTable">
                                            <tbody>
                                                {
                                                    appointmentDetails.length > 0 ? appointmentDetails.map(detail => {
                                                        return (
                                                            <tr key={detail.entity_id}>
                                                                <td>{moment(detail._starts_at).format('dddd DD MMM yyyy')}</td>
                                                                <th>{moment(detail._starts_at).format('HH:mm')}</th>
                                                                <td>{detail.comment}</td>
                                                                <td>{patient.surgery_name}</td>
                                                                <td>
                                                                    <div className="dropdown">
                                                                        <button className="btn" type="button" id="appListAction1" data-bs-toggle="dropdown" aria-expanded="false">
                                                                            <i className="bi bi-three-dots-vertical"></i>
                                                                        </button>
                                                                        <ul className="dropdown-menu" aria-labelledby="appListAction1">
                                                                            <li><a className="dropdown-item" href="javascript:void(0)">Rebook Appointment</a></li>
                                                                            {
                                                                                (typeof detail._cancel_reason === "undefined") ?
                                                                                    <li><a className="dropdown-item" href="javascript:void(0)" onClick={() => cancel(detail.entity_id, 4)}>Cancel Appointment</a></li>
                                                                                    : ""
                                                                            }
                                                                        </ul>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })
                                                        :
                                                        <tr><td colSpan="5">No appointments found!</td></tr>
                                                }
                                            </tbody>
                                        </table>
                                    </div> */}
                                    <div className="tab-pane fade show active" id="appTab2" role="tabpanel" aria-labelledby="appTab2">
                                        <table className="table appointmentsListTable">
                                            <tbody>
                                                {
                                                    appointmentDetails.length > 0 ? appointmentDetails.map((detail,index) => {
                                                        return (
                                                            <tr key={index}>
                                                                <td>{moment(detail._starts_at).format('dddd DD MMM yyyy')}</td>
                                                                <th>{moment(detail._starts_at).format('HH:mm')}</th>
                                                                <td>{detail.comment}</td>
                                                                <td>{patient.surgery_name}</td>
                                                                <td>
                                                                    <div className="dropdown">
                                                                        <button className="btn" type="button" id="appListAction1" data-bs-toggle="dropdown" aria-expanded="false">
                                                                            <i className="bi bi-three-dots-vertical"></i>
                                                                        </button>
                                                                        <ul className="dropdown-menu" aria-labelledby="appListAction1">
                                                                            <li><button className="dropdown-item" onClick={() => rebook(detail.entity_id, 4)}>Rebook Appointment</button></li>
                                                                            {
                                                                                (typeof detail._cancel_reason !== "undefined") ?
                                                                                    <li><button className="dropdown-item" onClick={() => cancel(detail.entity_id, 4)}>Cancel Appointment</button></li>
                                                                                    : ""
                                                                            }
                                                                        </ul>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })
                                                        :
                                                        <tr><td colSpan="5">No future appointments found!</td></tr>
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="tab-pane fade" id="appTab3" role="tabpanel" aria-labelledby="appTab3">
                                        <table className="table appointmentsListTable">
                                            <tbody>
                                                {
                                                    appointmentDetails.length > 0 ? appointmentDetails.map((detail,index) => {
                                                        return (
                                                            <tr key={index}>
                                                                <td>{moment(detail._starts_at).format('dddd DD MMM yyyy')}</td>
                                                                <th>{moment(detail._starts_at).format('HH:mm')}</th>
                                                                <td>{detail.comment}</td>
                                                                <td>{patient.surgery_name}</td>
                                                                <td>
                                                                    <div className="dropdown">
                                                                        <button className="btn" type="button" id="appListAction1" data-bs-toggle="dropdown" aria-expanded="false">
                                                                            <i className="bi bi-three-dots-vertical"></i>
                                                                        </button>
                                                                        <ul className="dropdown-menu" aria-labelledby="appListAction1">
                                                                            <li><button className="dropdown-item" onClick={() => rebook(detail.entity_id, 4)}>Rebook Appointment</button></li>
                                                                        </ul>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })
                                                        :
                                                        <tr><td colSpan="5">No past appointments found!</td></tr>
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card themeCard">
                        <div className="card-header">
                            <h5>Events Timeline</h5>
                        </div>
                        {isLoading2 ? <LoadingSpinner /> : ""}
                        <div className="card-body">
                            <ul className="events-timeline">
                                {timeLine?.length > 0 ?
                                    timeLine.map((timelin,index) => {
                                        return (
                                            timelin.event?.slot !== null ? 
                                            <li key={index}>
                                                <div className="date">
                                                    <h5>{timelin.event._starts_at ? moment(timelin.event._starts_at).format('dddd DD MMM yyyy') : moment(timelin.event.event_date).format('dddd DD MMM yyyy')}</h5>
                                                    <span>{timelin.event._starts_at ? moment(timelin.event._starts_at).format('HH:mm') : null}</span>
                                                </div>
                                                <div className="info">
                                                    <p>Appointment Type: {timelin.event.comment ? timelin.event.comment : "No type present"}</p>
                                                    <p>Location: {patient.surgery_name}</p>
                                                    {/* <p>Preferred Doctor: {patientInfo.usualgp}</p> */}
                                                    <div className="btns">
                                                        {(timelin.event.appointment_type || timelin.event.apppoinment_type) !== 'past' ?
                                                            <>
                                                                <button className="btn btn-orange" onClick={() => rebook(timelin.entity_id, 4)}>Rebook Appointment</button>
                                                                <button className="btn btn-red" onClick={() => cancel(timelin.entity_id, 4)}>Cancel Appointment</button>
                                                            </>
                                                            : null
                                                        }
                                                    </div>
                                                </div>
                                            </li>
                                            : ""
                                        )
                                    }) : null
                                }
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Appointments;
