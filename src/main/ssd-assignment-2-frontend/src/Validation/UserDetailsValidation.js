export default function validateInfo(values) {
    let userErrors = {};

    if(values.phone.length >= 1 && values.phone.length < 10) {
        userErrors.phone = "Phone number must be 10 digits";
    }

    return userErrors;
}