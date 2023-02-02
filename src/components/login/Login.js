import './login.scss'
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify'

const Login = (props) => {
    let navigate = useNavigate();
    const defaultObjsValidInput = {
        isaValidValueLogin: true,
        isValidPassword: true
    }

    const [valueLogin, setValueLogin] = useState('')
    const [password, setPassword] = useState('')
    const [objValidnput, setObjValidnput] = useState(defaultObjsValidInput);

    useEffect(() => {
    }, [])

    const handleCreateNewAccount = () => {
        navigate('/register')
    }

    const handleLogin = async () => {
        setObjValidnput(defaultObjsValidInput)
        if (!valueLogin) {
            setObjValidnput({ ...defaultObjsValidInput, isaValidValueLogin: false })
            toast.error("Please enter your email address or phone number")
            return;
        }
        if (!password) {
            setObjValidnput({ ...defaultObjsValidInput, isValidPassword: false })
            toast.error("Please enter your password")
            return;
        }
        // let res = await loginUser(valueLogin, password)
        // if (res && +res.EC === 0) {
        //     let groupWithRoles = res.DT.groupWithRoles
        //     let email = res.DT.email
        //     let username = res.DT.username
        //     let token = res.DT.access_token
        //     // success
        //     let data = {
        //         isAuthenticated: true,
        //         token,
        //         account: { groupWithRoles, email, username }
        //     }
        //     localStorage.setItem('jwt', token)
        //     loginContext(data)
        //     navigate('/users');
        // }
        // if (res && +res.EC !== 0) {
        //     // error
        //     toast.error(res.EM)
        // }
    }

    const handlePressEnter = (e) => {
        if (e.charCode === 13 && e.code === 'Enter') {
            handleLogin();
        }
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
                            value={valueLogin}
                            onChange={(e) => setValueLogin(e.target.value)}
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;