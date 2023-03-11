import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";
import axios, { AxiosResponse, AxiosError } from "axios";

import Config from "src/services/config";

import UserService from "src/services/user";
import { UserCreatedResponse } from "src/types";

@Module({
    name: "UserModule",
    namespaced: true
})
export default class UserModule extends VuexModule {
    uid: number | null = null;
    err: string = "";
    loading: boolean = false;

    get id(): number | null {
        return this.uid;
    }

    get error(): string {
        return this.err;
    }

    get isLoading(): boolean {
        return this.loading;
    }

    @Mutation
    setId(id: number | null): void {
        this.uid = id;
    }

    @Mutation
    setError(err: string): void {
        this.err = err;
    }

    @Mutation
    setLoading(val: boolean): void {
        this.loading = val;
    }

    @Action
    register(username: string): void {
	this.setLoading(true);

	let request = UserService.set(username);
	axios(request)
	    .then((response => {
		let id = Number(response.data.user_id);
		this.setId(id);
		this.setError("");
	    }))
	    .catch(error => {
		console.log(error);
	    })
	    .finally(() => this.setLoading(false));

        // this.setLoading(true);
        // let fd = new FormData();
        // fd.set("name", username);
        // return new Promise((resolve, reject) => {
        //     let conf = UserService.set(username);
        //     axios.request(conf)
        //         .then((response: AxiosResponse<UserCreatedResponse>) => {
        //             let id = Number(response.data.user_id);
        //             this.setId(id);
        //             this.setError("");
        //             resolve(null);
        //         }).catch((error: AxiosError) => {
        //             let message: string;
        //             if (error.response) {
	// 		if (!error.response.data && error.response.status === 404) {
	// 		    message = `Server not found at URL: '$config.baseUrl}"`;
	// 		} else if (error.response.data) {
	// 		    message = error.response.data;
	// 		} else {
	// 		    message = "Unkown error";
	// 		}
        //             } else {
        //                 message = "Could not connect to server";
        //             }
        //             this.setId(null);
        //             this.setError(message);
        //             reject(null);
        //         }).finally(() => {
        //             this.setLoading(false);
        //         });
        // });
    }
}
