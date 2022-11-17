import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const SidebarLink = styled(Link)`
    display: flex;
    color: white;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    list-style: none;
    height: 50px;
    text-decoration: none;
    font-size: 18px;

    &:hover {
        background: #252831;
        border-left: 4px solid #0676ED;
        text-decoration: none;
        color: white;
        cursor: pointer;
    }

    &:focus {
        background: #252831;
        border-left: 4px solid #0676ED;
        text-decoration: none;
        color: white;
        cursor: pointer;
    }
`;

const SidebarLabel = styled.span`
    margin-left: 16px;
`;

const DropdownLink = styled(Link)`
    background: #414757;
    height: 50px;
    padding-left: 3rem;
    display: flex;
    align-items: center;
    text-decoration: none;
    color: white;
    font-size: 18px;

    &:hover {
        background: #0676ED;
        color: white;
        border-left: 4px solid white;
        text-decoration: none;
        cursor: pointer;
    }

    &:focus {
        background: #0676ED;
        color: white;
        border-left: 4px solid white;
        text-decoration: none;
        cursor: pointer;
    }
`;

const SubMenu = ({ val }) => {
    const [subnav, setSubnav] = useState(false);
    const showSubnav = () => setSubnav(!subnav);

    return (
        <>
            <SidebarLink to={val.path} onClick={val.subNav && showSubnav}>
                <div>
                    {val.icon}
                    <SidebarLabel>
                        {val.title}
                    </SidebarLabel>
                </div>
                <div>
                    {val.subNav && subnav 
                        ? val.iconOpen
                        : val.subNav
                        ? val.iconClosed
                        : null
                    }
                </div>
            </SidebarLink>
            {subnav && val.subNav.map((val, index) => {
                return (
                    <DropdownLink to={val.path} key={index}>
                        {val.icon}
                        <SidebarLabel>{val.title}</SidebarLabel>
                    </DropdownLink>
                )
            })}
        </>
    )
}

export default SubMenu;