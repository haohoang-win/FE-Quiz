import { Route } from 'react-router-dom';
import React from 'react';

const PrivateRoutes = (props) => {

    return (
        <>
            <Route path={props.path} component={props.component} />
        </>
    )

    // if (user && user.isAuthenticated === true) {
    //     return (
    //         <>
    //             <Route path={props.path} component={props.component} />
    //         </>
    //     )
    // } else {
    //     return (
    //         <Redirect to='/login'></Redirect>
    //     )
    // }
}

export default PrivateRoutes;