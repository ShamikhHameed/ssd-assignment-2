import React, { useState } from 'react';
import { SidebarData } from './SidebarData'
import { Redirect } from 'react-router-dom';
import SubMenu from './SubMenu';
import authService from '../Services/AuthService';
import '../App.css'

function Sidebar({ authorized }) {
    const [subnav, setSubnav] = useState(false);
    const showSubnav = () => setSubnav(!subnav);
    const user = authService.getCurrentUser();
    const [userType, setUserType] = useState("");

    if (!authorized) {
        return <Redirect to="/login" />
    }

    return (
        <div>
            <div className="Sidebar">
                {SidebarData.map((val, index) => {
                    return val.role.map((roleVar, roleIndex) => (
                        <div key={roleIndex}>
                            {roleVar === user.roles[0] && <SubMenu val={val} key={index} /> }
                        </div>
                    ))
                })}
            </div>
        </div>
    )
}
 
export default Sidebar;