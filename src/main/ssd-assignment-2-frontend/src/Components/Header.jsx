import React, { Component } from 'react';
import authService from '../Services/AuthService';
import { Redirect } from 'react-router-dom';

function Header({ authorized }) {
    const user = authService.getCurrentUser();

    if (!authorized) {
        return <Redirect to="/login" />
    }

    const logOut = () => {
        authService.logout();
        window.location.reload();
    };

    return (
        <div className="Header">
            <div className="HeaderLeft">
                SSD DATA STORAGE
                {/* <img className="logo" src="logoHOAD.png"/> */}
            </div>
            <div className="HeaderRight">
                <p>
                    @{user != null && user.username}
                </p>
                <div>
                    {user != null && user.roles[0] === "ROLE_ADMIN" && <p>Admin</p>}
                    {user != null && user.roles[0] === "ROLE_MANAGER" && <p>Manager</p>}
                    {user != null && user.roles[0] === "ROLE_WORKER" && <p>Worker</p>}
                </div>
                <button 
                    onClick={logOut}
                >
                    LOG OUT
                </button>
            </div>
        </div>
    )
}

export default Header;