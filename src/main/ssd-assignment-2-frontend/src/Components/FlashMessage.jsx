import React, { useState } from 'react'
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

const FlashMessage = ({ message, type }) => {
    const [open, setOpen] = React.useState(true);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
        return;
        }

        setOpen(false);
    };

    return(
        <div className="">
            <Snackbar 
                open={open} 
                autoHideDuration={6000} 
                onClose={handleClose} 
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert severity={type}>
                    {message}
                </Alert>
            </Snackbar>
        </div>
    )
}

export default FlashMessage;