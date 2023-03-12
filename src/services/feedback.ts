import axios, { AxiosPromise, AxiosRequestConfig } from "axios";
import Config from "./config";
import { FeedbackResponse, GraphRequest } from "src/types";

import Graph from "src/system/graph/graph";
import GraphToRequest from "src/converters/graph-to-request";

export default class FeedbackService {
    public static get(
        uid: number,
        pid: number,
        sid: number,
        graph: Graph
    ): AxiosRequestConfig {
        let conf = Config.getInstance();
        let base = conf.baseUrl;
        let petrinetUrl = conf.petrinetUrl;
        let g = GraphToRequest.convert(graph);
        let data = {
            "user_id": uid,
            "session_id": sid,
            "graph": g
        };
        let config: AxiosRequestConfig = {
            baseURL: base,
            url: petrinetUrl + "/feedback",
            data: data,
            method: "post",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json;charset=utf-8"
            }
        };
        return config;
    }
}
