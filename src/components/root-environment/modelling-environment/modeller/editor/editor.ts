import { Vue, Component, Watch } from "vue-property-decorator";
import WithRender from "./editor.html?style=./editor.scss";

import { getModule }              from "vuex-module-decorators";
import EditorSettingsModule       from "src/store/editor-settings";
import DrawerSettingsModule       from "src/store/drawer-settings";
import GraphDrawingSettingsModule from "src/store/graph-drawing-settings";
import ModellerModule             from "src/store/modeller";
import PetrinetModule             from "src/store/petrinet";
import FeedbackModule             from "src/store/feedback";

import ContextMenuComponent from "./context-menu/context-menu";
import MessengerComponent   from "./messenger/messenger";
import EditStateComponent   from "./edit-state/edit-state";
import EditEdgeComponent    from "./edit-edge/edit-edge";

import { MarkingStringType } from "src/system/marking";

import Editor from "src/editor/editor";

@WithRender
@Component({
    name: "editor",
    components: {
        "context-menu": ContextMenuComponent,
        "messenger": MessengerComponent,
        "edit-state": EditStateComponent,
        "edit-edge": EditEdgeComponent,
    }
})
export default class EditorComponent extends Vue {
    editor: Editor | null = null;
    showContextMenu: boolean = false;
    showEditState: boolean = false;
    showEditEdge: boolean = false;

    contextLeft: number = 0;
    contextTop: number = 0;
    contextX: number = 0;
    contextY: number = 0;

    mounted() {
        let canvas = <HTMLCanvasElement><unknown>document.getElementById("editorCanvas");
        this.editor = new Editor(canvas, this.petrinet, this.editorSettings);
        this.editor.drawerOptions = this.drawerSettings;
        this.editor.markingStyle = this.stringType;
    }

    openContextMenu(event) {
        if (this.editor) {
            let box = this.editor.drawer.context.canvas.getBoundingClientRect();
            let drawer = this.editor.drawer;
            let point = drawer.globalToLocal(event);
            this.contextLeft = event.clientX - Math.round(box.left);
            this.contextTop = event.clientY - Math.round(box.top);
            this.contextX = point.x;
            this.contextY = point.y;
            this.showContextMenu = true;
        }
    }

    openEditMenu(event) {
        if (this.editor && !event.ctrlKey) {
            let id = this.editor.selectionId;
            let graph = this.editor.graph;
            if (graph.hasState(id)) {
                this.showEditState = true;
            } else if (graph.hasEdge(id)) {
                this.showEditEdge = true;
            }
        }
    }

    closeContextMenu() {
        this.showContextMenu = false;
    }

    closeEditStateMenu() {
        this.showEditState = false;
    }

    closeEditEdgeMenu() {
        this.showEditEdge = false;
    }

    closeMenus() {
        this.closeContextMenu();
        this.closeEditStateMenu();
        this.closeEditEdgeMenu();
        if (this.editor) {
            let canvas = this.editor.drawer.context.canvas;
            canvas.focus();
        }
    }

    get showingMenu() {
        return this.showEditState || this.showEditEdge || this.showContextMenu;
    }

    toggleContext() {
        this.showContextMenu = !this.showContextMenu;
    }

    toggleStyle() {
        let mod = getModule(GraphDrawingSettingsModule, this.$store);
        if (this.stringType == MarkingStringType.FULL) {
            mod.setType(MarkingStringType.MINIMAL);
        } else {
            mod.setType(MarkingStringType.FULL);
        }
    }

    get hoverId() {
        if (this.editor) {
            return this.editor.hoverId;
        }
        return null;
    }

    get petrinet() {
        let mod = getModule(PetrinetModule, this.$store);
        return mod.petrinet;
    }

    @Watch('petrinet', {deep: false, immediate: false})
    onPetrinetChange() {
        if (this.editor) { 
            this.editor.petrinet = this.petrinet;
        }
    }

    get feedback() {
        let mod = getModule(FeedbackModule, this.$store);
        return mod.feedback;
    }

    @Watch('feedback', {deep: false, immediate: false})
    onFeedbackChange() {
        if (this.editor) {
            this.editor.feedback = this.feedback;
        }
    }

    get editorSettings() {
        let mod = getModule(EditorSettingsModule, this.$store);
        return mod.settings;
    }

    @Watch('editorSettings', {deep: true, immediate: false})
    onEditorSettingsChange() {
        if (this.editor) {
            this.editor.options = this.editorSettings;
        }
    }

    get drawerSettings() {
        let mod = getModule(DrawerSettingsModule, this.$store);
        return mod.settings;
    }

    @Watch('drawerSettings', {deep: true, immediate: false})
    onDrawerSettingsChange() {
        if (this.editor) {
            this.editor.drawerOptions = this.drawerSettings;
        }
    }

    get stringType() {
        let mod = getModule(GraphDrawingSettingsModule, this.$store);
        return mod.stringType;
    }

    @Watch('stringType', {deep: false, immediate: true})
    onStringTypeChange() {
        if (this.editor) {
            let type = this.stringType;
            this.editor.markingStyle = type;
        }
    }

    get isResizing() {
        let mod = getModule(ModellerModule, this.$store);
        return mod.resizing;
    }

    @Watch('isResizing', {deep: false, immediate: false})
    onResizeChange() {
        if (this.editor) {
            this.editor.drawer.resize();
        }
    }
}

