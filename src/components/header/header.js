import { useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { NavLink, useLocation } from 'react-router-dom';

const Header = (props) => {
    let location = useLocation()
    let checkPath = true;

    if (location.pathname !== '/login' && location.pathname !== '/register') {
        return (
            <>
                <Navbar bg="light" expand="lg">
                    <Container>
                        <NavLink to='/' className='nav-link'>Quiz App</NavLink>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="me-auto">
                                <NavDropdown title="User" id="basic-nav-dropdown">
                                    <NavDropdown.Item ><NavLink to='/add-user' className='nav-link'>Create a User</NavLink></NavDropdown.Item>
                                    <NavDropdown.Item><NavLink to='/users' className='nav-link'>All User</NavLink></NavDropdown.Item>
                                    <NavDropdown.Item><NavLink to='/quiz-user' className='nav-link'>Add a Quiz for User</NavLink></NavDropdown.Item>
                                </NavDropdown>
                                <NavDropdown title="Quiz" id="basic-nav-dropdown">
                                    <NavDropdown.Item ><NavLink to='/add-quiz' className='nav-link'>Create a Quiz</NavLink></NavDropdown.Item>
                                    <NavDropdown.Item><NavLink to='/quizzes' className='nav-link'>All Quiz</NavLink></NavDropdown.Item>
                                    <NavDropdown.Item><NavLink to='/upsert-quiz' className='nav-link'>Upsert Quiz</NavLink></NavDropdown.Item>
                                </NavDropdown>
                            </Nav>
                            <Nav>
                                <NavLink to='/exams' className='nav-link'>Go to exams</NavLink>
                                <NavLink to='/login' className='nav-link'>Login</NavLink>
                                <NavLink to='/register' className='nav-link'>Register</NavLink>
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