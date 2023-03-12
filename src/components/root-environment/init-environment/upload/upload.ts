import { Component, Vue } from "vue-property-decorator";
import WithRender from "./upload.html";

import AlertComponent from "src/components/common/messages/alert/alert";

import { getModule } from "vuex-module-decorators";
import PetrinetModule from "src/store/petrinet";
import SessionModule from "src/store/session";

@WithRender
@Component({
    name: "upload-dialog",
    components: {
        "alert": AlertComponent
    }
})
export default class UploadDialogComponent extends Vue {
    file: File | null = null;
    hideError: boolean = false;

    selectFile(event) {
        let file = event.target.files[0];
        this.file = file;
    }

    closeAlert() {
        this.hideError = true;
    }

    get error() {
        let smod = getModule(SessionModule, this.$store);
        let pmod = getModule(PetrinetModule, this.$store);
        return pmod.error.length > 0 ? pmod.error : smod.error;
    }

    get showError() {
        return this.error.length > 0 && !this.hideError;
    }

    send() {
        this.hideError = false;
        let pmod = getModule(PetrinetModule, this.$store);
        let smod = getModule(SessionModule, this.$store);

        pmod.register(this.file)
            .then(() => {
                if (!pmod.error) {
                    pmod.get();
                    smod.register();
                }
            });
    }
}
