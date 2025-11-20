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

}
)

export default api;