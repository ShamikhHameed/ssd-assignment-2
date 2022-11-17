import React, { Component, useRef, useEffect, useCallback, useState } from 'react'
import { useSpring, animated } from 'react-spring';
import styled from 'styled-components'
import CloseIcon from '@material-ui/icons/Close';
import FileService from '../Services/FileService';
import FlashMessage from '../Components/FlashMessage';
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


export const AddFileModal = ({ showModal, setShowModal }) => {
    const modalRef = useRef()
    const [selectedFiles, setSelectedFiles] = useState(undefined);
    const [currentFile, setCurrentFile] = useState(undefined);
    const [progress, setProgress] = useState(0);
    const [msg, setMsg] = useState("");
    const [fileInfos, setFileInfos] = useState([]);
    const [message, setMessage] = useState("");
    const [snackbarSuccess, setSnackbarSuccess] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarType, setSnackbarType] = useState("");

    const onChangeselectedFiles = e => {
        setSelectedFiles(e.target.files);
    }

    const onChangeCurrentFile = e => {
        setCurrentFile(e.target.files);
    }

    const onChangeProgress = e => {
        setProgress(e.target.value);
    }

    const onChangeMsg = e => {
        setMsg(e.target.value);
    }

    const [errors, setErrors] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = e => {
        e.preventDefault();

        let currentFile = selectedFiles[0]

        setProgress(0)
        setCurrentFile(currentFile)

        FileService.upload(currentFile, (event) => {
            setProgress(Math.round((100 * event.loaded) / event.total))
          })
            .then((response) => {
                setShowModal(false);
                setSnackbarMessage("File added Successfully");
                setSnackbarType("success");
                setSnackbarSuccess(true);
            })
            .catch((error) => {
                const resMessage =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();
                setProgress(0)
                setMessage("Could not upload the file!")
                setCurrentFile(undefined)
                setSnackbarMessage("ERROR: Unable to add file. " + resMessage);
                setSnackbarType("error");
                setSnackbarSuccess(true);
            });

            setSelectedFiles(undefined)
            setSnackbarSuccess(false);

        setIsSubmitting(true);
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

                    <div>
                        {currentFile && (
                        <div className="progress">
                            <div
                            className="progress-bar progress-bar-info progress-bar-striped"
                            role="progressbar"
                            aria-valuenow={progress}
                            aria-valuemin="0"
                            aria-valuemax="100"
                            style={{ width: progress + "%" }}
                            >
                            {progress}%
                            </div>
                        </div>
                        )}

                        <label className="btn btn-default">
                        <input type="file" onChange={onChangeselectedFiles} />
                        </label>

                        <button className="btn btn-success"
                        disabled={!selectedFiles}
                        onClick={handleSubmit}
                        >
                        Upload
                        </button>

                        <div className="alert alert-light" role="alert">
                        {message}
                        </div>
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