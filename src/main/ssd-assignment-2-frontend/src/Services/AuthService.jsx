import axios from "axios";
import { Redirect } from 'react-router-dom';
import { properties } from '../properties'

const API_URL_BASE = properties.apiUrl;
// const API_URL = "http://localhost:8080/api/auth/";
const API_URL = API_URL_BASE + "/auth/";
// const API_URL = "http://localhost:9001/auth/";

class AuthService {
    login(username, password) {
        return axios.post(API_URL + "signin", {
                username,
                password
            }).then(response => {
                if (response.data.token) {
                    localStorage.setItem("user", JSON.stringify(response.data));
                }
                
                return response.data;
            });
    }

    register(username, email, roles, password, createdBy) {
        return axios.post(API_URL + "signup", {
            username,
            email,
            roles,
            password,
            createdBy
        });
    }

    changePassword(username, currentPassword, newPassword) {
        return axios.put(API_URL + "password/change", {
            username,
            currentPassword,
            newPassword
        });
    }

    updateUserDetails(id, firstName, lastName, address, phone) {
        return axios.put(API_URL + "users/" + id, {
            firstName, 
            lastName, 
            address, 
            phone
        });
    }

    logout() {
        localStorage.removeItem("user");
        return <Redirect to="/login" />
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem("user"));
    }
}

export default new AuthService();