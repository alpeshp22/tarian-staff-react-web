import React, { useState,useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as constants from '../constants'
import { callApi,getAccessToken, getPatient } from '../apiCalls';
import Sidebar from '../components/sidebar';
import Header from '../components/header';
import { useNavigate } from "react-router-dom"
import LoadingSpinner from "../components/LoadingSpinner";
import DatePicker from "react-datepicker";
import moment from 'moment'

const PatientSearch = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, formState: { errors }, } = useForm();
    const [patient, setPatient] = useState(getPatient());
    const [surgeries, setSurgeries] = useState({ organisation_id: '', organisation_name: 'Select' });

    const fetchSurgeries = () => {
        try {
            setIsLoading(true);
            const surgeriesparams = {
                method: 'get',
                url: constants.API_STAFF_ORGANIZATION_LOOKUP,
            };

            callApi([surgeriesparams],getAccessToken(),navigate).then((response) => {
                let resp = response[constants.API_STAFF_ORGANIZATION_LOOKUP];
                // console.log(constants.API_STAFF_ORGANIZATION_LOOKUP+' resp >>> ', resp);
                setIsLoading(false)
                if (resp.success) {
                    // console.log(resp.data.linked_organisations);
                    localStorage.setItem('linked_organisations',JSON.stringify(resp.data.linked_organisations));
                    setSurgeries(resp.data.linked_organisations);
                } else {
                    // console.log("error resp >> ",resp.data.detail);
                    toast.error(resp.data.detail);
                }
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
        fetchSurgeries();
    }, []);

    const savePatient = (patient) => {
        const selectdrp = document.getElementById("staff_session_organisation_id");
        const selectedIndex = selectdrp.selectedIndex;
        patient.surgery_name = selectdrp.options[selectedIndex].text;
        localStorage.setItem('patient',JSON.stringify(patient));
        setPatient(patient);
        navigate('/overview');
    }

    const [dob, setDOB] = useState(null);
    const [values, setValues] = useState({
        staff_session_organisation_id: '', staff_session_patient_forename: '', staff_session_patient_surname: '', staff_session_patient_identifier: ''
    });
    const set = name => {
        return ({ target: { value } }) => {
            setValues(oldValues => ({...oldValues, [name]: value }));
        }
    };

    const onSubmit = () => {
        setIsLoading(true);
        // console.log("frmdata => ", values);
        try {
            const params = {
                method: 'post',
                url: constants.API_STAFF_PATIENT_FIND,
                data: {
                    staff_session_organisation_id: values.staff_session_organisation_id,
                    staff_session_patient_forename: values.staff_session_patient_forename,
                    staff_session_patient_surname: values.staff_session_patient_surname,
                    staff_session_patient_date_of_birth: dob ? moment(dob).format('yyyy-MM-DD') : '',
                    staff_session_patient_identifier: values.staff_session_patient_identifier
                },
            };

            callApi([params],getAccessToken(),navigate).then((response) => {
                let resp = response[constants.API_STAFF_PATIENT_FIND];
                // console.log(constants.API_STAFF_PATIENT_FIND+' resp >>> ', resp);
                if (resp.success) {
                    savePatient(resp.data);
                } else {
                    setIsLoading(false)
                    // console.log("error resp >> ",resp.data.detail);
                    // toast.error(resp.data.detail);
                    toast.error("No data found!");
                }
            })
            .catch((error) => {
                setIsLoading(false)
                // console.log('catch error >>> ', error);
                toast.error("Something went wrong! Try again later.");
            });
        } catch (e) {
            setIsLoading(false)
            // console.log('catch error >>> ', e);
            toast.error("Something went wrong! Try again later.");
        }
    };

    const handleClearfilter = () => {
        setValues({
            staff_session_organisation_id: '', staff_session_patient_forename: '', staff_session_patient_surname: '', staff_session_patient_identifier: ''
        });
        setDOB("");
    }
    return (
        <>
        {isLoading ? <LoadingSpinner /> : ""}
        <div className="pageContent pSearchPage">
            <Sidebar />
            <Header />
            <div className="BreadCrumb">
                <div className="container-fluid">
                    <span>Patient Search</span>
                </div>
            </div>
            <div className="container-fluid mt-2">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="card themeCard">
                        <div className="card-header">
                            <h5>Find a Patient</h5>
                        </div>
                        <div className="card-body">
                            <div className="pInfoRow">
                                <label>Surgery Name:</label>
                                <div className="inputView">
                                    <select className="form-select" id="staff_session_organisation_id" defaultValue={''} {...register("staff_session_organisation_id", {required: 'Please select surgery',})} onChange={set('staff_session_organisation_id')} >
                                    <option value=''>Select</option>
                                    {Object.values(surgeries).map(({ organisation_id, organisation_name }, index) => <option key={index} value={organisation_id} >{organisation_name}</option>)}
                                    </select>
                                    {errors.staff_session_organisation_id?.message && (<span className="error">{errors.staff_session_organisation_id?.message}</span>)}
                                </div>
                            </div>
                            <div className="pInfoRow">
                                <label>Patient Forename:</label>
                                <div className="inputView">
                                    <input type="text" className="form-control" value={values.staff_session_patient_forename} placeholder="Patient Forename" {...register('staff_session_patient_forename', { required: 'Patient foerename is required', })} onChange={set('staff_session_patient_forename')} />
                                    {errors.staff_session_patient_forename?.message && (<span className="error">{errors.staff_session_patient_forename?.message}</span>)}
                                </div>
                            </div>
                            <div className="pInfoRow">
                                <label>Patient Surname:</label>
                                <div className="inputView">
                                    <input type="text" className="form-control" value={values.staff_session_patient_surname} placeholder="Patient Surname" {...register('staff_session_patient_surname', { required: 'Patient surname is required', })} onChange={set('staff_session_patient_surname')} />
                                    {errors.staff_session_patient_surname?.message && (<span className="error">{errors.staff_session_patient_surname?.message}</span>)}
                                </div>
                            </div>
                            <div className="pInfoRow">
                                <label>Patient Date of Birth:</label>
                                <div className="inputView dateInput">
                                    <DatePicker placeholderText="Select Date" dateFormat="dd/MM/yyyy" selected={dob} onChange={(date) => setDOB(date)} />
                                </div>
                            </div>
                            <div className="pInfoRow">
                                <label>Patient ID Number:</label>
                                <div className="inputView">
                                    <input type="text" className="form-control" value={values.staff_session_patient_identifier} placeholder="Patient ID Number" onChange={set('staff_session_patient_identifier')} />
                                </div>
                            </div>
                            <div className="btnView">
                                <button type="submit" className="btn btn-green" disabled={isLoading}>Search</button>
                                <button type="reset" className="btn btn-green" onClick={handleClearfilter}>Clear</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        </>
    )
}
export default PatientSearch;
/*
<div className="pInfoRow">
    <label>Surgery ID Number:</label>
    <div className="inputView">
        <input type="text" className="form-control" name="surgery_id" placeholder="Surgery ID Number" {...register('surgery_id', {required: 'Surgery id number is required', })} />
    </div>
</div>
*/
