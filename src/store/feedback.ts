import { VuexModule, Module, Mutation, Action, getModule } from "vuex-module-decorators";
import axios, { AxiosResponse, AxiosError } from "axios";

import UserModule from "./user";
import SessionModule from "./session";
import PetrinetModule from "./petrinet";

import Graph from "src/system/graph/graph";
import ResponseToFeedback from "src/converters/response-to-feedback";

import Config from "src/services/config";
import FeedbackService from "src/services/feedback";
import Feedback from "src/feedback/feedback";

import { FeedbackResponse } from "src/types";

@Module({
    name: "FeedbackModule",
    namespaced: true
})
export default class FeedbackModule extends VuexModule {
    _feedback: Feedback = new Feedback();
    _loading: boolean = false;

    get feedback(): Feedback {
        return this._feedback;
    }

    get isLoading(): boolean {
        return this._loading;
    }

    @Mutation
    setFeedback(fb: Feedback): void {
        this._feedback = fb;
    }

    @Mutation
    setLoading(val: boolean): void {
        this._loading = val;
    }

    @Mutation
    clear(): void {
        this._loading = false;
        this._feedback = new Feedback();
    }

    @Action
    get(graph: Graph) {
	let umod = getModule(UserModule);
	let pmod = getModule(PetrinetModule);
	let smod = getModule(SessionModule);

	this.setLoading(true);
	let request = FeedbackService.get(umod.id, pmod.id, smod.id, graph);
	axios(request)
	    .then(response => {
		let feedbackData = response.data;
		let feedback = ResponseToFeedback.convert(feedbackData);
		this.setFeedback(feedback);
	    })
	    .catch(error => {
		console.log(error);
	    })
	    .finally(() => {
		this.setLoading(false);
	    });
    }

    // @Action
    // get(graph: Graph): Promise<any> {
    //     let umod = getModule(UserModule);
    //     let smod = getModule(SessionModule);
    //     let pmod = getModule(PetrinetModule);
    //     this.setLoading(true);
    //     return new Promise((resolve, reject) => {
    //         let config = FeedbackService.get(umod.id, pmod.id, smod.id, graph);
    //         axios.request(config)
    //             .then((response: AxiosResponse<FeedbackResponse>) => {
    //                 let fr = response.data;
    //                 let feedback = ResponseToFeedback.convert(fr);
    //                 this.setFeedback(feedback);
    //                 resolve();
    //             }).catch((error: AxiosError) => {
    //                 let message: string;
    //                 if (error.response) {
    //                     if (error.response.status === 404) {
    //                         let config = Config.getInstance();
    //                         message = `Server not found at: "${config.baseUrl}"`;
    //                     } else if (error.response.data.error) {
    //                         message = error.response.data.error;
    //                     } else {
    //                         message = "Unkown error";
    //                     }
    //                 } else {
    //                     message = "Could not connect to server";
    //                 }
    //                 reject();
    //             }).finally(() => {
    //                 this.setLoading(false);
    //             });
    //     });
    // }
}
