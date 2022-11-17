import React, { useState, useEffect } from "react";
import { AddFileModal } from "../Modals/AddFileModal";
import FileService from "../Services/FileService";
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
import authService from "../Services/AuthService";
import UserService from "../Services/UserService";
import CryptoJS from "crypto-js";
import JSEncrypt from "jsencrypt";
import MsgService from "../Services/MsgService";

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

function Files() {
  const user = authService.getCurrentUser();

  const [showAddFileModal, setShowAddFileModal] = useState(false);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [showUpdateFileModal, setShowUpdateFileModal] = useState(false);
  const [files, setFiles] = useState([]);
  const [snackbarSuccess, setSnackbarSuccess] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState("");
  const [deleteFileId, setdeleteFileId] = useState("");
  const [fileDetails, setFileDetails] = useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedFiles, setSelectedFiles] = useState(undefined);
  const [currentFile, setCurrentFile] = useState(undefined);
  const [progress, setProgress] = useState(0);
  const [msg, setMsg] = useState("");
  const [fileInfos, setFileInfos] = useState([]);
  const [message, setMessage] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false)

  const onChangeselectedFiles = e => {
    setSelectedFiles(e.target.files);
  }

  const handleSubmit = e => {
    e.preventDefault();

    let currentFile = selectedFiles[0]

    setProgress(0)
    setCurrentFile(currentFile)

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
          var aesOptions = {mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7, iv: iv};
          var aesEncTrans = CryptoJS.AES.encrypt(JSON.stringify(currentFile), aesKey, aesOptions);

          //encrypt AES key with RSA public key
          var rsaEncrypt = new JSEncrypt();
          rsaEncrypt.setPublicKey(resUser.data.rsaPublicKey);
          var rsaEncryptedAesKey = rsaEncrypt.encrypt(aesEncTrans.key.toString());

          FileService.upload(user.id, aesEncTrans.toString(), rsaEncryptedAesKey, (event) => {
            setProgress(Math.round((100 * event.loaded) / event.total))
          })
              .then((response) => {
                // setShowModal(false);
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
            }
        );

    // FileService.upload(currentFile, (event) => {
    //   setProgress(Math.round((100 * event.loaded) / event.total))
    // })
    //     .then((response) => {
    //       // setShowModal(false);
    //       setSnackbarMessage("File added Successfully");
    //       setSnackbarType("success");
    //       setSnackbarSuccess(true);
    //     })
    //     .catch((error) => {
    //       const resMessage =
    //           (error.response &&
    //               error.response.data &&
    //               error.response.data.message) ||
    //           error.message ||
    //           error.toString();
    //       setProgress(0)
    //       setMessage("Could not upload the file!")
    //       setCurrentFile(undefined)
    //       setSnackbarMessage("ERROR: Unable to add file. " + resMessage);
    //       setSnackbarType("error");
    //       setSnackbarSuccess(true);
    //     });

    setSelectedFiles(undefined)
    setSnackbarSuccess(false);

    setIsSubmitting(true);
  }

  const openAddFileModal = () => {
    setShowAddFileModal((prev) => !prev);
  };

  const openConfirmDeleteModal = () => {
    setShowConfirmDeleteModal((prev) => !prev);
  };

  const openUpdateFileModal = () => {
    setShowUpdateFileModal((prev) => !prev);
  };

  const handleDelete = (id) => {
    setdeleteFileId(id);
    openConfirmDeleteModal();
  };

  const handleUpdate = async (fileDetails) => {
    await setFileDetails(fileDetails);
    await openUpdateFileModal();
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
        <div style={{position: "absolute", top: "40%", left: "35%"}}>
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
      </div>
      <AddFileModal
        showModal={showAddFileModal}
        setShowModal={setShowAddFileModal}
      />
      {snackbarSuccess ? (
        <FlashMessage message={snackbarMessage} type={snackbarType} />
      ) : (
        ""
      )}
    </div>
  );
}

export default Files;
