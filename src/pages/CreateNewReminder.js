import React from 'react';
import axios from 'axios'
import { useForm } from 'react-hook-form';
import { callApi } from '../apiCalls';
import Sidebar from '../components/sidebar';
import Header from '../components/header';
import { Link } from "react-router-dom";
import * as constants from '../constants';

const CreateNewReminder = () => {
    const { register, handleSubmit, formState: { errors }, } = useForm();

    return (
        <div className="pageContent comNewMsgPage">
            <Sidebar />
            <Header />
            <div className="BreadCrumb">
                <div className="container-fluid">
                    <Link to={constants.ROUTE_HOME + constants.ROUTE_REMINDERS} className="link">Reminders</Link>
                    <span>Create a Reminder</span>
                </div>
            </div>
            <div className="container-fluid mt-2">
                <div className="card themeCard cnMsgCard">
                    <div className="card-header">
                        <h5>Create a Reminder</h5>
                    </div>
                    <div className="card-body p-0">
                        <div className="cnmHeader">
                            <div className="inputRow">
                                <label>For:</label>
                                <input type="text" className="form-control msgTo" name="msgTo" placeholder="Name" />
                            </div>
                            <div className="inputRow">
                                <label>Subject:</label>
                                <input type="text" className="form-control" name="msgSub" placeholder="Repeat Prescriptions" />
                            </div>
                        </div>
                        <div className="p-3 pt-0">
                            <textarea className="form-control" id="cnMsgBox" rows="5" placeholder="Type a description of the Reminder"></textarea>
                            <div className="btnView">
                                <Link className="btn btn-green"> <i class="bi bi-exclamation-circle-fill"></i> Create Reminder</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default CreateNewReminder;

