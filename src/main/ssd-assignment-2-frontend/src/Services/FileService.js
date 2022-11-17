import axios from 'axios';
import { properties } from '../properties'

const API_URL_BASE = properties.apiUrl;
const API_URL = API_URL_BASE + "/access/";

class FilesService {
    upload(userId, payload, encAesKey, onUploadProgress) {
        return axios.post(API_URL + "files", {
            userId,
            payload,
            encAesKey
        }, {
            onUploadProgress,
        });
    }

    // upload(file, onUploadProgress) {
    //     let formData = new FormData();
    //
    //     formData.append("file", file);
    //
    //     return axios.post(API_URL + "files", formData, {
    //         headers: {
    //             "Content-Type": "multipart/form-data",
    //           },
    //           onUploadProgress,
    //     });
    // }
}

export default new FilesService();