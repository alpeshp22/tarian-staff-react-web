import React from 'react';
import { Link } from "react-router-dom"
import { useLocation, useNavigate } from "react-router-dom"
import * as constants from '../../constants'
import { getUser,logout } from '../../apiCalls'

const Header = () => {
    const navigate = useNavigate();
    const user = getUser();
    const logoutUser = () => {
        logout(navigate);
    }
    const location = useLocation();
    const { pathname } = location;
    const splitLocation = pathname.split("/");
    // console.log("splitLocation > ",splitLocation);

    const backBtn = () => {
        if(splitLocation[1] === constants.ROUTE_APPOINTMENT_CREATE) {
            return (
                <li className="nav-item back-item">
                    <Link to={constants.ROUTE_HOME + constants.ROUTE_APPOINTMENTS_EVENTS} className="nav-link"><i className="bi bi-chevron-left me-1"></i>Back to Appointments & Events</Link>
                </li>
            )
        } else if(splitLocation[1] === constants.ROUTE_MESSAGE_COMPOSE) {
            return (
                <li className="nav-item back-item">
                    <Link to={constants.ROUTE_HOME + constants.ROUTE_MESSAGE_CENTER} className="nav-link"><i className="bi bi-chevron-left me-1"></i>Back to Message & Centre</Link>
                </li>
            )
        }
    }
    return (
        <header className="topHeader">
            <nav className="nav">
                {backBtn()}
                <li className="nav-item">
                    <span className="nav-link">Hi, {user ? user.first_name : ""} {user ? user.last_name : ""}</span>
                </li>
                <li className="nav-item dropdown">
                    <a href="#" className="nav-link" data-bs-toggle="dropdown" role="button" aria-expanded="false">
                        <i className="bi bi-gear-fill"></i>
                    </a>
                    <ul className="dropdown-menu">
                        <li><Link to="/overview" className="dropdown-item">Link 1</Link></li>
                        <li><Link to="/overview" className="dropdown-item">Link 2</Link></li>
                        <li><Link to="/overview" className="dropdown-item">Link 3</Link></li>
                    </ul>
                </li>
                <li className="nav-item">
                    <span role="button" className="nav-link" onClick={logoutUser}>Logout</span>
                </li>
            </nav>
        </header>
    )
}
export default Header;
