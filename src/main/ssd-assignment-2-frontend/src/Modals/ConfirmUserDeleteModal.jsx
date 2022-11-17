import React, { Component, useRef, useEffect, useCallback, useState } from 'react'
import { useSpring, animated } from 'react-spring';
import styled from 'styled-components'
import CloseIcon from '@material-ui/icons/Close';
import AuthService from '../Services/AuthService';
import FlashMessage from '../Components/FlashMessage';
import UserService from '../Services/UserService';
import '../App.css'
import DeleteIcon from '@material-ui/icons/HighlightOff';

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
    height: 400px;
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
    padding-left: 40px;
    padding-right: 40px;

    p {
        margin-bottom: 1rem;
    }

    h3 {
        margin-bottom: 18px
    }

    h7 {
        text-align: center;
        margin-bottom: 18px
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

const CancelButton = styled.button`
    background-color: #c1c1c1;
    margin-right: 5px;
    padding: 10px 24px;
    color: #fff;
    border: none;
    border-radius: 3px;
    padding-left: 40px;
    padding-right: 40px;

    &:hover {
        background-color: #6c757d;
        cursor: pointer;
    }

    &:focus {
        outline: none;
    }
`

const DeleteButton = styled.button`
    margin-left: 5px;
    background-color: #f15e5e;
    padding: 10px 24px;
    color: #fff;
    border: none;
    border-radius: 3px;
    padding-left: 40px;
    padding-right: 40px;

    &:hover {
        background-color: #dc3545;
        cursor: pointer;
    }

    &:focus {
        outline: none;
    }
`

export const ConfirmUserDeleteModal = ({ showModal, setShowModal, id }) => {
    const modalRef = useRef()
    const [snackbarSuccess, setSnackbarSuccess] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarType, setSnackbarType] = useState("");

    const handleDelete = e => {
        e.preventDefault();

        UserService.deleteUser(id)
        .then(
        () => {
            setShowModal(false);
            setSnackbarMessage("User deleted Successfully");
            setSnackbarType("success");
            setSnackbarSuccess(true);
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
                        <div className="deleteIcon">
                            <DeleteIcon />
                        </div>
                        <h3>
                            Are you sure?
                        </h3>
                        <h7>
                            Do you really want to delete this record? This process cannot be undone.
                        </h7>
                        <div>
                            <CancelButton onClick={() => setShowModal(prev => !prev)}>
                                Cancel
                            </CancelButton>
                            <DeleteButton onClick={handleDelete}>
                                Delete
                            </DeleteButton>
                        </div>
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