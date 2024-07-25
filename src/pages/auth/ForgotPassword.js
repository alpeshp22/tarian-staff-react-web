import React from 'react';
import { useForm } from 'react-hook-form'
import { Link } from "react-router-dom"
import * as constants from '../../constants';
import { callApi } from '../../apiCalls'

const ForgotPassword = () => {
    const { register, handleSubmit, setError, formState: { errors }, } = useForm();
    const onSubmit = async data => {
        try {
            const params = {
                method: 'post',
                url: constants.API_FORGOT_PASSWORD,
                data: data,
            };

            callApi([params]).then((response) => {
                let resp = response[constants.API_FORGOT_PASSWORD];
                if (resp.success) {
                    // console.log('success response >>> ', resp);
                } else {
                    // console.log("error responseData >> ",resp.data.detail);
                    setError('username', {
                        type: "server",
                        message: resp.data.detail,
                    });
                }
            })
            .catch((error) => {
                // console.log('catch error >>> ', error);
            });
        } catch (e) {
            // console.log('catch error >>> ', e);
        }
    };

    return (
        <div className="loginPage frgotPassPage">
            <form className="loginForm form" onSubmit={handleSubmit(onSubmit)}>
                <div className="logo">
                    <img src={constants.LOGO_COLOR} className="img-fluid" alt="logo" />
                </div>
                <label className="frmTitle">Forgotten your Password?</label>
                <p className="msgTxt">
                    Enter your email below and we'll send you a link to reset it.
                </p>
                <div className="form-floating formGroup">
                <input type="email" className="form-control" id="email" {...register('email', {
                    required: 'Email is required',
                    pattern: {
                        value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                        message: 'Please enter a valid email',
                    },
                })} />
                {errors.email?.message && ( <span className="error">{errors.email?.message}</span> )}
                    <label htmlFor="email">Email:</label>
                </div>
                <div className="btnView">
                    <button type="submit" className="btn btn-orange">Reset Password</button>
                </div>
                <div className="frgot-pass">
                    <i className="bi bi-caret-left-fill"></i><Link to="/login">Back to Sign In</Link>
                </div>
            </form>
        </div>
    )
}

export default ForgotPassword;
