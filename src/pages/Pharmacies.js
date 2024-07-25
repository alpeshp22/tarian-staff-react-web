import React, { useState,useEffect } from 'react';
import { toast } from 'react-toastify';
import * as constants from '../constants'
import { callApi,getAccessToken, getPatient } from '../apiCalls';
import Sidebar from '../components/sidebar';
import Header from '../components/header';
import { useNavigate } from "react-router-dom"
import LoadingSpinner from "../components/LoadingSpinner";
import { Link } from "react-router-dom";
import * as geolib from 'geolib';
import Map from './Maps';

const Pharmacies = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [current, setCurrent] = useState(0);
    const patient = getPatient();

    const [pharamacies, setPharamacies] = useState([]);

    useEffect(() => {
        fetchPharamacies();
        currentLocation();
    }, []);

    const currentLocation = () => {
        navigator.geolocation.getCurrentPosition((position) => {
            setCurrent({
                latitude:position.coords.latitude,
                longitude:position.coords.longitude
            });
        })
    };

    const getDistance = (lat, long) => {
        let medis = geolib.getPreciseDistance(current, {
            latitude:lat,
            longitude:long
        });
        let miles = geolib.convertDistance(medis,'mi');
        return miles.toFixed(2);
    }

    const fetchPharamacies = () => {
        try {
            setIsLoading(true);
            const params = {
                method: 'post',
                url: constants.API_STAFF_USER_PHARMACY_DETAIL,
            };

            callApi([params],getAccessToken(),navigate).then((response) => {
                let resp = response[constants.API_STAFF_USER_PHARMACY_DETAIL];
                // console.log(constants.API_STAFF_USER_PHARMACY_DETAIL+' resp >>> ', resp);
                if (resp.success) {
                    setPharamacies(resp.data.Pharmacy_list);
                } else {
                    toast.error(resp.data.detail);
                }
                setIsLoading(false)
            })
            .catch((error) => {
                setIsLoading(false)
                toast.error("Something went wrong! Try again later.");
            });
        } catch (e) {
            setIsLoading(false)
            toast.error("Something went wrong! Try again later.");
        }
    }

    function pharamacyHtml(props) {
        console.log("props >>> ",props);
        return(
            <div className="row">
                <div className="col-md-4">
                    <h5>{props.pharmacyName}</h5>
                </div>
                <div className="col-md-4">
                    <p className="iconTxt"><i className="bi bi-telephone-fill"></i>{props.pharmacyPhonenumber}</p>
                    <p className="iconTxt">
                        <i className="bi bi-geo-alt-fill"></i>
                        {props.pharmacyAddress}<br/>
                        {props.pharmacyPostcode}
                    </p>
                </div>
                <div className="col-md-4">
                    <p className="distanceTxt">
                        <i className="bi bi-geo-alt-fill"><span>A</span></i>
                        <span>{current ? getDistance(props.pharmacyLatitude || props.pharamcyLatitude, props.pharmacyLongitude) + "miles" : ""}</span>
                    </p>
                </div>
            </div>
        );
    }

    return (
        <>
        {isLoading ? <LoadingSpinner /> : ""}
        <div className="pageContent pharmaciesPage">
            <Sidebar />
            <Header />
            <div className="BreadCrumb">
                <div className="container-fluid">
                    <Link to={ constants.ROUTE_HOME + constants.ROUTE_PATIENT_OVERVIEW } className="link">{patient?.patient_forename} {patient?.patient_surname} | #{patient?.patient_id}</Link>
                    <span>Pharmacies</span>
                </div>
            </div>
            <div className="container-fluid mt-2">
                <div className="Row mt-4">
                    <div className="card themeCard w-500 pharmaciesCard">
                        <div className="card-header">
                            <h5>Patient's Nearby Pharmacies</h5>
                        </div>
                        <div className="card-body w-70 p-0">
                            <div className="row mx-auto w-100">
                                <div className="col-lg-6 contentCol">
                                    { pharamacies.length>0 && pharamacies.map(pharamacy => pharamacyHtml(pharamacy)) }
                                </div>
                                <div className="col-lg-6 px-0 mapCol">
                                    {/* <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2474.2586334039897!2d-3.030393183967905!3d51.673408779662886!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4871de70305dc805%3A0x7eefbfdd7830754f!2sAcacia%20Ave%2C%20Cwmbran%2C%20UK!5e0!3m2!1sen!2sin!4v1678714648367!5m2!1sen!2sin" title="YouTube video" allowFullScreen></iframe> */}
                                    <Map coordinates={pharamacies} current={current}/>
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
export default Pharmacies;
