import './register.scss'
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const Register = (props) => {
    let navigate = useNavigate();
    const defaultValidInput = {
        isValidEmail: true,
        isValidPhone: true,
        isValidPassword: true,
        isValidComfirmPassword: true
    }

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [comfirmPassword, setComfirmPassword] = useState('');
    const [objCheckInput, setObjCheckInput] = useState(defaultValidInput);

    useEffect(() => {
    }, []);

    const isValidInputs = () => {
        setObjCheckInput(defaultValidInput)
        if (!email) {
            toast.error("Email is required!");
            setObjCheckInput({ ...defaultValidInput, isValidEmail: false });
            return false;
        }
        let regx = /\S+@\S+\.\S+/;
        if (!regx.test(email)) {
            toast.error('Please enter a valid email address');
            setObjCheckInput({ ...defaultValidInput, isValidEmail: false });
            return false;
        }
        if (!password) {
            toast.error("Password is required!");
            setObjCheckInput({ ...defaultValidInput, isValidPassword: false });
            return false;
        }
        if (password !== comfirmPassword) {
            toast.error("Your password is not the same.");
            setObjCheckInput({ ...defaultValidInput, isValidComfirmPassword: false });
            return false;
        }

        return true;
    }

    const handleLogin = () => {
        navigate('/login')
    }

    const handleRegister = async () => {
        // let check = isValidInputs();
        // if (check === true) {
        //     let serverData = await registerNewUser(email, phone, username, password)
        //     if (+serverData.EC === 0) {
        //         toast.success(serverData.EM)
        //         navigate('/login')
        //     } else {
        //         toast.error(serverData.EM)
        //     }
        // }
    }

    return (
        <div className="register-container pt-5">
            <div className="container">
                <div className="row px-3 px-sm-0">
                    <div className="content-left col-12 d-none col-sm-4 d-sm-block">
                    </div>
                    <div className="content-right col-sm-4 col-12 d-flex flex-column gap-3 py-3 ">
                        <div className="brand d-sm-none">
                            Quiz App
                        </div>
                        <div className='form-group'>
                            <label>Email:</label>
                            <input type="text" className={objCheckInput.isValidEmail ? "form-control" : "form-control is-invalid"} placeholder="Email address"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                            />
                        </div>
                        <div className='form-group'>
                            <label>Username:</label>
                            <input type="text" className="form-control" placeholder="Username"
                                value={username}
                                onChange={(event) => setUsername(event.target.value)}
                            />
                        </div>
                        <div className='form-group'>
                            <label>Password:</label>
                            <input type="password" className={objCheckInput.isValidPassword ? "form-control" : "form-control is-invalid"} placeholder="Password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                            />
                        </div>
                        <div className='form-group'>
                            <label>Re-enter password:</label>
                            <input type="password" className={objCheckInput.isValidComfirmPassword ? "form-control" : "form-control is-invalid"} placeholder="Re-enter password"
                                value={comfirmPassword}
                                onChange={(event) => setComfirmPassword(event.target.value)}
                            />
                        </div>
                        <button className="btn btn-primary" onClick={handleRegister} type="button">Register</button>
                        <hr />
                        <div className="text-center">
                            <button className="btn btn-success" onClick={handleLogin}>
                                Already've an account. Login
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register;