import React from 'react';
import axios from 'axios'
import { useForm } from 'react-hook-form';
import { callApi } from '../apiCalls';
import Sidebar from '../components/sidebar';
import Header from '../components/header';
import { Link } from "react-router-dom";
import * as constants from '../constants';

const Triggers = () => {
    const { register, handleSubmit, formState: { errors }, } = useForm();

    return (
        <div className="pageContent remindersPage">
            <Sidebar />
            <Header />
            <div className="BreadCrumb">
                <div className="container-fluid">
                    <span>Triggers</span>
                    <div className="ms-auto">
                        <Link to={constants.ROUTE_HOME + constants.ROUTE_CREATE_TRIGGER} className="btn btn-green">Create a New Trigger</Link>
                    </div>
                </div>
            </div>
            <div className="container-fluid mt-2">
                <div className="card themeCard">
                    <div className="card-header">
                        <h5>Triggers</h5>
                    </div>
                    <div className="card-body p-0">
                        <div className="msgsRow">
                            <div className="msgsColLeft">
                                <ul className="nav nav-pills flex-column msgList" id="pills-tab" role="tablist">
                                    <li className="nav-item" role="presentation">
                                        <a href="#msgList1" className="nav-link" data-bs-toggle="pill" aria-selected="true">
                                            Trigger Type
                                            <span>18/02/2023</span>
                                        </a>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <a href="#msgList2" className="nav-link active" data-bs-toggle="pill" aria-selected="false">
                                            Trigger Type
                                            <span>08/01/2023</span>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div className="msgsColRight">
                                <div className="tab-content msgListTabContent" id="pills-tabContent">
                                    <div className="tab-pane fade" id="msgList1" role="tabpanel" aria-labelledby="msgList1">
                                        msgList 1
                                    </div>
                                    <div className="tab-pane fade show active" id="msgList2" role="tabpanel" aria-labelledby="msgList2">
                                        <div className="msgs">
                                            <div className="msgHeader">
                                                <div className="msgHeaderLeft">
                                                    <p><span>From:</span> Dr. H. Tarian, GP Surgery</p>
                                                    <p><span>Subject:</span> Trigger Type</p>
                                                </div>
                                                <div className="msgHeaderRight">
                                                    <p>18/01/2023, 12:32</p>
                                                </div>
                                            </div>
                                            <div className="msgBody">
                                                {/* <p className="respectly">Hi Mr Smith,</p> */}
                                                <p>Trigger type recorded on the 18th of February 2023.</p>
                                                <p>
                                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
                                                    aliqua.
                                                </p>
                                                <p>
                                                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis
                                                    aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                                                </p>
                                                {/* <p className="regards">
                                                Regards, <br />
                                                Dr. H. Tarian <br />
                                                GP Surgery<br />
                                            </p> */}
                                            </div>
                                            <div className="msgFooter">
                                                <button type="button" className="btn btn-red">
                                                    <i class="bi bi-trash3-fill me-2"></i>
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Triggers;
