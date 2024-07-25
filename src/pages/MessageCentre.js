import React, { useEffect, useState } from 'react';
import { callApi, getAccessToken, getPatient, getUser } from '../apiCalls';
import { toast } from 'react-toastify';
import * as constants from '../constants'
import Sidebar from '../components/sidebar';
import Header from '../components/header';
import LoadingSpinner from '../components/LoadingSpinner';
import { Link, useNavigate } from "react-router-dom"
import moment from 'moment';

const MessageCentre = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [messageCurrent, setMessageCurrent] = useState([]);
    const [messagePrevious, setMessagePrevious] = useState([]);
    const [ty, setTy] = useState("");
    const navigate = useNavigate();
    const patient = getPatient();
    const user = getUser();

    const messageCentre = (type) => {
        try {
            setIsLoading(true)
            setTy(type)
            const messageParams = {
                method: 'get',
                url: constants.API_STAFF_MESSAGE_DETAIL + `/received/${type}`
            }

            callApi([messageParams], getAccessToken(), navigate).then((response) => {
                let resp = response[constants.API_STAFF_MESSAGE_DETAIL + `/received/${type}`]
                console.log(resp);
                if (resp.success) {
                    type === 'unread'
                        ?
                        (
                            resp.data.notifications_received_unread_count > 0
                                ?
                                setMessageCurrent(resp.data.notifications_received_unread)
                                :
                                setMessageCurrent([])
                        )
                        :
                        (
                            resp.data.notifications_received_read_count > 0
                                ?
                                setMessagePrevious(resp.data.notifications_received_read)
                                :
                                setMessagePrevious([])
                        )
                } else {
                    console.log(resp.data.detail);
                    toast.error(resp.data.detail)
                }
                setIsLoading(false)
            })
        } catch (e) {
            setIsLoading(false);
            toast.error('Something is wrong!')
        }
    }

    useEffect(() => {
        messageCentre("unread");
    }, []);

    return (
        <>
            {isLoading ? <LoadingSpinner /> : ""}
            <div className="pageContent msgCentrePage">
                <Sidebar />
                <Header />
                <div className="BreadCrumb">
                    <div className="container-fluid">
                        <Link to={constants.ROUTE_HOME + constants.ROUTE_PATIENT_OVERVIEW} className="link">{patient.patient_forename} {patient.patient_surname} | #{patient.patient_id}</Link>
                        <span>Message Centre</span>
                        <div className="ms-auto">
                            <Link to={constants.ROUTE_HOME + constants.ROUTE_MESSAGE_COMPOSE} className="btn btn-green">Compose New Message</Link>
                        </div>
                    </div>
                </div>
                <div className="container-fluid mt-2">
                    <div className="themeTabs">
                        {/* <ul className="nav nav-pills" id="pills-tab" role="tablist">
                            <li className="nav-item" role="presentation">
                                <button className="nav-link active" data-bs-toggle="pill" data-bs-target="#tab1">
                                    Personal Messages
                                </button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button className="nav-link" data-bs-toggle="pill" data-bs-target="#tab2">
                                    Global Messages
                                </button>
                            </li>
                        </ul> */}
                        <div className="tab-content p-0" id="pills-tabContent">
                            <div className="tab-pane fade show active" id="tab1" role="tabpanel" aria-labelledby="tab1">
                                <div className="msgsRow">
                                    <div className="msgsColLeft">
                                        <ul className="nav nav-pills msgsRowNav" id="pills-tab" role="tablist">
                                            <li className="nav-item" role="presentation">
                                                <button className="nav-link active" data-bs-toggle="pill" data-bs-target="#msgTab1" onClick={() => messageCentre("unread")}>
                                                    Current Messages
                                                </button>
                                            </li>
                                            <li className="nav-item" role="presentation">
                                                <button className="nav-link" data-bs-toggle="pill" data-bs-target="#msgTab2" onClick={() => messageCentre("read")}>
                                                    Previous Messages
                                                </button>
                                            </li>
                                        </ul>
                                        <div className="tab-content p-0 msgsTabContent" id="pills-tabContent">
                                            <div className="tab-pane fade show active" id="msgTab1" role="tabpanel" aria-labelledby="msgTab1">
                                                {
                                                    messageCurrent?.length > 0 ?
                                                        <ul className="nav nav-pills flex-column msgList" id="pills-tab" role="tablist">
                                                            {
                                                                messageCurrent.map((mes, index) => {
                                                                    return (
                                                                        <li className="nav-item" role="presentation" key={index}>
                                                                            <a href={`#msg${mes.pk}`} className={`nav-link ${index === 0 ? 'show active' : ''}`} data-bs-toggle="pill">
                                                                                {mes.fields.verb}
                                                                                <span>{moment(mes.fields.timestamp).format("DD/MMM/yyyy")}</span>
                                                                            </a>
                                                                        </li>
                                                                    )
                                                                })
                                                            }
                                                        </ul>
                                                        : "No record"
                                                }
                                            </div>
                                            <div className="tab-pane fade" id="msgTab2" role="tabpanel" aria-labelledby="msgTab2">
                                                {
                                                    messagePrevious?.length > 0 ?
                                                        <ul className="nav nav-pills flex-column msgList" id="pills-tab" role="tablist">
                                                            {
                                                                messagePrevious.map((mes, index) => {
                                                                    return (
                                                                        <li className="nav-item" role="presentation" key={index}>
                                                                            <a href={`#msg${mes.pk}`} className={`nav-link ${index === 0 ? 'show active' : ''}`} data-bs-toggle="pill">
                                                                                {mes.fields.verb}
                                                                                <span>{moment(mes.fields.timestamp).format("DD/MMM/yyyy")}</span>
                                                                            </a>
                                                                        </li>
                                                                    )
                                                                })
                                                            }
                                                        </ul>
                                                        : "No record"
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div className="msgsColRight">
                                        <div className="tab-content msgListTabContent" id="pills-tabContent">
                                            {
                                                ty === 'unread' ?
                                                    messageCurrent?.length > 0 ?
                                                        messageCurrent?.map((mes, index) => {
                                                            return (
                                                                <div className={`tab-pane fade ${index === 0 ? 'show active' : ''} `} key={index} id={`msg${mes.pk}`} role="tabpanel" aria-labelledby={mes.pk}>
                                                                    <div className="msgHeader">
                                                                        <div className="msgHeaderLeft">
                                                                            <p><span>From:</span> {user.first_name} {user.last_name}, {patient.surgery_name}</p>
                                                                            <p><span>Subject:</span> {mes.fields.verb}</p>
                                                                        </div>
                                                                        <div className="msgHeaderRight">
                                                                            <p>{moment(mes.fields.timestamp).format('DD/MM/yyyy')}, {moment(mes.fields.timestamp).format('HH:mm')}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="msgBody">
                                                                        {mes.fields.description}
                                                                    </div>
                                                                    {
                                                                        JSON.parse(mes.fields.data)?.url ?
                                                                            <div className="text-end mt-2">
                                                                                <a href={JSON.parse(mes.fields.data).url} target="_blank" rel="noopener noreferrer" className='btn btn-green'>View Letter as PDF</a>
                                                                            </div>
                                                                            : ""}
                                                                </div>
                                                            )
                                                        }) : "No record present"
                                                    :
                                                    messagePrevious?.length > 0 ?
                                                        messagePrevious?.map((mes, index) => {
                                                            return (
                                                                <div className={`tab-pane fade ${index === 0 ? 'show active' : ''} `} key={index} id={`msg${mes.pk}`} role="tabpanel" aria-labelledby={mes.pk}>
                                                                    <div className="msgHeader">
                                                                        <div className="msgHeaderLeft">
                                                                            <p><span>From:</span> {user.first_name} {user.last_name}, {patient.surgery_name}</p>
                                                                            <p><span>Subject:</span> {mes.fields.verb}</p>
                                                                        </div>
                                                                        <div className="msgHeaderRight">
                                                                            <p>{moment(mes.fields.timestamp).format('DD/MM/yyyy')}, {moment(mes.fields.timestamp).format('HH:mm')}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="msgBody">
                                                                        {mes.fields.description}
                                                                    </div>
                                                                    {
                                                                        mes.fields.data?.url ?
                                                                            <div className='text-end'>
                                                                                <a href={mes.fields.data} target="_blank" rel="noopener noreferrer" className='btn btn-green'>View Letter as PDF</a>
                                                                            </div>
                                                                            :
                                                                            ""}
                                                                </div>
                                                            )
                                                        }) : "No record present"
                                            }
                                        </div>
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
export default MessageCentre;
