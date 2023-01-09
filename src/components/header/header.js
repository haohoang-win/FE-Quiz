import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { NavLink } from 'react-router-dom';

const Header = (props) => {

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
                            {/* <NavDropdown title="Setting" id="basic-nav-dropdown">
                                <NavDropdown.Item>Logout</NavDropdown.Item>
                            </NavDropdown>
                            <NavLink to='/admins' className='nav-link'>{t('header.admin')}</NavLink> */}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    )
}

export default Header;