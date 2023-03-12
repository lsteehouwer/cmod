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
                let message: string;
                if (!error.response)
                    message = "Could not connect to server";
                else
                    message = error.response?.data?.message

                message ??= "Unknown error";

                this.setError(message);
            })
            .finally(() => this.setLoading(false));
    }
}
