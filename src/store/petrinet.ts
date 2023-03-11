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
		if (!response.data) {
		    this.setError("Cannot continue: no data provided by server");
		    return;
		}

		this.setId(Number(response.data.petrinet_id));
		this.setMarkingId(Number(response.data.marking_id));
		this.setError("");
	    })
	    .finally(() => {
		this.setLoading(false);
	    });
    }

    // @Action
    // register(file: File | null): Promise<any> {
    //     let umod = getModule(UserModule);
    //     return new Promise((resolve, reject) => {
    //         if (!file) {
    //             this.setError("No file selected");
    //             reject();
    //         } else if (umod.id === null) {
    //             this.setError("No user logged in");
    //             reject();
    //         } else {
    //             this.setLoading(true);
    //             let conf = PetrinetService.set(umod.id, file);
    //             axios.request(conf)
    //                 .then((response: AxiosResponse<PetrinetCreatedResponse>) => {
    //                     let id = Number(response.data.petrinet_id);
    // 			let mid = Number(response.data.marking_id);
    //                     this.setError("");
    //                     this.setId(id);
    // 			this.setMarkingId(mid);
    //                     resolve();
    //                 }).catch((error: AxiosError) => {
    //                     let message: string;
    //                     if (error.response) {
    // 			    if (!error.response.data && error.response.status === 404) {
    // 				let config = Config.getInstance();
    // 				message = `Server not found at URL: "${config.baseUrl}"`;
    // 			    } else if (error.response.data) {
    // 				message = error.response.data;
    // 			    } else {
    // 				message = "Unknown error";
    // 			    }
    //                     } else {
    //                         message = "Could not connect to server";
    //                     }
    //                     this.setId(null);
    //                     this.setError(message);
    //                     reject();
    //                 }).finally(() => {
    //                     this.setLoading(false);
    //                 });
    //         }
    //     });
    // }

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
	    .finally(() => {
		this.setLoading(false);
	    });
    }

    // @Action
    // get(): Promise<any> {
    //     return new Promise((resolve, reject) => {
    //         if (this.id === null) {
    //             this.setError("Could not retrieve Petri net as no id is supplied");
    //             reject();
    //         } else {
    //             this.setLoading(true);
    //             let conf = PetrinetService.get(this.id, this.mid);
    //             axios.request(conf)
    //                 .then((response: AxiosResponse<MarkedPetrinetResponse>) => {
    //                     let net = response.data.petrinet;
    //                     let cnet = ResponseToPetrinet.convert(net);
    //                     this.setPetrinet(cnet);
    //                     this.setError("");
    //                     resolve();
    //                 }).catch((error: AxiosError) => {
    //                     let message: string;
    //                     if (error.response) {
    //                         if (error.response.status === 404) {
    //                             let config = Config.getInstance();
    //                             message = `Server not found at URL: "${config.baseUrl}"`;
    //                         } else if (error.response.data) {
    //                             message = error.response.data;
    //                         } else {
    //                             message = "Unkown error";
    //                         }
    //                     } else {
    //                         message = "Could not connect to server";
    //                     }
    //                     this.setError(message);
    //                     reject();
    //                 }).finally(() => {
    //                     this.setLoading(false);
    //                 });
    //         }
    //     });
    // }
}
