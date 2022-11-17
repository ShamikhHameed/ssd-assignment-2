import React from 'react';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import MessageIcon from '@material-ui/icons/Message';
import FileIcon from '@material-ui/icons/FileCopy';
import PersonIcon from '@material-ui/icons/Person';

export const SidebarData = [
    {
        title: "Users",
        icon: <PeopleAltIcon />,
        path: "/users",
        role: ["ROLE_ADMIN"]
    },
    {
        title: "Messages",
        icon: <MessageIcon />,
        path: "/messages",
        role: ["ROLE_ADMIN", "ROLE_MANAGER", "ROLE_WORKER"]
    },
    {
        title: "Files",
        icon: <FileIcon />,
        path: "/files",
        role: ["ROLE_ADMIN", "ROLE_MANAGER"]
    },
    {
        title: "Profile",
        icon: <PersonIcon />,
        path: "/profile",
        role: ["ROLE_ADMIN", "ROLE_MANAGER", "ROLE_WORKER"]
    }
]