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

    if(!values.role[0]) {
        errors.role = "User role required";
    }

    return errors;
}