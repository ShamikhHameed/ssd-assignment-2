import React, { useState, useEffect } from 'react'
import { AddUserModal } from '../Modals/AddUserModal';
import { ConfirmUserDeleteModal } from '../Modals/ConfirmUserDeleteModal'
import { UpdateUserModal } from '../Modals/UpdateUserModal'
import userService from '../Services/UserService';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Avatar, Grid, TableFooter, TablePagination, Typography } from '@material-ui/core';
import FlashMessage from '../Components/FlashMessage';
import SearchIcon from '@material-ui/icons/Search';
import validateInfo from "../Validation/AddUserValidation";
import AuthService from "../Services/AuthService";

const useStyles = makeStyles((theme) => ({
    table: {
      minWidth: 650,
    //   backgroundColor: '#292e41'
    },
    TableContainer: {
        // borderRadius: 15
    },
    TableHeaderCell: {
        fontWeight: 'bold',
        // backgroundColor: '#0676ED',
        backgroundColor: '#192435',
        color: 'white',
        paddingLeft: '60px'
    },
    Avatar: {
        backgroundColor: theme.palette.primary.light,
        color: theme.palette.getContrastText(theme.palette.primary.light)
    },
    Username: {
        paddingTop: '8px'
    }
  }));

function Users() {
    const [content, setContent] = useState("");
    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
    const [showUpdateUserModal, setShowUpdateUserModal] = useState(false);
    const [users, setUsers] = useState([]);
    const [snackbarSuccess, setSnackbarSuccess] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarType, setSnackbarType] = useState("");
    const [deleteUserId, setdeleteUserId] = useState("");
    const [userDetails, setUserDetails] = useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [searchTerm, setSearchTerm] = useState("");

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState(["admin"]);

    const [values, setValues] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: []
    })

    const [errors, setErrors] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    const user = AuthService.getCurrentUser();

    const onChangeUsername = e => {
        setUsername(e.target.value);
    }

    const onChangeEmail = e => {
        setEmail(e.target.value);
    }

    const onChangePassword = e => {
        setPassword(e.target.value);
    }

    const onChangeConfirmPassword = e => {
        setConfirmPassword(e.target.value);
    }

    const onChangeRole = e => {
        setRole([e.target.value]);
    }

    const openAddUserModal = () => {
        setShowAddUserModal(prev => !prev)
    }

    const openConfirmDeleteModal = () => {
        setShowConfirmDeleteModal(prev => !prev)
    }

    const openUpdateUserModal = () => {
        setShowUpdateUserModal(prev => !prev)
    }

    const handleDelete = id => {
        setdeleteUserId(id);
        openConfirmDeleteModal();
    }

    const handleUpdate = async userDetails => {
        await setUserDetails(userDetails)
        await openUpdateUserModal();
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
      };
    
      const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
      };


    useEffect(() => {
        userService.getUsersList().then(
            response => {
                setUsers(Object.values(response.data));
            },
            error => {
                console.log(
                    (error.response && error.response.data) ||
                    error.message ||
                    error.toString())
            }
        );
    })

    const handleSubmit = e => {
        e.preventDefault();

        setValues({
            ...values,
            username: username,
            email: email,
            password: password,
            confirmPassword: confirmPassword,
            role: [role]
        })

        setErrors(validateInfo(values));
        setIsSubmitting(true);

        if(Object.keys(errors).length === 0 && isSubmitting && user != null) {
            AuthService.register(username, email, role, password, user.username)
                .then(
                    () => {
                        // setShowModal(false);
                        setSnackbarMessage("User added Successfully");
                        setSnackbarType("success");
                        setSnackbarSuccess(true);
                        setValues({
                            ...values,
                            username: "",
                            email: "",
                            password: "",
                            confirmPassword: "",
                            role: ["admin"]
                        })
                    },
                    error => {
                        const resMessage =
                            (error.response &&
                                error.response.data &&
                                error.response.data.message) ||
                            error.message ||
                            error.toString();
                        setSnackbarMessage("ERROR: Unable to add user. " + resMessage);
                        setSnackbarType("error");
                        setSnackbarSuccess(true);
                    }
                );
            setSnackbarSuccess(false);
        }
    }

    const classes = useStyles();

    return (
        <div className="BodyWindow">
            <div className="BodyWindowBottom">
                <form className="form" onSubmit={handleSubmit}>
                    <h2>
                        Add a New User
                    </h2>
                    <div className="form-inputs">
                        <label htmlFor="username"
                               className="form-label"
                               style={{color:"white"}}
                        >
                            Username
                        </label>
                        <input
                            type="text"
                            name="username"
                            className="form-input"
                            placeholder="JohnDoe"
                            defaultValue={values.username}
                            onChange={onChangeUsername}
                        />
                        <div className="form-error">
                            {errors.username && <span>{errors.username}</span>}
                        </div>
                    </div>
                    <div className="form-inputs">
                        <label htmlFor="email"
                               className="form-label"
                               style={{color:"white"}}
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            className="form-input"
                            placeholder="johndoe@gmail.com"
                            defaultValue={values.email}
                            onChange={onChangeEmail}
                        />
                        <div className="form-error">
                            {errors.email && <span>{errors.email}</span>}
                        </div>
                    </div>
                    <div className="form-inputs">
                        <label htmlFor="password"
                               className="form-label"
                               style={{color:"white"}}
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            className="form-input"
                            defaultValue={values.password}
                            onChange={onChangePassword}
                        />
                        <div className="form-error">
                            {errors.password && <span>{errors.password}</span>}
                        </div>
                    </div>
                    <div className="form-inputs">
                        <label htmlFor="password2"
                               className="form-label"
                               style={{color:"white"}}
                        >
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            className="form-input"
                            defaultValue={values.confirmPassword}
                            onChange={onChangeConfirmPassword}
                        />
                        <div className="form-error">
                            {errors.confirmPassword && <span>{errors.confirmPassword}</span>}
                        </div>
                    </div>
                    <div className="form-inputs"
                         onClick={onChangeRole}
                    >
                        <label
                            className="form-label"
                            style={{color:"white"}}
                        >
                            Choose User Type
                        </label>
                        <table>
                            <tr>
                                <td>
                                    <input id="admin" type="radio" value="admin" name="userType" defaultChecked/>
                                </td>
                                <td className="radioLabel">
                                    <label htmlFor="admin"> Admin</label>
                                </td>

                                <td>
                                    <input id="manager" type="radio" value="manager" name="userType"/>
                                </td>
                                <td className="radioLabel">
                                    <label htmlFor="manager"> Manager</label>
                                </td>

                                <td>
                                    <input id="worker" type="radio" value="worker" name="userType"/>
                                </td>
                                <td className="radioLabel">
                                    <label htmlFor="worker"> Worker</label>
                                </td>
                            </tr>
                        </table>
                        <div className="form-error">
                            {errors.role && <span>{errors.role}</span>}
                        </div>
                    </div>
                    <button className="form-input-btn"
                            type="submit" onClick={handleSubmit}
                    >
                        Add User
                    </button>
                </form>
            </div>
            <AddUserModal showModal={showAddUserModal} setShowModal={setShowAddUserModal} />
            <UpdateUserModal showModal={showUpdateUserModal} setShowModal={setShowUpdateUserModal} userDetails={userDetails} />
            <ConfirmUserDeleteModal showModal={showConfirmDeleteModal} setShowModal={setShowConfirmDeleteModal} id={deleteUserId} />
            {
            snackbarSuccess ? <FlashMessage message={snackbarMessage} type={snackbarType} /> : ""
            }
        </div>
    )
}

export default Users
