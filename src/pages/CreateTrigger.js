import React from 'react';
import axios from 'axios'
import { useForm } from 'react-hook-form';
import { callApi } from '../apiCalls';
import Sidebar from '../components/sidebar';
import Header from '../components/header';
import { Link } from "react-router-dom";
import * as constants from '../constants';

const CreateTrigger = () => {
    const { register, handleSubmit, formState: { errors }, } = useForm();

    return (
        <div className="pageContent createTriggerPage">
            <Sidebar />
            <Header />
            <div className="BreadCrumb">
                <div className="container-fluid">
                    <Link to={constants.ROUTE_HOME + constants.ROUTE_TRIGGERS} className="link">Triggers</Link>
                    <span>Create a Trigger</span>
                </div>
            </div>
            <div className="container-fluid mt-2">
                <div className="card themeCard cnMsgCard">
                    <div className="card-header">
                        <h5>Create a Trigger</h5>
                    </div>
                    <div className="card-body p-0">
                        <div className="cnmHeader">
                            <div className="inputRow">
                                <label>For:</label>
                                <input type="text" className="form-control msgTo" name="msgTo" placeholder="Name" />
                            </div>
                            <div className="inputRow">
                                <label>Trigger Type:</label>
                                <input type="text" className="form-control" name="msgSub" placeholder="Moderate/Severe pain" />
                            </div>
                        </div>
                        <div className="p-3 pt-0">
                            <textarea className="form-control" id="cnMsgBox" rows="5" placeholder="Type a description of the Trigger"></textarea>
                            <div className="btnView">
                                <Link className="btn btn-green"> <i class="bi bi-exclamation-circle-fill"></i> Create Trigger</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default CreateTrigger;

