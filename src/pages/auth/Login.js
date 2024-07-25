import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form'
import { Link } from "react-router-dom"
import * as constants from '../../constants'
import { useNavigate } from "react-router-dom"
import { callApi, getAccessToken, getRefreshToken, getUser, getStaffProfile } from '../../apiCalls'
import LoadingSpinner from "../../components/LoadingSpinner";


const Login = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, reset, setError, formState: { errors }, } = useForm();
    const [accessToken, setAccessToken] = useState(getAccessToken());
    const [refreshToken, setRefreshToken] = useState(getRefreshToken());
    const [user, setUser] = useState(getUser());
    const [staffProfile, setStaffProfile] = useState(getStaffProfile());

    const saveToken = (user, accessToken, refreshToken) => {
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        
        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
        setUser(user);
        
        navigate('/patient-search');
    }

    const saveStaffProfile = (staffProfile) => {
        localStorage.setItem('staffProfile', JSON.stringify(staffProfile));
        setStaffProfile(staffProfile);
    }

    const onSubmit = async data => {
        setIsLoading(true);
        // alert(JSON.stringify(data));
        try {
            const loginparams = {
                method: 'post',
                url: constants.API_LOGIN,
                data: data,
            };

            callApi([loginparams]).then((response) => {
                let loginReposnse = response[constants.API_LOGIN];
                if (loginReposnse.success) {
                    // console.log('success loginReposnse >>> ', loginReposnse);
                    const userparams = {
                        method: 'get',
                        url: constants.API_STAFF_USER_CONNECT,
                    };
                    callApi([userparams], loginReposnse.data.access).then((response) => {
                        let userResponse = response[constants.API_STAFF_USER_CONNECT];
                        if(userResponse.data.is_staff && userResponse.data.is_active){
                            if (userResponse.success) {
                                console.log(constants.API_STAFF_USER_CONNECT + 'success userResponse >>> ', userResponse);
                                if (userResponse.data.is_active) {

                                    const checkPrescriber = {
                                        method: 'get',
                                        url: constants.API_STAFF_USER_PROFILE
                                    }
                            
                                    callApi([checkPrescriber], loginReposnse.data.access, navigate).then((response) => {
                                        let resp = response[constants.API_STAFF_USER_PROFILE]
                                        console.log(resp);
                                        if (resp.success) {
                                            saveStaffProfile(resp.data);
                                        }
                                    })
                                    saveToken(userResponse.data, loginReposnse.data.access, loginReposnse.data.refresh);
                                    toast.success("Logged in successfully!");
                                } else {
                                    setError('username', {
                                        type: "server",
                                        message: "Your account is inactive. Contact to admin for more details.",
                                    });
                                }
                            } else {
                                // console.log("error userResponse >> ",userResponse.data.detail);
                                console.log(constants.API_STAFF_USER_CONNECT + 'error userResponse >>> ', userResponse);
                                toast.error("Something went wrong! Try again later.");
                            }
                        }else{
                            toast.error("You are not authorized to access this page.");
                            reset({username:'',password:''});
                        }
                        setIsLoading(false)
                    })
                    .catch(() => {
                        setIsLoading(false)
                        toast.error("Something went wrong! Try again later.");
                    });
                } else {
                    setIsLoading(false)
                    // console.log("error loginReposnse >> ",loginReposnse.data.detail);
                    setError('username', {
                        type: "server",
                        message: loginReposnse.data.detail,
                    });
                }
            })
            .catch((error) => {
                
                toast.error("Something went wrong! Try again later.");
            });
        } catch (e) {
            setIsLoading(false)
            toast.error("Something went wrong! Try again later.");
        }
    };

    return (
        <>
            {isLoading ? <LoadingSpinner /> : ""}
            <div className="loginPage">
                <form className="loginForm form" onSubmit={handleSubmit(onSubmit)}>
                    <div className="logo">
                        <img src={constants.LOGO_COLOR} className="img-fluid" alt="logo" />
                    </div>
                    <label className="frmTitle">Sign In</label>
                    <div className="form-floating formGroup">
                        <input type="text" className="form-control" id="username" {...register('username', {
                            required: 'Username is required',
                        })} />
                        <label htmlFor="username">Username:</label>
                        {errors.username?.message && (<span className="error">{errors.username?.message}</span>)}
                    </div>
                    <div className="form-floating formGroup">
                        <input type="password" className="form-control" id="password" {...register('password', {
                            required: 'Password is required',
                        })} />
                        <label htmlFor="password">Password:</label>
                        {errors.password?.message && (<span className="error">{errors.password?.message}</span>)}
                    </div>
                    <div className="btnView">
                        <button type="submit" className="btn btn-orange" disabled={isLoading}>Log In</button>
                    </div>
                    <div className="frgot-pass">
                        <Link to="/forgot-password">Forgotten your Password?</Link>
                    </div>
                </form>
            </div>
        </>
    )
}
export default Login;
/*
<div className="form-floating formGroup">
    <input type="email" className="form-control" id="email" {...register('email', {
        required: 'Email is required',
        pattern: {
            value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            message: 'Please enter a valid email',
        },
    })} />
    {errors.email?.message && (<span className="error">{errors.email?.message}</span>)}
    <label htmlFor="email">Email:</label>
</div>
*/
