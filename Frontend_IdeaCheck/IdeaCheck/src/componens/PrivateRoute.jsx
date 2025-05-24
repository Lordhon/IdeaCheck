import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';



function isTokenValid(token) {
    if (!token) return false;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        return payload.exp && payload.exp > currentTime;
    } catch (e) {
        return false;
    }
}
const PrivateRoute = () => {

    const token = localStorage.getItem("token");
    if (!isTokenValid(token)) {
        return <Navigate to="/login" replace />;
    }
    return <Outlet />;

}


export default PrivateRoute;
