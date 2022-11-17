export default function validateInfo(values) {
    let errors = {};

    if(!values.currentPassword) {
        errors.currentPassword = "Current password required";
    } else if(values.currentPassword.length < 8) {
        errors.password = "Password needs to be 8 characters or more";
    }

    if(!values.newPassword) {
        errors.newPassword = "New password required";
    } else if(values.newPassword.length < 8) {
        errors.newPassword = "New password needs to be 8 characters or more";
    }

    if(!values.confirmNewPassword) {
        errors.confirmNewPassword = "Confirm password required";
    } else if(values.confirmNewPassword != values.newPassword) {
        errors.confirmNewPassword = "Confirm passwords do not match New password";
    }

    return errors;
}