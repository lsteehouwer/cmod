import { Module, VuexModule, Mutation, Action, getModule } from "vuex-module-decorators";
import axios, { AxiosResponse, AxiosError } from "axios";

import UserModule from "./user";
import PetrinetModule from "./petrinet";

import Config from "src/services/config";
import SessionService from "src/services/session";
import { SessionCreatedResponse } from "src/types";

@Module({
    name: "SessionModule",
    namespaced: true,
})
export default class SessionModule extends VuexModule {
    sid: number | null = null;
    err: string = "";
    loading: boolean = false;

    get id(): number | null {
        return this.sid;
    }

    get error(): string {
        return this.err;
    }

    get isLoading(): boolean {
        return this.loading
    }

    @Mutation
    setId(id: number | null): void {
        this.sid = id;
    }

    @Mutation
    setError(message: string): void {
        this.err = message;
    }

    @Mutation
    setLoading(val: boolean): void {
        this.loading = val;
    }

    @Action
    register(): Promise<any> {
        let umod = getModule(UserModule);
        let pmod = getModule(PetrinetModule);

        if (umod.id === null || pmod.id === null || pmod.mid === null) {
            this.setError("Not enough information to start the session");
            return;
        }

        this.setLoading(true);
        let request = SessionService.set(umod.id, pmod.id, pmod.mid);

        axios(request)
            .then(response => {
                let sid = response.data.session_id;
                this.setId(Number(sid));
            })
            .catch(error => {
                let message: string;
                if (!error.response)
                    message = "Could not connect to server";
                else
                    message = error.response?.data?.message;
                message ??= "Unknown error";

                this.setError(message);
            })
            .finally(() => {
                this.setLoading(false);
            });
    }
}
