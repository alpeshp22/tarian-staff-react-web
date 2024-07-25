import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import * as constants from '../constants'
import { useForm } from 'react-hook-form';
import LoadingSpinner from '../components/LoadingSpinner';
import { callApi, getAccessToken, getOrganisation, getPatient } from '../apiCalls';
import Sidebar from '../components/sidebar';
import Header from '../components/header';
import { Link, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import moment from 'moment'

const CreateNewAppointment = () => {
    const { register, handleSubmit, setError, clearErrors, formState: { errors }, } = useForm();
    const [startDate, setStartDate] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [details, setDetails] = useState([]);
    const [prefPurpose, setPrefPurpose] = useState([]);
    const [prefDoc, setPrefDoc] = useState([]);
    const [slotId, setSlotId] = useState(0);
    const navigate = useNavigate();
    const patient = getPatient();

    const getAppointmentSlots = () => {
        try {
            if(startDate) {
                clearErrors('startDate');
                const currentDate = moment(new Date()).format('yyyy-MM-DD');
                const selectedDate = moment(startDate).format('yyyy-MM-DD');
                let diffInDays = (moment(selectedDate).diff(currentDate,'days')) + 1
                console.log(diffInDays);

                setIsLoading(true);
                const params = {
                    method: 'get',
                    url: constants.API_STAFF_GET_APPOINTMENT_SLOTS + `/${diffInDays}/free`
                }

                callApi([params], getAccessToken(), navigate).then((response) => {
                    let resp = response[constants.API_STAFF_GET_APPOINTMENT_SLOTS + `/${diffInDays}/free`];
                    if (resp.success) {
                        console.log(resp.data.slots);
                        if (resp.data.slots == null) {
                            setDetails([]);
                        }
                        else {
                            const slots = resp.data.slots.filter((item) => {
                                const itemDate = moment(item.dateTime).startOf("day");
                                return itemDate.isSame(selectedDate);
                            })
                            console.log(slots);
                            setDetails(slots);
                        }
                    } else {
                        setIsLoading(false)
                        toast.error("No data found!");
                    }
                    setIsLoading(false);
                });
            } else {
                setDetails([]);
            }
        } catch (e) {
            console.log(e);
            setIsLoading(false);
            toast.error("Something went wrong!");
        }
    }

    useEffect(() => {
        getAppointmentSlots();
    }, [startDate]);


    const getAppointmentPurpose = () => {
        try {
            setIsLoading(true)
            const params = {
                method: 'get',
                url: constants.API_STAFF_GET_STATUS_TYPE + `/appointmenttype`
            }

            callApi([params], getAccessToken(), navigate).then((response) => {
                let resp = response[constants.API_STAFF_GET_STATUS_TYPE + `/appointmenttype`]
                if (resp.success) {
                    setPrefPurpose(resp.data.status_type);
                } else {
                    setIsLoading(false)
                    toast.error("No Appointment Purpose found!");
                }
                setIsLoading(false)
            })
        } catch (e) {
            setIsLoading(false)
            toast.error('Something is not right!');
        }
    }

    const getLocation = getOrganisation();

    const getPreferredDoctor = () => {
        try {
            setIsLoading(true)
            const param = {
                method: 'post',
                url: constants.API_STAFF_PATIENT_RECORD,
                data: {
                    "patientIdAtOrganisation": patient.patient_organisation_id,
                    "dob": patient.patient_date_of_birth
                }
            }

            callApi([param], getAccessToken(), navigate).then((response) => {
                let respon = response[constants.API_STAFF_PATIENT_RECORD]
                if (respon.success) {
                    setPrefDoc(respon.data.patient_details.patient);
                } else {
                    setIsLoading(false)
                    toast.error("No Preferred Doctor found!");
                }
                setIsLoading(false)
            })
        } catch (e) {
            setIsLoading(false);
            toast.error('Something is wrong!')
        }
    }

    useEffect(() => {
        getAppointmentPurpose();
        getPreferredDoctor();
    },[])

    const onSubmit = (data) => {
        console.log(data);
        try {
            // console.log("values >> ", values);

            if(!startDate) {
                setError('startDate', {
                    type: "server",
                    message: "Please select preferred date.",
                });
                // alert("error");
                return false;
            } else {
                clearErrors('startDate');
            }
            if(!slotId) {
                setError('duration', {
                    type: "server",
                    message: "Please select preferred date & time slot.",
                });
                return false;
            } else {
                clearErrors('duration');
            }
            setIsLoading(true)
            const url = constants.API_STAFF_CREATE_BOOKING + `/${slotId}/${values.duration}/${values.purpose}`;
            console.log(url);

            const createApp = {
                method: "post",
                url: url
            }

            callApi([createApp], getAccessToken(), navigate).then(response => {
                let resp = response[url]
                console.log("appointment create resp >> ",resp);
                if (resp.success) {
                    toast.success("Appointment created successfully");
                    navigate('/'+constants.ROUTE_APPOINTMENTS_EVENTS);
                } else {
                    console.log(resp);
                    toast.error("please provide proper details!");
                }
                setIsLoading(false)
            }).catch((error) => {
                setIsLoading(false)
            });
        } catch (e) {
            setIsLoading(false)
            console.log(e);
            toast.error('Something went wrong!')
        }
    }

    const [values, setValues] = useState({
        purpose: '', location: '', doctor: '', duration: ''
    });
    const set = name => {
        return ({ target: { value } }) => {
            setValues(oldValues => ({...oldValues, [name]: value }));
        }
    };

    return (
        <>
        {isLoading ? <LoadingSpinner /> : ""}
        <div className="pageContent createAppoPage">
            <Sidebar />
            <Header />
            <div className="BreadCrumb">
                <div className="container-fluid">
                    <Link to={constants.ROUTE_HOME + constants.ROUTE_APPOINTMENTS_EVENTS} className="link">Appointments & Events</Link>
                    <span>Create an Appointment</span>
                </div>
            </div>
            <div className="container-fluid mt-2">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="card themeCard">
                        <div className="card-header">
                            <h5>Create an Appointment</h5>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-lg-6">
                                    <div className="pInfoRow">
                                        <label>Appointment Purpose:</label>
                                        <div className="inputView">
                                            <select className="form-select" id="purpose" defaultValue={''} {...register("purpose", {required: 'Please select purpose',})} onChange={set('purpose')}>
                                                <option value="">Select Purpose</option>
                                                {
                                                    prefPurpose.length > 0 ? prefPurpose.map((purpose) => {
                                                        return (
                                                            <option key={purpose.fields.status_name}>{purpose.fields.status_name}</option>
                                                        )
                                                    })
                                                        :
                                                        "no location"
                                                }
                                            </select>
                                            {errors.purpose?.message && (<span className="error">{errors.purpose?.message}</span>)}
                                        </div>
                                    </div>
                                    <div className="pInfoRow">
                                        <label>Location:</label>
                                        <div className="inputView">
                                            <select className="form-select" id="location" defaultValue={''} {...register("location", {required: 'Please select location',})} onChange={set('location')}>
                                                <option value="">Select Location</option>
                                                {
                                                    getLocation.length > 0 ? getLocation.map((loc) => {
                                                        return (
                                                            <option key={loc.organisation_id}>{loc.organisation_name}</option>
                                                        )
                                                    })
                                                        :
                                                        "no location"
                                                }
                                            </select>
                                            {errors.location?.message && (<span className="error">{errors.location?.message}</span>)}
                                        </div>
                                    </div>
                                    <div className="pInfoRow">
                                        <label>Preferred Doctor:</label>
                                        <div className="inputView">
                                            <select className="form-select" id="doctor" defaultValue={''} {...register("doctor", {required: 'Please select doctor',})} onChange={set('doctor')}>
                                                <option disabled value="">No Preference</option>
                                                <option>{prefDoc.registeredgp}</option>
                                                <option>{prefDoc.usualgp}</option>
                                            </select>
                                            {errors.doctor?.message && (<span className="error">{errors.doctor?.message}</span>)}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="pInfoRow">
                                        <label>Preferred Date:</label>
                                        <div className="inputView dateInput">
                                            {/* <input type="text" className="form-control date" name="pdob" /> */}
                                            <DatePicker disabledKeyboardNavigation
                                                name='startDate'
                                                type='startDate'
                                                placeholderText="Select Date"
                                                minDate={new Date()}
                                                selected={startDate}
                                                dateFormat="yyyy-MM-dd"
                                                onChange={(date) => setStartDate(date)}
                                            />
                                            {errors.startDate?.message && (<span className="error">{errors.startDate?.message}</span>)}
                                        </div>
                                    </div>
                                    <div className="pInfoRow">
                                        <label>Available Slots:</label>
                                        <div className="slotsView">
                                            <div className="btn-group" role="group">
                                                {
                                                    details.length > 0 ? details.map((det) => {
                                                        return (
                                                            <>
                                                                <input type="radio" className="btn-check" onClick={() => setSlotId(det.id)} name="duration" id={det.id} key={det.id} value={det.defaultDuration} {...register('duration', { required: "Please select time slot" })} onChange={set('duration')} />
                                                                <label className="btn" htmlFor={det.id}>{moment(det.dateTime).format('HH:mm')}</label>
                                                            </>
                                                        )
                                                    })
                                                        :
                                                        <p>No slots</p>
                                                }
                                            </div>
                                            {errors.duration?.message && (<span className="error">{errors.duration?.message}</span>)}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-12">
                                    <div className="btnView">
                                        <button type="submit" className="btn btn-green" disabled={isLoading}>Create Appointment</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        </>
    )
}
export default CreateNewAppointment;
