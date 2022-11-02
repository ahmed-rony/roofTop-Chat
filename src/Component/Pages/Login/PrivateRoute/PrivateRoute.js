import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../../../Hook_Context/useAuth';

const PrivateRoute = ({children, ...rest}) => {
    const [currentUser, setCurrentUser] = useAuth();
    const location = useLocation();

    return (
        (currentUser.email  || sessionStorage.getItem('token'))
        ? <Outlet />
        : <Navigate to='/login' state={{ from : location }} replace />
    );
};

export default PrivateRoute;