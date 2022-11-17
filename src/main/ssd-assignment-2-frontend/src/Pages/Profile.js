import React, { useState, useEffect } from 'react'
import authService from '../Services/AuthService';
import FlashMessage from '../Components/FlashMessage';
import validateInfo from '../Validation/UserDetailsValidation';
import validatePasswordInfo from '../Validation/ChangePasswordValidation';

function Profile() {
    const user = authService.getCurrentUser();
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [snackbarSuccess, setSnackbarSuccess] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarType, setSnackbarType] = useState("");

    const onChangeCurrentPassword = e => {
        setCurrentPassword(e.target.value);
    }

    const onChangeNewPassword = e => {
        setNewPassword(e.target.value);
    }

    const onChangeConfirmNewPassword = e => {
        setConfirmNewPassword(e.target.value);
    }

    const onChangeFirstName = e => {
        setFirstName(e.target.value);
    }

    const onChangeLastName = e => {
        setLastName(e.target.value);
    }

    const onChangeAddress = e => {
        setAddress(e.target.value);
    }

    const onChangePhone = e => {
        if(/^\d{10}$/.test(e.target.value)){
            setPhone(e.target.value);
        }
    }

    const [values, setValues] = useState({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: ""
    })

    const [userValues, setUserValues] = useState({
        firstName: "",
        lastName: "",
        address: "",
        phone: ""
    })

    const [errors, setErrors] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [userErrors, setUserErrors] = useState({})
    const [isSubmittingUser, setIsSubmittingUser] = useState(false)

    useEffect(() => {
        if(user != null){
            console.log(user.firstName + ' ' + user.phone)
            // setValues({
            //     ...values,
            //     firstName: user.firstName != null ? user.firstName : '',
            //     lastName: user.lastName != null ? user.lastName : '',
            //     address: user.address != null ? user.address : '',
            //     phone: user.phone != null ? user.phone : ''
            // })
        }
    }, [user])

    const handleSubmit = e => {
        e.preventDefault();

        setValues({
            ...values,
            currentPassword: currentPassword,
            newPassword: newPassword,
            confirmNewPassword: confirmNewPassword
        })

        setErrors(validatePasswordInfo(values));
        setIsSubmitting(true);

        if(Object.keys(errors).length === 0 && isSubmitting && user != null) {
            authService.changePassword(user.username, currentPassword, newPassword)
        .then( () => 
            {
            setSnackbarMessage("Password changed Successfully");
            setSnackbarType("success");
            setSnackbarSuccess(true);
            setValues({
                ...values,
                currentPassword: "",
                newPassword: "",
                confirmNewPassword: ""
            })
        },
        error => {
            const resMessage =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            setSnackbarMessage("ERROR: Unable to change password. " + resMessage);
            setSnackbarType("error");
            setSnackbarSuccess(true);
        }
    );
    setSnackbarSuccess(false);
    }
    }

    const handleUserDetails = e => {
        e.preventDefault();

        setUserValues({
            ...userValues,
            firstName: firstName,
            lastName: lastName,
            address: address,
            phone: phone
        })

        setUserErrors(validateInfo(userValues));
        setIsSubmittingUser(true);

        if(Object.keys(errors).length === 0 && isSubmittingUser && user != null) {
            authService.updateUserDetails(user.id, firstName, lastName, address, phone)
        .then( () => 
            {
            setSnackbarMessage("User details updated Successfully");
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
            setSnackbarMessage("ERROR: Unable to update user details. " + resMessage);
            setSnackbarType("error");
            setSnackbarSuccess(true);
        }
    );
    setSnackbarSuccess(false);
    }
    }

    return (
        <div className="BodyWindow">
            <div className="UserDetails">
                <form className="form">
                    <h3>
                        User Details
                    </h3>
                    <div className="form-inputs" style={{ display: 'flex' }}>
                        <div style={{ width: '60%' }}>
                        <label htmlFor="username"
                            className="ProfileFormLabel"
                        >
                            User ID
                        </label>
                        <input 
                            type="text"
                            name="username"
                            className="ProfileFormInput"
                            defaultValue={user != null && user.id}
                            readOnly='true'
                            // onChange={onChangeUsername}
                            />
                            {/* <div className="form-error">
                            {errors.username && <span>{errors.username}</span>}
                            </div> */}
                        </div>
                        <div style={{ width: '40%', marginLeft:'3%' }}>
                        <label htmlFor="email"
                            className="ProfileFormLabel"
                        >
                            Role
                        </label>
                        <input 
                            type="email"
                            name="email"
                            className="ProfileFormInput"
                            defaultValue={user != null && user.roles[0]}
                            readOnly='true'
                            // onChange={onChangeEmail}
                            />
                            {/* <div className="form-error">
                            {errors.email && <span>{errors.email}</span>}
                            </div> */}
                        </div>
                    </div>
                    <div className="form-inputs">
                        <label htmlFor="username"
                            className="ProfileFormLabel"
                        >
                            Username
                        </label>
                        <input 
                            type="text"
                            name="username"
                            className="ProfileFormInput"
                            defaultValue={user != null && user.username}
                            readOnly='true'
                            // onChange={onChangeUsername}
                            />
                            {/* <div className="form-error">
                            {errors.username && <span>{errors.username}</span>}
                            </div> */}
                    </div>
                    <div className="form-inputs">
                        <label htmlFor="email"
                            className="ProfileFormLabel"
                        >
                            Email
                        </label>
                        <input 
                            type="email"
                            name="email"
                            className="ProfileFormInput"
                            defaultValue={user != null && user.email}
                            readOnly='true'
                            // onChange={onChangeEmail}
                            />
                            {/* <div className="form-error">
                            {errors.email && <span>{errors.email}</span>}
                            </div> */}
                    </div>
                    <div className="form-inputs" style={{ display: 'flex' }}>
                        <div style={{ width: '50%' }}>
                        <label htmlFor="firstName"
                            className="ProfileFormLabel"
                        >
                            First Name
                        </label>
                        <input 
                            type="text"
                            name="firstName"
                            className="ProfileFormInput"
                            placeholder="John"
                            defaultValue={userValues.firstName}
                            onChange={onChangeFirstName}
                        />
                        </div>
                        <div style={{ width: '50%', marginLeft:'3%' }}>
                        <label htmlFor="lastName"
                            className="ProfileFormLabel"
                        >
                            Last Name
                        </label>
                        <input 
                            type="text"
                            name="lastName"
                            className="ProfileFormInput"
                            placeholder="Doe"
                            defaultValue={userValues.lastName}
                            onChange={onChangeLastName}
                        />
                        </div>
                    </div>
                    <div className="form-inputs">
                        <label htmlFor="address"
                            className="ProfileFormLabel"
                        >
                            Address
                        </label>
                        <input 
                            type="text"
                            name="address"
                            className="ProfileFormInput"
                            placeholder="221/B Baker Street, London"
                            defaultValue={userValues.address}
                            onChange={onChangeAddress}
                            />
                    </div>
                    <div className="form-inputs">
                        <label htmlFor="phone"
                            className="ProfileFormLabel"
                        >
                            Phone
                        </label>
                        <input 
                            type="text"
                            name="phone"
                            className="ProfileFormInput"
                            placeholder='0775632945'
                            defaultValue={userValues.phone}
                            onChange={onChangePhone}
                            />
                            <div className="form-error">
                            {userErrors.phone && <span>{userErrors.phone}</span>}
                            </div>
                    </div>
                    <button className="BlueButton"
                        type="submit" onClick={handleUserDetails}
                    >
                        Update Profile
                    </button>
                </form>
            </div>
            <div className="ChangePassword">
            <form className="form">
                <h3>
                    Change Password
                </h3><br/>
                <div className="form-inputs">
                    <label htmlFor="password"
                        className="ProfileFormLabel"
                    >
                        Current Password
                    </label>
                    <input 
                        type="password"
                        name="password"
                        className="ProfileFormInput"
                        onChange={onChangeCurrentPassword}
                        />
                        <div className="form-error">
                            {errors.currentPassword && <span>{errors.currentPassword}</span>}
                        </div>
                </div>
                <div className="form-inputs">
                    <label htmlFor="password"
                        className="ProfileFormLabel"
                    >
                        New Password
                    </label>
                    <input 
                        type="password"
                        name="password"
                        className="ProfileFormInput"
                        onChange={onChangeNewPassword}
                        />
                        <div className="form-error">
                            {errors.newPassword && <span>{errors.newPassword}</span>}
                        </div>
                </div>
                <div className="form-inputs">
                    <label htmlFor="password"
                        className="ProfileFormLabel"
                    >
                        Confirm New Password
                    </label>
                    <input 
                        type="password"
                        name="password"
                        className="ProfileFormInput"
                        onChange={onChangeConfirmNewPassword}
                        />
                        <div className="form-error">
                            {errors.confirmNewPassword && <span>{errors.confirmNewPassword}</span>}
                        </div>
                </div>
                <button className="BlueButton"
                    type="submit" onClick={handleSubmit}
                >
                    Change Password
                </button>
            </form>
            </div>
            {
            snackbarSuccess ? <FlashMessage message={snackbarMessage} type={snackbarType} /> : ""
            }
        </div>
    )
}

export default Profile
