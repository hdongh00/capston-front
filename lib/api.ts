import { Axios, AxiosResponse, InternalAxiosRequestConfig } from './../node_modules/axios/index.d';
import axios from "axios";
const api = axios.create({ baseURL: "http://localhost:8080" });

api.interceptors.request.use((config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
        config.headers.Authorization = localStorage.getItem('capstoneToken') || "";
        return config;
    }
)

api.interceptors.response.use((res: AxiosResponse) :AxiosResponse => res,
(err) => {
    console.log("에러다!",err);
    if(err.response.status===401){
        window.location.href = "/login";
    }
}
)

export default api;