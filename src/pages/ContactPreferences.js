import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { callApi, getAccessToken, getPatient } from '../apiCalls';
import * as constants from '../constants/api';
import Sidebar from '../components/sidebar';
import Header from '../components/header';
import LoadingSpinner from "../components/LoadingSpinner";
import { Link } from "react-router-dom"

const ContactPreferences = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [contactInfo, setContactInfo] = useState({
        patientContactAddress: [],
        patientContact: [],
        patientMail: "",
        patientPostCode: "",
        patientMobile: "",
        patientCountry: "",
        patientTown: "",
        patientRoadName: "",
        patientHouseNumber: "",
        patientHouseName: "",
    });

    const contact_detail = getPatient();

    useEffect(() => {
        fetchContact();
    }, [])

    const set = (name) => {
        return ({ target: { value } }) => {
            setContactInfo(oldValues => ({ ...oldValues, [name]: value }));
        }
    }

    const saveContactDetail = (address, contact) => {
        if (address || contact) {
            setContactInfo(prevState => ({
                ...prevState,
                patientContactAddress: address,
                patientContact: contact,
                patientMail: contact?.find(el => el.type[0].display === 'Email')?.value,
                patientMobile: contact?.find(el => el.type[0].display === 'Mobile phone')?.value,
                patientPostCode: address[0]?.postCode,
                patientCountry: address[0]?.countyName,
                patientTown: address[0]?.townName,
                patientRoadName: address[0]?.roadName,
                patientHouseNumber: address[0]?.houseNumber,
                patientHouseName: address[0]?.houseName,
            }));
        }
    };

    const fetchContact = () => {
        setIsLoading(true)
        const staffPatientContactRecord = {
            method: 'post',
            url: constants.API_STAFF_PATIENT_CONTACT_RECORD,
            data: {
                "patientIdAtOrganisation": contact_detail.patient_organisation_id,
                "dob": contact_detail.patient_date_of_birth
            }
        }
        callApi([staffPatientContactRecord], getAccessToken()).then((response) => {
            let StaffPatientContactRecordResponse = response[constants.API_STAFF_PATIENT_CONTACT_RECORD];
            if (StaffPatientContactRecordResponse.success) {
                saveContactDetail(response.StaffPatientContactRecord.data?.addresses, response.StaffPatientContactRecord.data?.contacts);
            } else {
                toast.error("Something went wrong!");
                console.log(constants.API_STAFF_PATIENT_CONTACT_RECORD + "error>>>" + StaffPatientContactRecordResponse);
            }
            setIsLoading(false)
        }).catch((error) => {
            setIsLoading(false)
            console.log('catch error >>> ', error);
        });
    }

    return (
        <>
            {isLoading ? <LoadingSpinner /> : ""}
            <div className="pageContent contactPrefPage">
                <Sidebar />
                <Header />
                <div className="BreadCrumb">
                    <div className="container-fluid">
                        <Link to="/overview" className="link">{contact_detail.patient_forename} {contact_detail.patient_surname} | #{contact_detail.patient_id}</Link>
                        <span>Contact Preferences</span>
                    </div>
                </div>
                <div className="container-fluid mt-2">
                    <div className="card themeCard">
                        <div className="card-header">
                            <h5>ContactPreferences</h5>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-lg-6">
                                    <div className="pInfoRow">
                                        <label>Patient Name:</label>
                                        <div className="inputView">
                                            <input type="text" className="form-control" name="name" placeholder="patient name" value={contact_detail.patient_forename + " " + contact_detail.patient_surname} />
                                            <button type="button" className="btn"><i className="bi bi-pencil"></i></button>
                                        </div>
                                    </div>
                                    <div className="pInfoRow">
                                        <label>Contact Number:</label>
                                        <div className="inputView">
                                            <input type="text" className="form-control" name="contactNumber" placeholder="contact number" value={contactInfo.patientMobile} onChange={set('patientMobile')} />
                                            <button type="button" className="btn"><i className="bi bi-pencil"></i></button>
                                        </div>
                                    </div>
                                    <div className="pInfoRow">
                                        <label>Email Address:</label>
                                        <div className="inputView">
                                            <input type="text" className="form-control" name="email" placeholder="email address" value={contactInfo.patientMail} onChange={set('patientMail')} />
                                            <button type="button" className="btn"><i className="bi bi-pencil"></i></button>
                                        </div>
                                    </div>
                                    <div className="pInfoRow">
                                        <label>Address:</label>
                                        <div className="inputView">
                                            <input type="text" className="form-control" name="address" placeholder="address" value={contactInfo.patientHouseNumber} onChange={set('patientHouseNumber')} />
                                            <button type="button" className="btn"><i className="bi bi-pencil"></i></button>
                                        </div>
                                    </div>
                                    <div className="pInfoRow">
                                        <label>&nbsp;</label>
                                        <div className="inputView">
                                            <input type="text" className="form-control" name="address2" placeholder="address line 2" value={contactInfo.patientRoadName} onChange={set('patientRoadName')} />
                                            <button type="button" className="btn"><i className="bi bi-pencil"></i></button>
                                        </div>
                                    </div>
                                    <div className="pInfoRow">
                                        <label>&nbsp;</label>
                                        <div className="inputView">
                                            <input type="text" className="form-control" name="address3" placeholder="address line 3" value={contactInfo.patientTown} onChange={set('patientTown')} />
                                            <button type="button" className="btn"><i className="bi bi-pencil"></i></button>
                                        </div>
                                    </div>
                                    <div className="pInfoRow">
                                        <label>&nbsp;</label>
                                        <div className="inputView">
                                            <input type="text" className="form-control" name="address4" placeholder="address line 4" value={contactInfo.patientCountry} onChange={set('patientCountry')} />
                                            <button type="button" className="btn"><i className="bi bi-pencil"></i></button>
                                        </div>
                                    </div>
                                    <div className="pInfoRow">
                                        <label>&nbsp;</label>
                                        <div className="inputView">
                                            <input type="text" className="form-control" name="address5" placeholder="address line 5" value={contactInfo.patientPostCode} onChange={set('patientPostCode')} />
                                            <button type="button" className="btn"><i className="bi bi-pencil"></i></button>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="pInfoRow">
                                        <label>Preferred method of contact:</label>
                                        <input className="form-check-input" type="checkbox" value="" id="check1" />
                                    </div>
                                    <div className="pInfoRow">
                                        <label>&nbsp;</label>
                                        <input className="form-check-input" type="checkbox" value="" id="check2" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default ContactPreferences;
