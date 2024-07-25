import React from 'react';
import { Link } from "react-router-dom"
import { useLocation, useNavigate } from "react-router-dom"
import * as constants from '../../constants'
import { getUser, getPatient, logout, getStaffProfile } from '../../apiCalls';
import moment from 'moment'
// import Prescriber from '../Prescriber';
// import { useParams } from 'react-router-dom';

const Sidebar = () => {
    const navigate = useNavigate();

    const isPrescriber = getStaffProfile();

    const logoutUser = () => {
        logout(navigate);
    }
    const location = useLocation();
    //destructuring pathname from location
    const { pathname } = location;
    //Javascript split method to get the name of the path in array
    const splitLocation = pathname.split("/");

    const user = getUser();
    const patient = getPatient();

    if (splitLocation[1] === "patient-search") {
        return (
            <div className="sidebar">
                <div className="logoView">
                    <img src={constants.LOGO} className="img-fluid logo" alt="logo" />
                    {/*<button className="btn"><i className="bi bi-list"></i></button>*/}
                </div>
                <div className="userInfo">
                    <p>Not {user?.first_name} {user?.last_name}?</p>
                    <button className="btn" onClick={logoutUser}>Logout</button>
                </div>
            </div>
        )
    } else {
        return (
            <div className="sidebar">
                <div className="logoView">
                    <img src={constants.LOGO} className="img-fluid logo" alt="logo" />
                    {/* <button className="btn"><i className="bi bi-list"></i></button> */}
                </div>
                <div className="userInfo">
                    <p><span>Name:</span> {patient?.patient_forename} {patient?.patient_surname}</p>
                    <p><span>Id:</span> {patient?.patient_id}</p>
                    <p><span>DOB:</span> {(typeof patient.patient_date_of_birth !== "undefined") ? moment(patient.patient_date_of_birth).format('DD/MM/yyyy') : ""}</p>
                    <Link className="btn" to={constants.ROUTE_HOME + constants.ROUTE_PATIENT_SEARCH}><i className="bi bi-repeat"></i> Switch Patients</Link>
                </div>
                <ul className="menuList">
                    <li><Link to={constants.ROUTE_HOME + constants.ROUTE_PATIENT_OVERVIEW} className={`menuLink ${splitLocation[1] === constants.ROUTE_PATIENT_OVERVIEW && 'active'}`}><i className="bi bi-heart-pulse-fill"></i> Patients Overview</Link></li>
                    <li><Link to={constants.ROUTE_HOME + constants.ROUTE_PATIENT_INFORMATION} className={`menuLink ${splitLocation[1] === constants.ROUTE_PATIENT_INFORMATION && 'active'}`}><i className="bi bi-clipboard2-plus-fill"></i> Patients Information</Link></li>
                    <li><Link to={constants.ROUTE_HOME + constants.ROUTE_APPOINTMENTS_EVENTS} className={`menuLink ${splitLocation[1] === constants.ROUTE_APPOINTMENTS_EVENTS && 'active'}`}><i className="bi bi-calendar-event-fill"></i> Appointments & Events</Link></li>
                    <li><Link to={constants.ROUTE_HOME + constants.ROUTE_PRESCRIPTIONS} className={`menuLink ${splitLocation[1] === constants.ROUTE_PRESCRIPTIONS && 'active'}`}><i className="bi bi-file-earmark-plus-fill"></i> Prescriptions</Link></li>
                    <li><Link to={constants.ROUTE_HOME + constants.ROUTE_PHARMACIES} className={`menuLink ${splitLocation[1] === constants.ROUTE_PHARMACIES && 'active'}`}><i className="bi bi-plus-lg"></i> Pharmacies</Link></li>
                    <li><Link to={constants.ROUTE_HOME + constants.ROUTE_MEDICAL_HISTORY} className={`menuLink ${splitLocation[1] === constants.ROUTE_MEDICAL_HISTORY && 'active'}`}><i className="bi bi-file-plus-fill"></i> Medical History</Link></li>
                    <li><Link to={constants.ROUTE_HOME + constants.ROUTE_MESSAGE_CENTER} className={`menuLink ${splitLocation[1] === constants.ROUTE_MESSAGE_CENTER && 'active'}`}><i className="bi bi-envelope-fill"></i> Message Centre</Link></li>
                    <li><Link to={constants.ROUTE_HOME + constants.ROUTE_CONTACT_PREFERENCES} className={`menuLink ${splitLocation[1] === constants.ROUTE_CONTACT_PREFERENCES && 'active'}`}><i className="bi bi-person-lines-fill"></i> Contact Preferences</Link></li>
                </ul>
                {isPrescriber.Prescriber ?
                    <div className="pharmacistMenu">
                        <p>Clinical Pharmacist Menu:</p>
                        <ul className="menuList">
                            {/* <li><Link to="/overview" className="menuLink">Prescriptions Exemption</Link></li>
                        <li><Link to="/overview" className="menuLink">Admin Center</Link></li>
                        <li><Link to={constants.ROUTE_HOME + constants.ROUTE_TRIGGERS} className="menuLink">Triggers</Link></li>
                        <li><Link to={constants.ROUTE_HOME + constants.ROUTE_REMINDERS} className="menuLink">Reminders</Link></li>
                        <li><Link to={constants.ROUTE_HOME + constants.ROUTE_MEDICATION_COST} className="menuLink">Medication Costs</Link></li>
                        <li><Link to="/overview" className="menuLink">Medication List</Link></li> */}
                            <li><Link to={constants.ROUTE_HOME + constants.ROUTE_MEDICATION_REVIEW} className="menuLink">Medication Review</Link></li>
                            <li><Link to={constants.ROUTE_HOME + constants.ROUTE_MEDICINES_USAGE} className="menuLink">Medicines Usage</Link></li>
                        </ul>
                    </div>
                 : null}
            </div>
        )
    }

}
export default Sidebar;
