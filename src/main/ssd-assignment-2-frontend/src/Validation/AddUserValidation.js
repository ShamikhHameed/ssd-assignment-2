export default function validateInfo(values) {
    let errors = {};

    if(!values.username.trim()) {
        errors.username = "Username required";
    }

    if(!values.email) {
        errors.email = "Email required";
    } else if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
        errors.email = "Email address is invalid";
    }

    if(!values.password) {
        errors.password = "Password required";
    } else if(values.password.length < 8) {
        errors.password = "Password needs to be 8 characters or more";
    }

    if(!values.confirmPassword) {
        errors.confirmPassword = "Password required";
    } else if(values.confirmPassword != values.password) {
        errors.confirmPassword = "Passwords do not match";
    }

    if(!values.role[0]) {
        errors.role = "User role required";
    }

    return errors;
}