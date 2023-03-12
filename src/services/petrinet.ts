import axios, { AxiosPromise, AxiosRequestConfig } from "axios";
import { PetrinetResponse, PetrinetCreatedResponse } from "src/types";

import Config from "src/services/config";

export default class PetrinetService {
    public static get(id: number, mid: number): AxiosRequestConfig {
        let conf = Config.getInstance();
        return {
            baseURL: conf.baseUrl,
            url: conf.petrinetUrl + `/${id}?marking_id=${mid}`,
            method: "get",
        };
    }

    public static set(uid: number, file: File): AxiosRequestConfig {
        let conf = Config.getInstance();
        let fd = new FormData();
        fd.set("petrinet", file);
        fd.set("user_id", uid.toString());
        return {
            baseURL: conf.baseUrl,
            url: conf.petrinetUrl + "/new",
            method: "post",
            data: fd,
            headers: {
                "Accept": "application/json",
                "Content-Type": "multipart/form-data",
            }
        };
    }

    public static gets(limit: number, page: number): AxiosRequestConfig {
        let conf = Config.getInstance();
        return {
            baseURL: conf.baseUrl,
            url: conf.petrinetUrl + `/${limit}/${page}/`,
            method: "get"
        };
    }

    public static image(id: number, mid: number): AxiosRequestConfig {
        let conf = Config.getInstance();
        return {
            baseURL: conf.baseUrl,
            url: conf.petrinetUrl + `/${id}/image?&marking_id=${mid}`,
            method: "get"
        };
    }
}
