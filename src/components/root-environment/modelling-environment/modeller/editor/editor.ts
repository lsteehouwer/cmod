import { Vue, Component, Watch } from "vue-property-decorator";
import WithRender from "./editor.html?style=./editor.scss";

import { getModule } from "vuex-module-decorators";
import DrawerSettingsModule from "src/store/drawer-settings";
import ModellerModule from"src/store/modeller"
import PetrinetModule from "src/store/petrinet";
import FeedbackModule from "src/store/feedback";

import ContextMenuComponent from "./context-menu/context-menu";

import Editor from "src/editor/editor";

@WithRender
@Component({
    name: "editor",
    components: {
        "context-menu": ContextMenuComponent
    }
})
export default class EditorComponent extends Vue {
    editor: Editor | null;
    showContextMenu: boolean = false;

    mounted () {
        let canvas = <HTMLCanvasElement><unknown>document.getElementById("editorCanvas");
        this.editor = new Editor(canvas, this.petrinet);
        this.editor.setSettings(this.settings);
        
        canvas.addEventListener("mouseup", (event) => {
            switch(event.button) {
                case 2:
                    this.showContextMenu = !this.showContextMenu;
                    break;
            }
        });
    }

    get petrinet() {
        let mod = getModule(PetrinetModule, this.$store);
        return mod.petrinet;
    }

    @Watch('petrinet', {deep: true, immediate: false})
    onPetrinetChange() {
        if (this.editor) { 
            this.editor.petrinet = this.petrinet;
        }
    }

    get feedback() {
        let mod = getModule(FeedbackModule, this.$store);
        return mod.feedback;
    }

    @Watch('feedback', {deep: true, immediate: false})
    onFeedbackChange() {
        if (this.editor) {
            this.editor.setFeedback(this.feedback);
        }
    }

    get settings() {
        let mod = getModule(DrawerSettingsModule, this.$store);
        return mod.settings;
    }

    @Watch('settings', {deep:true, immediate: false})
    onSettingsChange() {
        // this.drawer.draw();
        if (this.editor) {
            this.editor.setSettings(this.settings);
        }
    }

    get isResizing() {
        let mod = getModule(ModellerModule, this.$store);
        return mod.resizing;
    }

    @Watch('isResizing', {deep: true, immediate: false})
    onResizeChange() {
        if (this.editor) {
            this.editor.resize();
        }
    }
}

