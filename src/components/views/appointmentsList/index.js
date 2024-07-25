import React from 'react';
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { Link } from "react-router-dom"

const AppointmentsList = () => {
    const { register, handleSubmit, formState: { errors }, } = useForm();

    return (
        <table className="table appointmentsListTable">
            <tbody>
                <tr>
                    <td>Wednesday 23 February 2023</td>
                    <th>16:20</th>
                    <td>General check up - face to face</td>
                    <td>The Park Medical Prectice</td>
                    <td>
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
                <tr>
                    <td>Wednesday 23 February 2023</td>
                    <th>16:20</th>
                    <td>General check up - face to face</td>
                    <td>The Park Medical Prectice</td>
                    <td>
                        <div className="dropdown">
                            <button className="btn" type="button" id="appListAction2" data-bs-toggle="dropdown" aria-expanded="false">
                                <i className="bi bi-three-dots-vertical"></i>
                            </button>
                            <ul className="dropdown-menu" aria-labelledby="appListAction2">
                                <li><a className="dropdown-item" href="#">Action 1</a></li>
                                <li><a className="dropdown-item" href="#">Action 2</a></li>
                            </ul>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>Wednesday 23 February 2023</td>
                    <th>16:20</th>
                    <td>General check up - face to face</td>
                    <td>The Park Medical Prectice</td>
                    <td>
                        <div className="dropdown">
                            <button className="btn" type="button" id="appListAction3" data-bs-toggle="dropdown" aria-expanded="false">
                                <i className="bi bi-three-dots-vertical"></i>
                            </button>
                            <ul className="dropdown-menu" aria-labelledby="appListAction3">
                                <li><a className="dropdown-item" href="#">Action 1</a></li>
                                <li><a className="dropdown-item" href="#">Action 2</a></li>
                            </ul>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>Wednesday 23 February 2023</td>
                    <th>16:20</th>
                    <td>General check up - face to face</td>
                    <td>The Park Medical Prectice</td>
                    <td>
                        <div className="dropdown">
                            <button className="btn" type="button" id="appListAction3" data-bs-toggle="dropdown" aria-expanded="false">
                                <i className="bi bi-three-dots-vertical"></i>
                            </button>
                            <ul className="dropdown-menu" aria-labelledby="appListAction3">
                                <li><a className="dropdown-item" href="#">Action 1</a></li>
                                <li><a className="dropdown-item" href="#">Action 2</a></li>
                            </ul>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    )
}
export default AppointmentsList;

