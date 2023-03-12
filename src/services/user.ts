import axios, { AxiosPromise, AxiosRequestConfig } from "axios";
import Config from "./config";
import { UserResponse, UserCreatedResponse, UserListResponse } from "src/types";

export default class UserService {
    public static get(id: number): AxiosRequestConfig {
        let conf = Config.getInstance();
        let baseUrl: string = conf.baseUrl;
        let userUrl: string = conf.userUrl;
        return {
            baseURL: baseUrl,
            url: userUrl + `/${id}`,
            method: "get",
            headers: {
                "Accept": "application/json"
            }
        };
    }

    public static set(un: string): AxiosRequestConfig {
        let conf = Config.getInstance();
        let baseUrl: string = conf.baseUrl;
        let userUrl: string = conf.userUrl;

        let fd = new FormData();
        fd.append("name", un);
        return {
            baseURL: baseUrl,
            url: userUrl + "/new",
            method: "post",
            data: fd,
            headers: {
                "Accept": "application/json",
                "Content-Type": "multipart/form-data"
            }
        };
    }

    public static gets(limit: number, page: number): AxiosRequestConfig {
        let conf = Config.getInstance();
        let baseUrl: string = conf.baseUrl;
        let userUrl: string = conf.userUrl;
        return {
            baseURL: baseUrl,
            url: userUrl + `/${limit}/${page}`,
            method: "get",
            headers: {
                "Accept": "application/json"
            }
        };
    }
}
