import React, { Component, useRef, useEffect, useCallback, useState } from 'react'
import { useSpring, animated } from 'react-spring';
import styled from 'styled-components'
import CloseIcon from '@material-ui/icons/Close';
import AuthService from '../Services/AuthService';
import FlashMessage from '../Components/FlashMessage';
import validateInfo from '../Validation/AddUserValidation';
import '../App.css'

const Background = styled.div`
    width: 200%;
    height: 200%;
    background: rgba(0,0,0,0.8);
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
`

const ModalWrapper = styled.div`
    width: 500px;
    height: 660px;
    box-shadow: 0 5px 16px rgba(0,0,0,0.2);
    background: #fff;
    color: #000;
    display: grid;
    grid-template-columns: 1fr;
    position: relative;
    z-index: 99999;
    border-radius: 10px;
    margin-right: 18vw;
    margin-bottom: 15vh;
`

const ModalContent = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    line-height: 1.8;
    color: #141414;

    p {
        margin-bottom: 1rem;
    }

    button {
        padding: 10px 24px;
        background: #141414;
        color: #fff;
        border: none;
    }
`


const CloseModalButton = styled(CloseIcon)`
    cursor: pointer;
    position: absolute;
    top: 20px;
    right: 20px;
    width: 32px;
    height: 32px;
    padding: 0;
    z-index: 99999;
`


export const AddUserModal = ({ showModal, setShowModal }) => {
    const modalRef = useRef()
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState(["admin"]);
    const [message, setMessage] = useState("");
    const [snackbarSuccess, setSnackbarSuccess] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarType, setSnackbarType] = useState("");

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

    //validation start
    const [values, setValues] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: []
    })

    const [errors, setErrors] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)

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
            setShowModal(false);
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
    //validation end

    const animation = useSpring({
        config: {
            duration: 250
        },
        opacity: showModal ? 1 : 0,
        transform: showModal ? 'translateY(0%)' : 'translateY(-100%)'
    })

    const closeModal = e => {
        if(modalRef.current === e.target) {
            setShowModal(false);
        }
    }

    const keyPress = useCallback(
        e => {
            if(e.key === 'Escape' && showModal) {
                setShowModal(false);
            }
        },
        [setShowModal, showModal]
    );

    useEffect(
        () => {
            document.addEventListener('keydown', keyPress);
            return () => document.removeEventListener('keydown', keyPress);
        }, [keyPress]
    )

    return (
        <>
        {showModal ? (
            <Background ref={modalRef} onClick={closeModal}>
                <animated.div style={animation}>
                <ModalWrapper showModal={showModal}>
                    <ModalContent>
                        <form className="form" onSubmit={handleSubmit}>
                            <h2>
                                Add a New User
                            </h2>
                            <div className="form-inputs">
                                <label htmlFor="username"
                                    className="form-label"
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
                            <label className="form-label">
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

                    </ModalContent>
                    <CloseModalButton onClick={() => setShowModal(prev => !prev)} />
                </ModalWrapper>
                </animated.div>
            </Background>
        ) : null}

        {
            snackbarSuccess ? <FlashMessage message={snackbarMessage} type={snackbarType} /> : ""
        }
        </>
    )
}