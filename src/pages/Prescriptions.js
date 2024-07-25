import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import * as constants from '../constants'
import { callApi, getAccessToken, getPatient } from '../apiCalls';
import Sidebar from '../components/sidebar';
import Header from '../components/header';
import PrescriptionsList from '../components/views/prescriptionsList'
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import LoadingSpinner from '../components/LoadingSpinner';

const Prescriptions = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [recordRepeat, setRecordRepeat] = useState([]);
    const [recordPast, setRecordPast] = useState([]);
    const [getLocation, setGetLocation] = useState([]);
    const [getStatus, setGetStatus] = useState("");
    const navigate = useNavigate();
    const patient = getPatient();
    const [orderRepeat, setOrderRepeat] = useState([]);
    const [addressId, setAddressId] = useState('');
    const [ch, setCh] = useState(false);

    useEffect(() => {
        getRecordRepeat();
        try {
            setIsLoading(true);

            const userPharmacyDetail = {
                method: "get",
                url: constants.API_STAFF_USER_PHARMACY_DETAIL
            }

            callApi([userPharmacyDetail], getAccessToken(), navigate).then((response) => {
                let resp = response[constants.API_STAFF_USER_PHARMACY_DETAIL]
                if (resp.success) {
                    setGetLocation(resp.data.Pharmacy_list)
                } else {
                    toast.error(resp.data.detail);
                }
                setIsLoading(false);
            })
        } catch (e) {
            setIsLoading(false);
            toast.error('Something went wrong');
        }
    }, []);

    const getRecordRepeat = () => {
        try {
            setIsLoading(true);
            const fetchRecordRepeat = {
                method: 'post',
                url: constants.API_CARE_RECORD_REPEAT_SUMMARY,
                data: {
                    "patientIdAtOrganisation": patient.patient_organisation_id,
                    "dob": patient.patient_date_of_birth
                }
            }

            callApi([fetchRecordRepeat], getAccessToken(), navigate).then((response) => {
                let resp = response[constants.API_CARE_RECORD_REPEAT_SUMMARY]
                if (resp.success) {
                    setRecordRepeat(resp.data.repeats.active)
                    setRecordPast(resp.data.repeats.inactive)
                } else {
                    toast.error(resp.data.detail);
                }
                setIsLoading(false);
            })
        } catch (e) {
            console.log(e);
            setIsLoading(false);
            toast.error('Something went wrong!')
        }
    }

    const confirmOrderRepeat = (orderRepeat) => {
        if (addressId) {
            try {
                setIsLoading(true)
                const confirmOrder = {
                    method: "post",
                    url: constants.API_CONFIRM_ORDER_REPEAT_PRESCRIPTION,
                    data: {
                        "medication": [
                            {
                                "pharmacy_locationID": addressId,
                                "pharmacy_delivery": "True",
                                "patient_addressID": 1,
                                "items": orderRepeat.map((rep) => ({
                                    "drug_code_display": rep.drug_code_display,
                                    "drug_code": rep.drug_code,
                                    "quantity": rep.quantity,
                                    "dosage": rep.dosage,
                                    "packsize": rep.packsize,
                                    "max_issues": rep.max_issues,
                                    "drugsource": rep.drugsource,
                                }))
                            }
                        ]
                    }
                }
                callApi([confirmOrder], getAccessToken(), navigate).then((response) => {
                    let resp = response[constants.API_CONFIRM_ORDER_REPEAT_PRESCRIPTION]
                    if (resp.success && !resp.data.error) {
                        toast.success('Order is successfully placed');
                        setCh(true);
                    } else {
                        toast.error(resp.data.error);
                    }
                    setIsLoading(false)
                })
            } catch (e) {
                setIsLoading(false);
                toast.error('Something went wrong')
            }
        } else {
            toast.error('Please select pharmacy');
        }
    }
    return (
        <>
            {isLoading ? <LoadingSpinner /> : ""}
            <div className="pageContent prescriptionsPage">
                <Sidebar />
                <Header />
                <div className="BreadCrumb">
                    <div className="container-fluid">
                        <Link to="/overview" className="link">{patient?.patient_forename} {patient?.patient_surname} | #{patient?.patient_id}</Link>
                        <span>Prescriptions</span>
                        <div className="ms-auto">
                            {
                                getStatus !== "inactive" && recordRepeat?.length > 0 ?
                                    <div className="text-end mb-3">
                                        <button className="btn btn-orange" data-bs-toggle={orderRepeat?.length > 0 ? "modal" : null} data-bs-target={orderRepeat?.length > 0 ? "#confirmationModal" : null}
                                            onClick={() => !orderRepeat.length > 0 ? toast.error('Please select atleast one order repeat prescriptions') : toast.dismiss()}
                                        >Order Repeat Prescriptions</button>
                                    </div> : ""}
                        </div>
                    </div>
                </div>
                <div className="container-fluid mt-2">
                    <div className="card themeCard">
                        <div className="card-header">
                            <h5>Prescription List</h5>
                        </div>
                        <div className="card-body p-0">
                            <div className="themeTabs mb-0">
                                <ul className="nav nav-pills" id="pills-tab" role="tablist">
                                    <li className="nav-item" role="presentation">
                                        <button className="nav-link active" data-bs-toggle="pill" data-bs-target="#appTab1" onClick={() => setGetStatus("active")}>
                                            Repeat Prescriptions
                                        </button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <button className="nav-link" data-bs-toggle="pill" data-bs-target="#appTab2" onClick={() => setGetStatus("inactive")}>
                                            Past Prescriptions
                                        </button>
                                    </li>
                                </ul>
                                <div className="tab-content p-0" id="pills-tabContent">
                                    <div className="tab-pane fade show active" id="appTab1" role="tabpanel" aria-labelledby="appTab1">
                                        <PrescriptionsList record={recordRepeat} Order={orderRepeat} setOrder={setOrderRepeat}
                                         checkIt={ch} setCheckIt={setCh}
                                        />
                                    </div>
                                    <div className="tab-pane fade" id="appTab2" role="tabpanel" aria-labelledby="appTab2">
                                        <PrescriptionsList record={recordPast} getStatus={getStatus} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {
                        getStatus !== "inactive" && recordRepeat?.length > 0 ?
                            <div className="text-end mb-3">
                                <button className="btn btn-orange" data-bs-toggle={orderRepeat?.length > 0 ? "modal" : null} data-bs-target={orderRepeat?.length > 0 ? "#confirmationModal" : null}
                                    onClick={() => !orderRepeat.length > 0 ? toast.error('Please select atleast one order repeat prescriptions') : toast.dismiss()}
                                >Order Repeat Prescriptions</button>
                            </div> : ""}
                </div>
                {/* <!-- Start Confirmation Modal --> */}
                {
                    orderRepeat?.length > 0 ? (
                        <div className="modal fade themeModal confirmation-modal" id="confirmationModal" tabIndex="-1" aria-labelledby="confirmationModalLabel" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="confirmationModalLabel">Confirm Order</h5>
                                        <p>Confirm your order of {orderRepeat.length} repeat prescriptions</p>
                                    </div>
                                    <div className="modal-body p-0">
                                        {
                                            orderRepeat.map((order) => {
                                                return (
                                                    <div className="itemList" key={order.drug_code}>
                                                        <h6>{order.drug_code_display}</h6>
                                                        <p>{order.quantity} {order.packsize} - {order.dosage}</p>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                    <div className='modal-header'>
                                        <p>Select a Pharmacy</p>
                                        <div className="inputView">
                                            <select className="form-select" id="pharmacy_id" name='pharmacy_name' defaultValue={''} onChange={(e) => setAddressId(e.target.value)}>
                                                <option value=''>Select Pharmacy</option>
                                                {
                                                    getLocation?.length > 0 ?
                                                        getLocation.map((pharmacy, index) => {
                                                            return (
                                                                <option key={index} value={pharmacy.locationId}>{pharmacy.locationName} - {pharmacy.pharmacyName}</option>
                                                            )
                                                        })
                                                        :
                                                        ""
                                                }
                                            </select>
                                        </div>
                                    </div>
                                    <div className="modal-footer justify-content-center">
                                        <button type="button" className="btn btn-orange" data-bs-dismiss="modal" onClick={() => confirmOrderRepeat(orderRepeat)}>Confirm and Order Repeat Prescriptions</button>
                                        <button type="button" className="btn btn-red" data-bs-dismiss="modal">Cancel</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : null}
                {/* <!-- End Confirmation Modal --> */}
            </div>
        </>
    )
}
export default Prescriptions;
