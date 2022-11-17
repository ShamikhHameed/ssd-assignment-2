import axios from 'axios';
import { properties } from '../properties'

const API_URL_BASE = properties.apiUrl;
const API_URL = API_URL_BASE + "/access/";

class MsgService {
    addMsg(userId, payload, encAesKey) {
        return axios.post(API_URL + "messages", {
            userId,
            payload,
            encAesKey
        });
    }
}

export default new MsgService();