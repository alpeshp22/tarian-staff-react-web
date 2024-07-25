import React, { useState } from 'react';
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form';
import * as constants from '../constants';
import { callApi, getAccessToken, getPatient, getUser } from '../apiCalls';
import LoadingSpinner from '../components/LoadingSpinner';
import Sidebar from '../components/sidebar';
import Header from '../components/header';
import { Link, useNavigate } from "react-router-dom"

const ComposeNewMessage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, } = useForm();
    const user = getUser();
    const patient = getPatient();

    console.log(user.id);
    console.log(patient.patient_user_id);
    const onSubmit = () => {
        try {
            setIsLoading(true)
            const composeMessage = {
                method: 'post',
                url: constants.API_COMPOSE_MESSAGE,
                data: {
                    "message": [
                        {
                            "actor_object_id": user.id,
                            "recipient_id": patient.patient_user_id,
                            "description": values.data_message,
                            "data": ""
                        }
                    ]
                }
            }

            callApi([composeMessage], getAccessToken(), navigate).then((response) => {
                let resp = response[constants.API_COMPOSE_MESSAGE];
                if (resp.success) {
                    console.log(resp);
                    toast.success('Mail sent Successfully');
                    navigate('/' + constants.ROUTE_MESSAGE_CENTER)
                }
                else {
                    toast.error(resp.data.detail);
                }
                setIsLoading(false);
            })
        } catch (e) {
            setIsLoading(false)
            console.log(e);
            toast.error('Something went wrong!')
        }
    }

    const [values, setValues] = useState({
        msgSub: '', data_message: ''
    })

    const set = name => {
        return ({ target: { value } }) => {
            setValues(oldValues => ({ ...oldValues, [name]: value }));
        }
    }
    console.log(values.data_message);
    return (
        <>
            {isLoading ? <LoadingSpinner /> : ""}
            <div className="pageContent comNewMsgPage">
                <Sidebar />
                <Header />
                <div className="BreadCrumb">
                    <div className="container-fluid">
                        <Link to={constants.ROUTE_HOME + constants.ROUTE_MESSAGE_CENTER} className="link">Message Centre</Link>
                        <span>Compose New Message</span>
                    </div>
                </div>
                <div className="container-fluid mt-2">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="card themeCard cnMsgCard">
                            <div className="card-header">
                                <h5>Compose New Message</h5>
                            </div>
                            <div className="card-body p-0">
                                <div className="cnmHeader">
                                    <div className="inputRow">
                                        <label>To:</label>
                                        <input type="text" className="form-control msgTo" name="msgTo" placeholder="name@mail.com" value={`${patient.patient_forename} ${patient.patient_surname}`} />
                                    </div>
                                    <div className="inputRow">
                                        <label>Subject:</label>
                                        <input type="text" className="form-control" name="msgSub" placeholder="type you subject" {...register('msgSub', { required: 'Please enter the subject' })} onChange={set('msgSub')} />
                                        {errors.msgSub?.message && (<span className="error">{errors.msgSub?.message}</span>)}
                                    </div>
                                </div>
                                <div className="p-3 pt-0">
                                    <textarea className="form-control" id="cnMsgBox" name="data_message" rows="5" placeholder="Start typing your message" {...register('data_message', { required: 'Please enter the message' })} onChange={set('data_message')}></textarea>
                                    {errors.data_message?.message && (<span className="error">{errors.data_message?.message}</span>)}
                                    <div className="btnView">
                                        <button type='submit' className="btn btn-green" disabled={isLoading}> Send Message</button>
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
export default ComposeNewMessage;
