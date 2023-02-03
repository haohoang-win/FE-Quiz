import React from 'react';
import { useSelector } from 'react-redux';
import Alert from 'react-bootstrap/Alert';

const PrivateRoutes = (props) => {
    const user = useSelector(state => state.user)
    const { permission } = props.permission;
    const allRole = ['MANAGER', 'TEACHER', "STUDENT"];
    let indexUser = user.account.role ? allRole.findIndex(() => user.account.role === allRole) : null
    let indexPermission = permission ? allRole.findIndex(() => permission === allRole) : null
    let allowAcces = false
    if (indexUser && indexPermission && indexUser <= indexPermission) {
        allowAcces = true
    }

    if ((!user || user.isAuthenticated === false || !allowAcces) && permission === user.account.role) {
        return (
            <>
                <Alert variant="danger" className='mt-3'>
                    <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
                    <p>
                        You don't have permission to acces this route.
                    </p>
                </Alert>
            </>
        )
    } else {
        return (
            <>
                {props.children}
            </>
        )
    }
}

export default PrivateRoutes;