import { Module, VuexModule, Mutation, Action, getModule } from "vuex-module-decorators";
import axios, { AxiosResponse, AxiosError } from "axios";

import Petrinet from "src/system/petrinet/petrinet";
import ResponseToPetrinet from "src/converters/response-to-petrinet";
import UserModule from "./user";

import Config from "src/services/config";
import PetrinetService from "src/services/petrinet";
import {
    MarkedPetrinetResponse,
    PetrinetCreatedResponse
} from "src/types";

@Module({
    name: "PetrinetModule",
    namespaced: true
})
export default class PetrinetModule extends VuexModule {
    pid: number | null = null;
    mid: number | null = null;
    net: Petrinet | null = null;
    err: string = "";
    loading: boolean = false;

    get id(): number | null {
        return this.pid;
    }

    get markingId(): number | null {
        return this.mid;
    }

    get petrinet(): Petrinet | null {
        return this.net;
    }

    get error(): string {
        return this.err;
    }

    get isLoading(): boolean {
        return this.loading;
    }

    @Mutation
    setId(id: number | null): void {
        this.pid = id;
    }

    @Mutation
    setMarkingId(id: number | null): void {
        this.mid = id;
    }

    @Mutation
    setPetrinet(net: Petrinet | null): void {
        this.net = net;
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
    register(file: File | null): Promise<void> {
        let umod = getModule(UserModule);
        if (!file) {
            this.setError("No file selected");
            return;
        } else if (umod.id === null) {
            this.setError("No user logged in");
            return;
        }

        this.setLoading(true);
        let request = PetrinetService.set(umod.id, file);
        return axios(request)
            .then(response => {
                this.setId(Number(response.data.petrinet_id));
                this.setMarkingId(Number(response.data.marking_id));
                this.setError("");
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

    @Action
    get(): void {
        if (this.id === null) {
            this.setError("Could not retrieve Petri net: no id supplied");
            return;
        }

        this.setLoading(true);
        let request = PetrinetService.get(this.id, this.mid);
        axios(request)
            .then(response => {
                let net = response.data.petrinet;
                let cnet = ResponseToPetrinet.convert(net);
                this.setPetrinet(cnet);
                this.setError("");
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
