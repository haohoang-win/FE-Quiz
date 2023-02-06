import { useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { logoutRedux } from '../../redux/slice/userSlice';
import { logoutUser } from '../../services/userServices';

const Header = (props) => {
    const location = useLocation()
    const role = useSelector(state => state.user?.account?.role)
    const username = useSelector(state => state.user?.account?.username)
    const dispatch = useDispatch()

    const handleLogOut = async () => {
        let data = await logoutUser();
        if (data.EC === 0) {
            localStorage.removeItem('jwt');
            if (data && +data.EC === 0) {
                dispatch(logoutRedux())
            } else {
                toast.error(data.EM)
            }
        } else {
            toast.error(data.EM)
        }
    }

    if (location.pathname !== '/login' && location.pathname !== '/register') {
        return (
            <>
                <Navbar bg="light" expand="lg">
                    <Container>
                        <NavLink to='/' className='nav-link'>Quiz App</NavLink>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="me-auto">
                                {(role && role !== 'STUDENT') ?
                                    <NavDropdown title="User" id="basic-nav-dropdown">
                                        {role === 'MANAGER' ?
                                            <NavDropdown.Item ><NavLink to='/add-user' className='nav-link'>Create a User</NavLink></NavDropdown.Item>
                                            : <></>
                                        }
                                        <NavDropdown.Item><NavLink to='/users' className='nav-link'>All User</NavLink></NavDropdown.Item>
                                        <NavDropdown.Item><NavLink to='/quiz-user' className='nav-link'>Add a Quiz for User</NavLink></NavDropdown.Item>
                                    </NavDropdown>
                                    : <></>
                                }
                                {(role && role !== 'STUDENT') ?
                                    <>
                                        <NavDropdown title="Quiz" id="basic-nav-dropdown">
                                            <NavDropdown.Item ><NavLink to='/add-quiz' className='nav-link'>Create a Quiz</NavLink></NavDropdown.Item>
                                            <NavDropdown.Item><NavLink to='/quizzes' className='nav-link'>All Quiz</NavLink></NavDropdown.Item>
                                            <NavDropdown.Item><NavLink to='/upsert-quiz' className='nav-link'>Upsert Quiz</NavLink></NavDropdown.Item>
                                        </NavDropdown>
                                    </>
                                    : <></>
                                }
                            </Nav>
                            <Nav>
                                {role ?
                                    <>
                                        <Nav className='nav-link'>Welcome {username}!</Nav>
                                        <NavLink to='/exams' className='nav-link'>Go to exams</NavLink>
                                        <NavDropdown title="Setting" id="basic-nav-dropdown">
                                            <NavDropdown.Item ><NavLink to='/' className='nav-link'>My Profile</NavLink></NavDropdown.Item>
                                            <NavDropdown.Item><span onClick={handleLogOut}><NavLink to='/' className='nav-link'>
                                                Logout
                                            </NavLink></span></NavDropdown.Item>
                                        </NavDropdown>
                                    </>
                                    :
                                    <>
                                        <NavLink to='/login' className='nav-link'>Login</NavLink>
                                        <NavLink to='/register' className='nav-link'>Register</NavLink>
                                    </>
                                }
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </>
        )
    } else {
        return (<></>)
    }

}

export default Header;