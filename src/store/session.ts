import { Module, VuexModule, Mutation, Action, getModule } from "vuex-module-decorators";
import { AxiosResponse, AxiosError } from "axios";

import UserModule from "./user";
import PetrinetModule from "./petrinet";

import SessionService from "src/services/session";
import { SessionCreatedResponse } from "src/types";

@Module({
    name: "SessionModule",
    namespaced: true,
})
export default class SessionModule extends VuexModule {
    sid: number = 0;
    err: string = "";
    loading: boolean = false;

    get id() {
        return this.sid;
    }

    get error() {
        return this.err;
    }

    get isLoading() {
        return this.loading
    }

    @Mutation
    setId(id: number | null) {
        this.sid = id;
    }

    @Mutation
    setError(message: string) {
        this.err = message;
    }

    @Mutation
    setLoading(val: boolean) {
        this.loading = val;
    }

    @Action
    register() {
        let umod = getModule(UserModule);
        let pmod = getModule(PetrinetModule);
        if (umod.id === null || pmod.id === null) {
            this.setError("Not enough information to start the session");
        } else {
            this.setLoading(true);
            return new Promise((resolve, reject) => {
                SessionService.set(umod.id, pmod.id)
                .then((response: AxiosResponse<SessionCreatedResponse>) => {
                    let sid = response.data.session_id;
                    this.setId(sid);
                    return resolve();
                }).catch((response: AxiosError) => {
                    let error =response.response.data;
                    this.setId(null);
                    this.setError(error.error);
                }).finally(() => {
                    this.setLoading(false);
                });
            });
        }
    }
}
