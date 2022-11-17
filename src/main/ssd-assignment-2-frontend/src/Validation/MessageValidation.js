export default function validateInfo(values) {
    let errors = {};

    if(!values.msg.trim()) {
        errors.msg = "Message name required";
    }

    return errors;
}