import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import * as constants from '../constants'
import { useNavigate } from "react-router-dom"
import { callApi, getAccessToken, getPatient } from '../apiCalls';
import Sidebar from '../components/sidebar';
import Header from '../components/header';
import LoadingSpinner from "../components/LoadingSpinner";
import DatePicker from "react-datepicker";
import { Link } from "react-router-dom";
import moment from 'moment';

const MedicationReview = () => {
    const { register, handleSubmit, reset, setError, clearErrors, formState: { errors }, } = useForm();
    const navigate = useNavigate();
    const patient = getPatient();
    const [dueDate, setDueDate] = useState(null);
    const [reviewDate, setReviewDate] = useState(null);
    const [nextReviewDate, setNextReviewDate] = useState(null);
    const [medLoc, setMedLoc] = useState([]);
    const [timeLine, setTimeLine] = useState([]);
    const [oldTimeLine, setOldTimeLine] = useState([]);
    const [problemTimeLine, setProblemTimeLine] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const [values, setValues] = useState({
        location: '', notes: ''
    });

    const set = name => {
        return ({ target: { value } }) => {
            setValues(oldValues => ({ ...oldValues, [name]: value }));
        }
    };

    const getLocation = () => {
        try {
            setIsLoading(true);
            const loc = {
                method: 'get',
                url: constants.API_STAFF_GET_STATUS_TYPE + '/reviewlocation'
            }

            callApi([loc], getAccessToken(), navigate).then((response) => {
                let resp = response[constants.API_STAFF_GET_STATUS_TYPE + '/reviewlocation']

                if (resp.success) {
                    console.log(resp.data.status_type);
                    setMedLoc(resp.data.status_type);
                }
                setIsLoading(false);
            })
        } catch (e) {
            setIsLoading(false);
            console.log(e);
            toast.error('Something went wrong');
        }
    }

    const getTimeline = () => {
        try {
            setIsLoading(true)

            const fetchTimeline = {
                method: 'post',
                url: constants.API_STAFF_PATIENT_TIMELINE,
                data: {
                    "patientIdAtOrganisation": patient.patient_organisation_id,
                    "dob": patient.patient_date_of_birth,
                    "filter": [
                        "medreviews",
                        "testresults",
                        "problems",
                        "referrals"
                    ],
                    "appointment_filter": [
                        "all"
                    ],
                    "startDate": moment(new Date()).format('yyyy-MM-DD'),
                    "Durations": {
                        "pre": "P6M",
                        "post": "P3M"
                    },
                    "sorted": "True"
                }
            }

            callApi([fetchTimeline], getAccessToken(), navigate).then((response) => {
                let resp = response[constants.API_STAFF_PATIENT_TIMELINE]

                if (resp.success) {
                    setTimeLine(resp.data.timeline_results);
                }
                setIsLoading(false);
            });
        } catch (e) {
            console.log(e);
            setIsLoading(false);
            toast.error("Something went wrong.");
        }
    }

    const problemTimeline = (problem_id) => {
        console.log(problem_id);
        setOldTimeLine(timeLine);
        try {
            setIsLoading(true)

            const fetchProblemTimeline = {
                method: 'post',
                url: constants.API_STAFF_PATIENT_TIMELINE,
                data: {
                    "patientIdAtOrganisation": patient.patient_organisation_id,
                    "dob": patient.patient_date_of_birth,
                    "filter": [
                        "problem_details"
                    ],
                    "problem_id": problem_id,
                    "sorted": "True"
                }
            }

            callApi([fetchProblemTimeline], getAccessToken(), navigate).then((response) => {
                let resp = response[constants.API_STAFF_PATIENT_TIMELINE]

                if (resp.success) {
                    setTimeLine(resp.data.timeline_results)
                    setProblemTimeLine('problem');
                }
                setIsLoading(false)
            });
        } catch (e) {
            console.log(e);
            setIsLoading(false);
            toast.error('Something went wrong');
        }
    }

    const onSubmit = (data) => {
        // console.log(dueDate == null);
        console.log(data);
        console.log(dueDate);
        let loc_seq = medLoc.filter(seq => seq.fields.status_description === values.location);
        try {
            if (!dueDate) {
                setError('dueDate', {
                    type: "server",
                    message: "Please select date."
                });
                setIsLoading(false);
            } else {
                clearErrors('dueDate');
            }

            if (!reviewDate) {
                setError('reviewDate', {
                    type: "server",
                    message: "Please select date."
                });
                setIsLoading(false);
            } else {
                clearErrors('reviewDate');
            }

            if (!nextReviewDate) {
                setError('nextReviewDate', {
                    type: "server",
                    message: "Please select date."
                });
                setIsLoading(false);
            } else {
                clearErrors('nextReviewDate');
            }
            if (!dueDate && !reviewDate && !nextReviewDate) {
                return false;
            }

            setIsLoading(true);
            const submitReview = {
                method: "patch",
                url: constants.API_STAFF_CARE_RECORD_CREATE_MEDICATION_REVIEW,
                data: {
                    "medReview": [
                        {
                            "patientIdAtOrganisation": patient.patient_organisation_id,
                            "dob": patient.patient_date_of_birth,
                            "duedate": moment(dueDate).format('yyyy-MM-DD'),
                            "reviewdate": moment(reviewDate).format('yyyy-MM-DD'),
                            "nextreview": moment(nextReviewDate).format('yyyy-MM-DD'),
                            "location": [
                                {
                                    "code": loc_seq[0].fields.status_sequence,
                                    "display": values.location
                                }
                            ],
                            "notes": values.notes
                        }
                    ]
                }
            }

            callApi([submitReview], getAccessToken(), navigate).then((response) => {
                let resp = response[constants.API_STAFF_CARE_RECORD_CREATE_MEDICATION_REVIEW]

                if (resp.success && !resp.data.error) {
                    console.log(resp);
                    toast.success('Submitted Medication review successfully');
                } else {
                    toast.error(resp.data.error.text)
                }
                setDueDate(null);
                setReviewDate(null);
                setNextReviewDate(null);
                reset();
                setIsLoading(false);
            });
        } catch (e) {
            setIsLoading(e);
            console.log(e);
            toast.error('Something went wrong');
        }
    }

    const clearForm = () => {
        setDueDate(null);
        setReviewDate(null);
        setNextReviewDate(null);
        reset();
    }

    const goBack = () => {
        setTimeLine(oldTimeLine);
        setProblemTimeLine(null);
    }

    useEffect(() => {
        getLocation();
        getTimeline();
    }, []);

    console.log(timeLine);
    return (
        <>
            {isLoading ? <LoadingSpinner /> : ""}
            <div className="pageContent medicationReviewPage">
                <Sidebar />
                <Header />
                <div className="BreadCrumb">
                    <div className="container-fluid">
                        <Link to={constants.ROUTE_HOME + constants.ROUTE_PATIENT_OVERVIEW} className="link">{patient?.patient_forename} {patient?.patient_surname} | #{patient?.patient_id}</Link>
                        <span>Medication Review</span>
                    </div>
                </div>
                <div className="container-fluid mt-2">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="card themeCard">
                            <div className="card-header">
                                <h5>Medication Review</h5>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-lg-6">
                                        <div className="pInfoRow">
                                            <label>Due Date:</label>
                                            <div className="inputView dateInput">
                                                <DatePicker disabledKeyboardNavigation
                                                    name='dueDate'
                                                    type='dueDate'
                                                    placeholderText="Select Date"
                                                    selected={dueDate}
                                                    dateFormat='yyyy-MM-dd'
                                                    onChange={(date) => {
                                                        setDueDate(date)
                                                        clearErrors('dueDate')
                                                    }}
                                                />
                                                {errors.dueDate?.message && (<span className="error">{errors.dueDate?.message}</span>)}
                                            </div>
                                        </div>
                                        <div className="pInfoRow">
                                            <label>Review Date:</label>
                                            <div className="inputView dateInput">
                                                <DatePicker disabledKeyboardNavigation
                                                    name='reviewDate'
                                                    type='reviewDate'
                                                    placeholderText="Select Date"
                                                    selected={reviewDate}
                                                    dateFormat="yyyy-MM-dd"
                                                    onChange={(date) => {
                                                        setReviewDate(date)
                                                        clearErrors('reviewDate')
                                                    }}
                                                />
                                                {errors.reviewDate?.message && (<span className="error">{errors.reviewDate?.message}</span>)}
                                            </div>
                                        </div>
                                        <div className="pInfoRow">
                                            <label>Next Review Date:</label>
                                            <div className="inputView dateInput">
                                                <DatePicker disabledKeyboardNavigation
                                                    name='nextReviewDate'
                                                    type='nextReviewDate'
                                                    placeholderText="Select Date"
                                                    selected={nextReviewDate}
                                                    dateFormat='yyyy-MM-dd'
                                                    onChange={(date) => {
                                                        setNextReviewDate(date)
                                                        clearErrors('nextReviewDate')
                                                    }}
                                                />
                                                {errors.nextReviewDate?.message && (<span className="error">{errors.nextReviewDate?.message}</span>)}
                                            </div>
                                        </div>
                                        <div className="pInfoRow">
                                            <label>Location:</label>
                                            <div className="inputView">
                                                <select className="form-select" id='location' defaultValue={''} {...register("location", { required: 'Please select location', })} onChange={set('location')}>
                                                    <option value="">Select Location</option>
                                                    {
                                                        medLoc?.length > 0 ? medLoc.map((medicationLocation, index) => {
                                                            return (
                                                                <option key={index}>{medicationLocation.fields.status_description}</option>
                                                            )
                                                        }) : ""
                                                    }
                                                </select>
                                                {errors.location?.message && (<span className="error">{errors.location?.message}</span>)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-10">
                                        <div className="pInfoRow">
                                            <label>Notes:</label>
                                            <div className="inputView" style={{ maxWidth: '100%' }}>
                                                <textarea className="form-control" rows="5" placeholder='Notes' {...register("notes", { required: 'Please enter note' })} onChange={set('notes')}></textarea>
                                                {errors.notes?.message && (<span className="error">{errors.notes?.message}</span>)}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-lg-12">
                                        <div className="btnView">
                                            <button type="submit" className="btn btn-green" disabled={isLoading}>Save</button>
                                            <button className="btn btn-green" disabled={isLoading} onClick={() => clearForm()}>Clear</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                    <div className="card themeCard">
                        <div className="card-header">
                            <h5>Events Timeline</h5>
                        </div>
                        <div className="card-body" id='events-timeLine'>
                            <ul className="events-timeline">
                                {
                                    problemTimeLine === 'problem' ?
                                        <div className="btnView text-end">
                                            <button className="btn btn-green" onClick={goBack}>Back</button>
                                        </div>
                                        : ''
                                }
                                {timeLine?.length > 0 ?
                                    timeLine.map((tLine, index) => {
                                        return (
                                            <li key={index}>
                                                <div className="date">
                                                    <h5>{moment(tLine.event.event_date).format('MMMM Do yyyy')}</h5>
                                                </div>
                                                <div className="info">
                                                    {tLine.event.event_type.toLowerCase() === 'medicationreview' && <>
                                                        <p className="lead">Medication Review</p>
                                                        <p>Location: {tLine.event.review_location}</p>
                                                        <p>Description: {tLine.event.notes}</p>
                                                    </>
                                                    }
                                                    {tLine.event.event_type.toLowerCase() === 'test' &&
                                                        <>
                                                            <div className="dropdown d-flex justify-content-end">
                                                                <button className="btn" type="button" id={tLine.event.id} data-bs-toggle="dropdown" aria-expanded="false">
                                                                    <i className="bi bi-three-dots-vertical"></i>
                                                                </button>
                                                                <ul className="dropdown-menu" aria-labelledby={tLine.event.id}>
                                                                    <li><button className="dropdown-item" href="">Display Chart</button></li>
                                                                </ul>
                                                            </div>
                                                            <p className="lead">Test</p>
                                                            <p>Type: {tLine.event.test_type}</p>
                                                            <p>Description: {tLine.event.text}</p>
                                                            <p>Result: {tLine.event.value}{tLine.event.unit}</p>
                                                        </>
                                                    }
                                                    {tLine.event.event_type.toLowerCase() === 'referral' &&
                                                        <>
                                                            <p className="lead">Referral</p>
                                                            <p>Source: {tLine.event.source}</p>
                                                            <p>Description: {tLine.event.text}</p>
                                                            <p>Status: {tLine.event.status}</p>
                                                            <p>Urgency: {tLine.event.urgency}</p>
                                                            <p>Date actioned: {tLine.event.action_date}</p>
                                                        </>
                                                    }
                                                    {tLine.event.event_type.toLowerCase() === 'repeat' &&
                                                        <>
                                                            <div className="dropdown d-flex justify-content-end">
                                                                <button className="btn" type="button" id={tLine.event.id} data-bs-toggle="dropdown" aria-expanded="false">
                                                                    <i className="bi bi-three-dots-vertical"></i>
                                                                </button>
                                                                <ul className="dropdown-menu" aria-labelledby={tLine.event.id}>
                                                                    <li><a className="dropdown-item" href={constants.ROUTE_PRESCRIPTIONS}>Review Medication</a></li>
                                                                </ul>
                                                            </div>
                                                            <p className='lead'>{tLine.event.event_type}</p>
                                                            <p>{tLine.event.drug_code}</p>
                                                            <p>{tLine.event.dosage}</p>
                                                            <p>{tLine.event.source}</p>
                                                        </>
                                                    }
                                                    {tLine.event.event_type.toLowerCase() === 'therapy' &&
                                                        <>
                                                            <p className='lead'>{tLine.event.event_type}</p>
                                                            <p>{tLine.event.drug_code}</p>
                                                            <p>{tLine.event.dosage}</p>
                                                        </>
                                                    }
                                                    {tLine.event.event_type === 'General: Diagnosis' &&
                                                        <>
                                                            <p className='lead'>General Diagnosis</p>
                                                            <p>{tLine.event.is_active}</p>
                                                            <p>{tLine.event.text}</p>
                                                            <p>Description: {tLine.event.notes}</p>
                                                        </>
                                                    }
                                                    {tLine.event.event_type === 'Disease Register' &&
                                                        <>
                                                            <p className='lead'>{tLine.event.event_type}</p>
                                                            <p>Description: {tLine.event.code}</p>
                                                        </>
                                                    }
                                                    {['problem', 'problems'].includes(tLine.event.event_type.toLowerCase()) &&
                                                        <>
                                                            <p className='lead'>{tLine.event.event_type}</p>
                                                            <p>Action Status: {tLine.event.is_active}</p>
                                                            <p>Description: {tLine.event.id ? <a href='#events-timeLine' onClick={() => problemTimeline(tLine.event.id)} style={{ 'textDecoration': 'none' }}>{tLine.event.text}</a> : tLine.event.text}</p>
                                                        </>
                                                    }
                                                </div>
                                            </li>
                                        )
                                    })
                                    : "No Data"}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default MedicationReview;