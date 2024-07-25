import React, { Suspense } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import * as constants from './constants'
import Guestroute from './components/Guestroute';
import Authroute from './components/Authroute';
import Patientroute from './components/Patientroute';
import LoadingSpinner from "./components/LoadingSpinner";
import Prescriber from './components/Prescriber';


// import logo from './logo.svg';
import 'react-toastify/dist/ReactToastify.css';
import 'react-confirm-alert/src/react-confirm-alert.css';
import './App.css';
import "react-datepicker/dist/react-datepicker.css";
import './assets/css/style.css';
import './assets/css/responsive.css';
import './assets/js/common.js';

// pages
const Login = React.lazy(() => import('./pages/auth/Login'))
const ForgotPassword = React.lazy(() => import('./pages/auth/ForgotPassword'))
const Overview = React.lazy(() => import('./pages/Overview'))
const PatientInformation = React.lazy(() => import('./pages/PatientInformation'))
const PatientSearch = React.lazy(() => import('./pages/PatientSearch'))
const MedicalHistory = React.lazy(() => import('./pages/MedicalHistory'))
const Pharmacies = React.lazy(() => import('./pages/Pharmacies'))
const MessageCentre = React.lazy(() => import('./pages/MessageCentre'))
const ComposeNewMessage = React.lazy(() => import('./pages/ComposeNewMessage'))
const ContactPreferences = React.lazy(() => import('./pages/ContactPreferences'))
const Appointments = React.lazy(() => import('./pages/Appointments'))
const Prescriptions = React.lazy(() => import('./pages/Prescriptions'))
const CreateNewAppointment = React.lazy(() => import('./pages/CreateNewAppointment'))
const Reminders = React.lazy(() => import('./pages/Reminders'))
const CreateNewReminder = React.lazy(() => import('./pages/CreateNewReminder'))
const Triggers = React.lazy(() => import('./pages/Triggers'))
const CreateTrigger = React.lazy(() => import('./pages/CreateTrigger'))
const MedicationCost = React.lazy(() => import('./pages/MedicationCost'))
const MedicationReview = React.lazy(() => import('./pages/MedicationReview'))
const MedicinesUsage = React.lazy(() => import('./pages/MedicinesUsage'))

function App() {
    return (
        <>
            <BrowserRouter>
                <Suspense fallback={<LoadingSpinner />}>
                    <Routes>
                        <Route element={<Guestroute />}>
                            <Route path="/" name="Home" element={<Login />} />
                            <Route path={constants.ROUTE_LOGIN} name="Login Page" element={<Login />} />
                            <Route path={constants.ROUTE_FORGOT_PASSWORD} name="Forgot Password" element={<ForgotPassword />} />
                        </Route>
                        <Route element={<Authroute />}>
                            <Route path={constants.ROUTE_PATIENT_SEARCH} name="Patient Search" element={<PatientSearch />} />
                            <Route element={<Patientroute />}>
                                <Route path={constants.ROUTE_PATIENT_OVERVIEW} name="Patient Overview" element={<Overview />} />
                                <Route path={constants.ROUTE_PATIENT_INFORMATION} name="Patient Information" element={<PatientInformation />} />
                                <Route path={constants.ROUTE_APPOINTMENTS_EVENTS} name="Patient Information" element={<Appointments />} />
                                <Route path={constants.ROUTE_PRESCRIPTIONS} name="Prescriptions" element={<Prescriptions />} />
                                <Route path={constants.ROUTE_PHARMACIES} name="Pharmacies" element={<Pharmacies />} />
                                <Route path={constants.ROUTE_MEDICAL_HISTORY} name="Medical History" element={<MedicalHistory />} />
                                <Route path={constants.ROUTE_MESSAGE_CENTER} name="Message Centre" element={<MessageCentre />} />
                                <Route path={constants.ROUTE_CONTACT_PREFERENCES} name="Contact Preferences" element={<ContactPreferences />} />
                            </Route>
                            <Route element={<Authroute />}>
                                <Route path={constants.ROUTE_PATIENT_SEARCH} name="Patient Search" element={<PatientSearch />} />
                                <Route element={<Patientroute />}>
                                    <Route path={constants.ROUTE_PATIENT_OVERVIEW} name="Patient Overview" element={<Overview />} />
                                    <Route path={constants.ROUTE_PATIENT_INFORMATION} name="Patient Information" element={<PatientInformation />} />
                                    <Route path={constants.ROUTE_APPOINTMENTS_EVENTS} name="Appointment & Events" element={<Appointments />} />
                                    <Route path={constants.ROUTE_APPOINTMENT_CREATE} name="Create Appointment" element={<CreateNewAppointment />} />
                                    <Route path={constants.ROUTE_PRESCRIPTIONS} name="Patient Information" element={<PatientInformation />} />
                                    <Route path={constants.ROUTE_PHARMACIES} name="Pharmacies" element={<Pharmacies />} />
                                    <Route path={constants.ROUTE_MEDICAL_HISTORY} name="Medical History" element={<MedicalHistory />} />
                                    <Route path={constants.ROUTE_MESSAGE_CENTER} name="Message Centre" element={<MessageCentre />} />
                                    <Route path={constants.ROUTE_MESSAGE_COMPOSE} name="Compose New Message" element={<ComposeNewMessage />} />
                                    <Route path={constants.ROUTE_CONTACT_PREFERENCES} name="Contact Preferences" element={<ContactPreferences />} />
                                    <Route path={constants.ROUTE_REMINDERS} name="Reminders" element={<Reminders />} />
                                    <Route path={constants.ROUTE_CREATE_REMINDER} name="Create a New Reminder" element={<CreateNewReminder />} />
                                    <Route path={constants.ROUTE_TRIGGERS} name="Triggers" element={<Triggers />} />
                                    <Route path={constants.ROUTE_CREATE_TRIGGER} name="Create a New Trigger" element={<CreateTrigger />} />
                                    <Route path={constants.ROUTE_MEDICATION_COST} name="Medication Cost" element={<MedicationCost />} />
                                    <Route element={<Prescriber/>}>
                                        <Route path={constants.ROUTE_MEDICATION_REVIEW} name="Medication Review" element={<MedicationReview />} />
                                        <Route path={constants.ROUTE_MEDICINES_USAGE} name="Medicines Usage" element={<MedicinesUsage/>} />
                                    </Route>
                                </Route>
                            </Route>
                        </Route>
                    </Routes>
                </Suspense>
            </BrowserRouter>
            <ToastContainer theme="colored" />
            {/* <button onClick={displayLoginNotification}>Log me In</button> */}
        </>
    );
}

export default App;
