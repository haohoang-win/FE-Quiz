import './login.scss'
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify'
import { loginUser } from '../../services/userServices';
import { useDispatch } from 'react-redux';
import { loginRedux, setWeekNumber } from '../../redux/slice/userSlice';
import { getCurrentSeason } from '../../services/seasonServices';
import { ImSpinner10 } from 'react-icons/im'

const Login = (props) => {
    let navigate = useNavigate();
    let dispatch = useDispatch();
    const defaultObjsValidInput = {
        isaValidValueLogin: true,
        isValidPassword: true
    }

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [objValidnput, setObjValidnput] = useState(defaultObjsValidInput);

    useEffect(() => {
    }, [])

    const handleCreateNewAccount = () => {
        navigate('/register')
    }

    const handleLogin = async () => {
        setObjValidnput(defaultObjsValidInput)
        let regx = /\S+@\S+\.\S+/;
        if (!regx.test(email)) {
            toast.error('Please enter a valid email address');
            setObjValidnput({ ...defaultObjsValidInput, isaValidValueLogin: false })
            return false;
        }
        if (!password) {
            setObjValidnput({ ...defaultObjsValidInput, isValidPassword: false })
            toast.error("Please enter your password")
            return;
        }
        let res = await loginUser(email, password)
        if (res && +res.EC === 0) {
            let role = res.DT.role
            let email = res.DT.email
            let username = res.DT.username
            let _id = res.DT._id
            let token = res.DT.access_token
            // success
            let data = {
                isAuthenticated: true,
                token,
                account: { role, email, username, _id }
            }
            localStorage.setItem('jwt', token)
            dispatch(loginRedux(data))
            let res1 = await getCurrentSeason();
            if (res1 && res1.EC === 0) {
                let dayOfStart = new Date(res1.DT[0].dayOfStart);
                let currentDate = new Date()
                let days = Math.floor((currentDate - dayOfStart) /
                    (24 * 60 * 60 * 1000));
                let weekNumber = Math.ceil(days / 7)
                dispatch(setWeekNumber(weekNumber))
                navigate('/');
            }
        }
        if (res && +res.EC !== 0) {
            // error
            toast.error(res.EM)
        }
    }

    const handlePressEnter = (e) => {
        if (e.charCode === 13 && e.code === 'Enter') {
            handleLogin();
        }
    }

    const backHomePage = () => {
        navigate('/')
    }

    return (
        <div className="login-container pt-5">
            <div className="container">
                <div className="row px-3 px-sm-0">
                    <div className="content-left col-12 d-none col-sm-4 d-sm-block">
                    </div>
                    <div className="content-right col-sm-4 col-12 d-flex flex-column gap-3 py-3 ">
                        <div className="brand d-sm-none">
                            Quiz App
                        </div>
                        <input type="text"
                            className={objValidnput.isaValidValueLogin ? "form-control" : "form-control is-invalid"}
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input type="password"
                            className={objValidnput.isValidPassword ? "form-control" : "form-control is-invalid"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyPress={(e) => handlePressEnter(e)}
                        />
                        <button className="btn btn-primary" onClick={handleLogin}>Login</button>
                        <span className="text-center">
                            <a className='forgot-password' href='#'>Forgot your password</a>
                        </span>
                        <hr />
                        <div className="text-center">
                            <button className="btn btn-success" onClick={handleCreateNewAccount}>
                                Create new account
                            </button>
                            <div className='btn-back' onClick={backHomePage}>
                                Back to HomePage
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;