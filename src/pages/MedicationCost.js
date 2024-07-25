import React from 'react';
import axios from 'axios'
import { useForm } from 'react-hook-form';
import { getPatient, getUser } from '../apiCalls';
import Sidebar from '../components/sidebar';
import Header from '../components/header';
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"

const MedicationCost = () => {
    const { register, handleSubmit, formState: { errors }, } = useForm();
    const navigate = useNavigate();
    const user = getUser();
    const patient = getPatient();
    const data = [
        { medicine: 'Levothyroxine Sodium', number: '193849439', tablets: '100mcg tablets', quantity: 'x90', perItem: '£2.00', perTablet: '£0.02', perMg: '£0.09' },
        { medicine: 'Levothyroxine Sodium', number: '193849439', tablets: '100mcg tablets', quantity: 'x90', perItem: '£2.00', perTablet: '£0.02', perMg: '£0.09' },
        { medicine: 'Levothyroxine Sodium', number: '193849439', tablets: '100mcg tablets', quantity: 'x90', perItem: '£2.00', perTablet: '£0.02', perMg: '£0.09' },
        { medicine: 'Levothyroxine Sodium', number: '193849439', tablets: '100mcg tablets', quantity: 'x90', perItem: '£2.00', perTablet: '£0.02', perMg: '£0.09' },
        { medicine: 'Levothyroxine Sodium', number: '193849439', tablets: '100mcg tablets', quantity: 'x90', perItem: '£2.00', perTablet: '£0.02', perMg: '£0.09' },
        { medicine: 'Levothyroxine Sodium', number: '193849439', tablets: '100mcg tablets', quantity: 'x90', perItem: '£2.00', perTablet: '£0.02', perMg: '£0.09' }
    ];


    const tableList = data.map(data =>
        <tr>
            <th>{data.medicine} <br /> <span>{data.number}</span> </th>
            <td className="bRo">{data.tablets}</td>
            <td className="bLR0">{data.quantity}</td>
            <td className="text-green text-center"><b>Available</b></td>
            <td className="text-orange text-center"><b>Restricted</b></td>
            <td className="text-center bLR0">{data.perItem}</td>
            <td className="text-center bLR0">{data.perTablet}</td>
            <td className="text-center bLR0">{data.perMg}</td>
            <td className="bLR0">
                <div className="dropdown">
                    <button className="btn" type="button" id="appListAction1" data-bs-toggle="dropdown" aria-expanded="false">
                        <i className="bi bi-three-dots-vertical"></i>
                    </button>
                    <ul className="dropdown-menu" aria-labelledby="appListAction1">
                        <li><a className="dropdown-item" href="#">Action 1</a></li>
                        <li><a className="dropdown-item" href="#">Action 2</a></li>
                    </ul>
                </div>
            </td>
        </tr>
    );

    return (
        <div className="pageContent medicationCostPage">
            <Sidebar />
            <Header />
            <div className="BreadCrumb">
                <div className="container-fluid">
                    {/* <Link to="/overview" className="link">{patient?.patient_forename} {patient?.patient_surname} | #{patient?.patient_id}</Link> */}
                    <span>Medication Cost</span>
                    <div className="ms-auto">
                        <div class="searchBar input-group">
                            <input type="text" class="form-control" placeholder="Search" />
                            <button class="btn" type="button"><i class="bi bi-search"></i></button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container-fluid mt-2">
                <div className="card themeCard">
                    <div className="card-header">
                        <h5>Medication Cost</h5>
                    </div>
                    <div className="card-body p-0">
                        <div className="tab-pane">
                            <table className="table medicationCostTable">
                                <thead>
                                    <tr>
                                        <th colSpan="5" className="bLR0">&nbsp;</th>
                                        <th className="text-center bLR0">Price per Item:</th>
                                        <th className="text-center bLR0">Price per Tablet/Dose:</th>
                                        <th className="text-center bLR0">Price per mg:</th>
                                        <th className="bLR0">&nbsp;</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tableList}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default MedicationCost;

