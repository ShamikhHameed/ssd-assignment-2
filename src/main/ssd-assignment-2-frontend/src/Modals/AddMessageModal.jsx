import React, {
  Component,
  useRef,
  useEffect,
  useCallback,
  useState,
} from "react";
import { useSpring, animated } from "react-spring";
import styled from "styled-components";
import CloseIcon from "@material-ui/icons/Close";
import MessageService from "../Services/MsgService";
import FlashMessage from "../Components/FlashMessage";
import validateInfo from "../Validation/MessageValidation";
import "../App.css";
import MsgService from "../Services/MsgService";

const Background = styled.div`
  width: 200%;
  height: 200%;
  background: rgba(0, 0, 0, 0.8);
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalWrapper = styled.div`
  width: 500px;
  height: 660px;
  box-shadow: 0 5px 16px rgba(0, 0, 0, 0.2);
  background: #fff;
  color: #000;
  display: grid;
  grid-template-columns: 1fr;
  position: relative;
  z-index: 99999;
  border-radius: 10px;
  margin-right: 18vw;
  margin-bottom: 15vh;
`;

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
`;

const CloseModalButton = styled(CloseIcon)`
  cursor: pointer;
  position: absolute;
  top: 20px;
  right: 20px;
  width: 32px;
  height: 32px;
  padding: 0;
  z-index: 99999;
`;

export const AddMessageModal = ({ showModal, setShowModal }) => {
  const modalRef = useRef();
  const [msg, setMsg] = useState("");
  const [message, setMessage] = useState("");
  const [snackbarSuccess, setSnackbarSuccess] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState("");

  const onChangeMsg = (e) => {
    setMsg(e.target.value);
  };

  const [values, setValues] = useState({
    msg: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    setValues({
      ...values,
      msg: msg,
    });

    setErrors(validateInfo(values));
    setIsSubmitting(true);

    if (Object.keys(errors).length === 0 && isSubmitting) {
      MsgService.addMsg(msg).then(
        () => {
          setShowModal(false);
          setSnackbarMessage("Message added Successfully");
          setSnackbarType("success");
          setSnackbarSuccess(true);
          setValues({
            ...values,
            msg: "",
          });
        },
        (error) => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          setSnackbarMessage("ERROR: Unable to add message. " + resMessage);
          setSnackbarType("error");
          setSnackbarSuccess(true);
        }
      );
      setSnackbarSuccess(false);
    }
  };

  const animation = useSpring({
    config: {
      duration: 250,
    },
    opacity: showModal ? 1 : 0,
    transform: showModal ? "translateY(0%)" : "translateY(-100%)",
  });

  const closeModal = (e) => {
    if (modalRef.current === e.target) {
      setShowModal(false);
    }
  };

  const keyPress = useCallback(
    (e) => {
      if (e.key === "Escape" && showModal) {
        setShowModal(false);
      }
    },
    [setShowModal, showModal]
  );

  useEffect(() => {
    document.addEventListener("keydown", keyPress);
    return () => document.removeEventListener("keydown", keyPress);
  }, [keyPress]);

  return (
    <>
      {showModal ? (
        <Background ref={modalRef} onClick={closeModal}>
          <animated.div style={animation}>
            <ModalWrapper showModal={showModal}>
              <ModalContent>
                <form className="form" onSubmit={handleSubmit}>
                  <h2>Add a New Message</h2>
                  <div className="form-inputs">
                    <label htmlFor="name" className="form-label">
                      Message
                    </label>
                    <input
                      type="text"
                      name="name"
                      className="form-input"
                      placeholder="Hello there..."
                      defaultValue={values.msg}
                      onChange={onChangeMsg}
                    />
                    <div className="form-error">
                      {errors.msg && <span>{errors.msg}</span>}
                    </div>
                  </div>
                  <button
                    className="form-input-btn"
                    type="submit"
                    onClick={handleSubmit}
                  >
                    Add Message
                  </button>
                </form>
              </ModalContent>
              <CloseModalButton onClick={() => setShowModal((prev) => !prev)} />
            </ModalWrapper>
          </animated.div>
        </Background>
      ) : null}

      {snackbarSuccess ? (
        <FlashMessage message={snackbarMessage} type={snackbarType} />
      ) : (
        ""
      )}
    </>
  );
};
