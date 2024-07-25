import React from 'react';
import moment from 'moment';
import { getPatient, getpatientInfo } from '../../../apiCalls';

const PrescriptionsList = ({ record, getStatus, Order, setOrder
    , checkIt, setCheckIt 
}) => {
    const patient = getPatient();
    const patientInfo = getpatientInfo();
    if (checkIt) {
        const checkboxes = document.getElementsByClassName('themeCheckBox');
        for (let i = 0; i < checkboxes.length; i++) {
            checkboxes[i].checked = false;
        }
        setCheckIt(checkIt = false);
        setOrder([]);
    }

    return (
        <>
            <table className="table prescriptionsListTable mb-0">
                <tbody>
                    {record?.length > 0 ?
                        record.map((rec) => {
                            return (
                                <tr key={rec.repeat.id}>
                                    <td className="border-right"><p className="text-center">
                                        {moment(rec.repeat.eventdate).format("DD MMMM yyyy")}
                                    </p></td>
                                    <td className="border-right w20">
                                        <h5>{rec.repeat.drug_code_display ? rec.repeat.drug_code_display : rec.repeat.drug_code}</h5>
                                        <h6>
                                            {rec.repeat.quantity} {rec.repeat.packsize} - {rec.repeat.dosage} <br />
                                            Previously Issued: {rec.repeat.last_issue !== 'N/A' ? moment(rec.repeat.last_issue).format('DD MMMM yyyy') : "No"}
                                        </h6>
                                    </td>
                                    <td className="border-right w20">
                                        <p>Prescribed by:</p>
                                        <p className="iconTxt"><i className="bi bi-geo-alt-fill"></i>{patient.surgery_name}</p>
                                        <p className="iconTxt"><i className="bi bi-telephone-fill"></i>{patientInfo.phone_numbers ? patientInfo.phone_numbers.map(da => da.number).join(', ') : "-"}</p>
                                    </td>
                                    <td className="w20">
                                        <p>Collection form:</p>
                                        <p className="iconTxt"><i className="bi bi-geo-alt-fill"></i>
                                            <span>Pharmacist-</span> 123 Acacia Avenue <br />
                                            Cwmbran, Torfaen <br />
                                            CD12 3AB
                                        </p>
                                    </td>
                                    <td>
                                        <p className="text-orange"><b>Requested</b></p>
                                        <p>
                                            Awaiting Approval by GP
                                        </p>
                                    </td>
                                    {/* <td className="w80">
                                    <div className="dropdown">
                                        <button className="btn" type="button" id="appListAction1" data-bs-toggle="dropdown" aria-expanded="false">
                                            <i className="bi bi-three-dots-vertical"></i>
                                        </button>
                                        <ul className="dropdown-menu" aria-labelledby="appListAction1">
                                            <li><a className="dropdown-item" href="#">Action 1</a></li>
                                            <li><a className="dropdown-item" href="#">Action 2</a></li>
                                        </ul>
                                    </div>
                                </td> */}
                                    {
                                        getStatus !== "inactive" ?
                                            <td className="w80">
                                                <input className="form-check-input themeCheckBox" type="checkbox" id={rec.repeat.id} name={rec.repeat.id}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setOrder([
                                                                ...Order, {
                                                                    "drug_code_display": rec.repeat.drug_code_display,
                                                                    "drug_code": rec.repeat.drug_code,
                                                                    "quantity": rec.repeat.quantity,
                                                                    "dosage": rec.repeat.dosage,
                                                                    "packsize": rec.repeat.packsize,
                                                                    "max_issues": rec.repeat.max_issues,
                                                                    "drugsource": rec.repeat.drug_source
                                                                }
                                                            ]);
                                                        } else {
                                                            setOrder(
                                                                Order.filter((people) => people.drug_code !== rec.repeat.drug_code),
                                                            );
                                                        }
                                                    }}
                                                />
                                            </td>
                                            : ""
                                    }
                                </tr>
                            )
                        }) : <tr><td colSpan='6'>{getStatus !== "inactive" ? 'No Repeats' : 'No Past Prescriptions Found.'}</td></tr>
                    }
                </tbody>
            </table>
        </>
    )
}
export default PrescriptionsList;
