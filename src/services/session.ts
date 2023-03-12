import axios, { AxiosPromise, AxiosRequestConfig } from "axios";

import Config from "src/services/config";
import { SessionCreatedResponse } from "src/types";

export default class SessionService {
    public static get(id: number): AxiosRequestConfig {
        let conf = Config.getInstance();
        let data = {
            "user_id": id
        };
        return {
            baseURL: conf.baseUrl,
            url: conf.sessionUrl + "/current",
            data: data,
            method: "get"
        };
    }

    public static set(uid: number, pid: number, mid: number): AxiosRequestConfig {
        let conf = Config.getInstance();
        let data = new FormData();
        data.set("user_id", uid.toString());
        data.set("petrinet_id", pid.toString());
        data.set("marking_id", mid.toString());
        return {
            baseURL: conf.baseUrl,
            url: conf.sessionUrl + "/new",
            data: data,
            method: "post",
            headers: {
                "Accept": "application/json, */*"
            },
        };
    }
}
