import { Vue, Component, Watch } from "vue-property-decorator";
import WithRender from "./editor.html?style=./editor.scss";

import { getModule } from "vuex-module-decorators";
import DrawerSettingsModule from "src/store/drawer-settings";
import ModellerModule from "src/store/modeller";

import Editor from "src/editor/editor";
import DrawerOptions, { GridOptions } from "src/editor/drawer/drawer-options";

@WithRender
@Component({
    name: "editor",
})
export default class EditorComponent extends Vue {
    testProp: boolean = false;
    editor: Editor | null = null;

    mounted() {
        let canvas = <HTMLCanvasElement>document.getElementById("editorCanvas");
        let editor = new Editor(canvas);
        this.editor = editor;

        let settings = this.settings;
        this.editor.setSettings(settings);
    }

    get settings() {
        let mod = getModule(DrawerSettingsModule, this.$store);
        return mod.settings;
    }

    get isResizing() {
        let mod = getModule(ModellerModule, this.$store);
        return mod.resizing;
    }

    @Watch('settings', {deep: true, immediate: true})
    onSettingsChange() {
        let mod = getModule(DrawerSettingsModule, this.$store);
        if (this.editor) {
            this.editor.setSettings(mod.settings);
        }
    }

    @Watch('isResizing', {deep: true, immediate: true})
    onResizeChange() {
        let mod = getModule(ModellerModule, this.$store);
        if (!mod.resizing && this.editor) {
            this.editor.resize();
        }
    }
}
