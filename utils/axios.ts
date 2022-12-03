import Axios from 'axios'
import * as https from "https";

const axios = Axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: true,
    httpsAgent: new https.Agent({
        rejectUnauthorized: false,
    })
})

export default axios