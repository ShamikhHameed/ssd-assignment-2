import React, { useState, useEffect } from "react";
import { AddMessageModal } from "../Modals/AddMessageModal";
import MessageService from "../Services/MsgService";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import {
  Avatar,
  Grid,
  TableFooter,
  TablePagination,
  Typography,
} from "@material-ui/core";
import FlashMessage from "../Components/FlashMessage";
import SearchIcon from "@material-ui/icons/Search";
import validateInfo from "../Validation/MessageValidation";
import MsgService from "../Services/MsgService";
import authService from "../Services/AuthService";
import UserService from "../Services/UserService";

import CryptoJS from 'crypto-js';
import JSEncrypt from 'jsencrypt';

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  TableContainer: {
    borderRadius: 15,
  },
  TableHeaderCell: {
    fontWeight: "bold",
    backgroundColor: "#192435",
    color: "white",
    paddingLeft: "60px",
  },
  Avatar: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.getContrastText(theme.palette.primary.light),
  },
  Username: {
    paddingTop: "8px",
  },
}));

function Messages() {
  const user = authService.getCurrentUser();

  const [showAddMessageModal, setShowAddMessageModal] = useState(false);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [showUpdateMessageModal, setShowUpdateMessageModal] = useState(false);
  const [messages, setMessages] = useState([]);
  const [snackbarSuccess, setSnackbarSuccess] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState("");
  const [deleteMessageId, setdeleteMessageId] = useState("");
  const [messageDetails, setMessageDetails] = useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [searchTerm, setSearchTerm] = useState("");

  const [msg, setMsg] = useState("");
  const [message, setMessage] = useState("");

  const onChangeMsg = (e) => {
    setMsg(e.target.value);
  };

  const [values, setValues] = useState({
    msg: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openAddMessageModal = () => {
    setShowAddMessageModal((prev) => !prev);
  };

  const openConfirmDeleteModal = () => {
    setShowConfirmDeleteModal((prev) => !prev);
  };

  const openUpdateMessageModal = () => {
    setShowUpdateMessageModal((prev) => !prev);
  };

  const handleDelete = (id) => {
    setdeleteMessageId(id);
    openConfirmDeleteModal();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setValues({
      ...values,
      msg: msg,
    });

    setErrors(validateInfo(values));
    setIsSubmitting(true);

    if (Object.keys(errors).length === 0 && isSubmitting) {
      UserService.getUsersPublicKey(user.id).then((resUser) => {
            // generate AES key
            var secretPhrase = CryptoJS.lib.WordArray.random(16);
            var salt = CryptoJS.lib.WordArray.random(128 / 8);
            //aes key 128 bits (16 bytes) long
            var aesKey = CryptoJS.PBKDF2(secretPhrase.toString(), salt, {
              keySize: 128 / 32
            });
            //initialization vector - 1st 16 chars of userId
            var iv = CryptoJS.enc.Utf8.parse(user.id.slice(0, 16));
            var aesOptions = { mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7, iv: iv };
            var aesEncTrans = CryptoJS.AES.encrypt(JSON.stringify(msg), aesKey, aesOptions);

            //encrypt AES key with RSA public key
            var rsaEncrypt = new JSEncrypt();
            rsaEncrypt.setPublicKey(resUser.data.rsaPublicKey);
            var rsaEncryptedAesKey = rsaEncrypt.encrypt(aesEncTrans.key.toString());

            MsgService.addMsg(user.id, aesEncTrans.toString(), rsaEncryptedAesKey).then(
                () => {
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
      );
    }
  };

  const handleUpdate = async (messageDetails) => {
    await setMessageDetails(messageDetails);
    await openUpdateMessageModal();
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const classes = useStyles();

  return (
    <div className="BodyWindow">
      <div className="BodyWindowBottom">
        <form className="form" onSubmit={handleSubmit}>
          <h2>Add a New Message</h2>
          <div className="form-inputs">
            <label htmlFor="name" className="form-label" style={{color: "white"}}>
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
      </div>
      <AddMessageModal
        showModal={showAddMessageModal}
        setShowModal={setShowAddMessageModal}
      />
      {snackbarSuccess ? (
        <FlashMessage message={snackbarMessage} type={snackbarType} />
      ) : (
        ""
      )}
    </div>
  );
}

export default Messages;
