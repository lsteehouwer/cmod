import EditorOptions from "./editor-options";
import Difficulty from "./difficulty";

import Petrinet from "src/system/petrinet/petrinet";
import Graph from "src/system/graph/graph";
import State from "src/system/graph/state";
import Edge from "src/system/graph/edge";
import Marking from "src/system/marking";

import Drawing from "src/drawing/drawing";
import GraphDrawing from "src/drawing/graph-drawing";
import GraphDrawingOptions from "src/drawing/graph-drawing-options";
import { isDraggable } from "src/drawing/draggable-drawing";
import { MarkingStringType } from "src/system/marking";

import Drawer from "src/drawer/drawer";
import DrawerOptions from "src/drawer/drawer-options";
import Feedback from "src/feedback/feedback";
import FeedbackDispatch from "src/feedback/feedback-dispatch";

import HistoryList from "src/history-list/history-list"
import Vector2D from "src/vector/vector2d";

import AddState from "./actions/add-state";
import AddEdge from "./actions/add-edge";
import DeleteState from "./actions/del-state";
import DeleteEdge from "./actions/del-edge";
import EditState from "./actions/edit-state";
import EditEdge from "./actions/edit-edge";
import FlipEdge from "./actions/flip-edge";
import SetInitial from "./actions/set-initial";

export default class Editor {
    protected _options: EditorOptions;

    public readonly drawer: Drawer;
    protected historyList: HistoryList;
    protected _feedback: Feedback | null;

    public petrinet: Petrinet;
    public graph: Graph;
    public graphDrawing: GraphDrawing;
    protected graphDrawingOptions: GraphDrawingOptions;

    public selection: Drawing | null;
    public selectionId: number | null;

    public hoverId: number | null;

    public constructor(canvas: HTMLCanvasElement, petrinet: Petrinet, options: EditorOptions) {
        this._options = options;
        this.petrinet = petrinet;
        this.drawer = new Drawer(canvas);
        this.historyList = new HistoryList();
        this.historyList.addHook(() => {
            this.drawer.draw();
            if (this.options.difficulty === Difficulty.EASY) {
                FeedbackDispatch.get(this.graph);
            }
        });

        this.selection = null;
        this.selectionId = null;
        this.hoverId = null;

        this.registerEvents();

        this.graph = new Graph();
        this.graphDrawingOptions = {
            selected: null,
            feedback: null,
            markingStyle: MarkingStringType.FULL,
        };
        this.graphDrawing = new GraphDrawing(this.graphDrawingOptions);
        this.feedback = null;

        this.drawer.draw(this.graphDrawing);
    }

    public addState(state: State, position: Vector2D | null = null): void {
        let a = new AddState(this, state, position);
        this.historyList.exec(a);
    }

    public addEdge(edge: Edge): void {
        if (!this.graph.hasState(edge.from) || !this.graph.hasState(edge.to))
            return;

        let a = new AddEdge(this, edge);
        this.historyList.exec(a);
    }

    public delState(id: number): void {
        let a = new DeleteState(this, id);
        this.historyList.exec(a);
    }

    public delEdge(id: number): void {
        let a = new DeleteEdge(this, id);
        this.historyList.exec(a);
    }

    public editState(id: number, state: State): void {
        if (this.graph.hasState(id)) {
            let current = this.graph.getState(id);
            if (!Marking.equals(current, state)) {
                let a = new EditState(this, id, state);
                this.historyList.exec(a);
            }
        }
    }

    public editEdge(id: number, edge: Edge): void {
        if (this.graph.hasEdge(id)) {
            let current = this.graph.getEdge(id).label;
            if (current !== edge.label) {
                let a = new EditEdge(this, id, edge);
                this.historyList.exec(a);
            }
        }
    }

    public setInitial(id: number | null): void {
        if (((id !== null && this.graph.hasState(id) || id === null)) &&
            id !== this.graph.initial) {
            let a = new SetInitial(this, id);
            this.historyList.exec(a);
        }
    }

    public flipEdge(id: number): void {
        if (this.graph.hasEdge(id)) {
            let edge = this.graph.getEdge(id);
            if (edge.from !== edge.to) {
                let a = new FlipEdge(this, id);
                this.historyList.exec(a);
            }
        }
    }

    public select(pos: Vector2D, context: CanvasRenderingContext2D): void {
        this.selectionId = this.graphDrawing.getDrawingAt(pos, context);
        this.selection = this.selectionId !== null ?
            this.graphDrawing.getDrawing(this.selectionId) :
            null;
        this.graphDrawingOptions.selected = this.selectionId;
        this.drawer.draw();
    }

    public get options(): EditorOptions {
        return this._options;
    }

    public set options(opts: EditorOptions) {
        this._options = opts;
        if (opts.difficulty === Difficulty.EASY) {
            FeedbackDispatch.get(this.graph);
        } else {
            FeedbackDispatch.clear();
        }
    }

    public get feedback(): Feedback {
        return this._feedback;
    }

    public set feedback(f: Feedback) {
        this._feedback = f;
        this.graphDrawingOptions.feedback = f;
        this.graphDrawing.options = this.graphDrawingOptions;
        this.drawer.draw(this.graphDrawing);
    }

    public set markingStyle(style: MarkingStringType) {
        this.graphDrawingOptions.markingStyle = style;
        this.drawer.draw(this.graphDrawing);
    }

    protected registerEvents(): void {
        this.drawer.registerEvents();

        let canvas = this.drawer.context.canvas;
        let context = canvas.getContext("2d");

        // key events
        canvas.addEventListener("keydown", (event) => {
            switch (event.key.toLowerCase()) {
                case "delete":
                    let graph = this.graph;
                    if (this.selectionId != null) {
                        if (graph.hasState(this.selectionId)) {
                            this.delState(this.selectionId);
                        } else if (graph.hasEdge(this.selectionId)) {
                            this.delEdge(this.selectionId);
                        }
                    }
                    break;
                case "a":
                    let position = this.drawer.localCenter;
                    let state = new Marking(this.petrinet);
                    this.addState(state, position);
                    break;
                case "c":
                    this.drawer.center();
                    break;
                case "i":
                    this.setInitial(this.selectionId);
                    break;
                case "y":
                    if (event.ctrlKey) {
                        this.historyList.redo();
                    }
                    break;
                case "z":
                    if (event.ctrlKey && !event.shiftKey) {
                        this.historyList.undo();
                    } else if (event.ctrlKey && event.shiftKey) {
                        this.historyList.redo();
                    }
                    break;
            }
        });

        // mouse events
        let mouseDownLeft = false;
        canvas.addEventListener("mousedown", (event) => {
            event.preventDefault();
            switch (event.buttons) {
                case 1: // left click
                    let point = this.drawer.globalToLocal(event);
                    if (this.selectionId !== null && event.ctrlKey) {
                        let id = this.graphDrawing.getDrawingAt(point, context);
                        if (id !== null) {
                            let transitions = this.petrinet.transitions.toArray();
                            let edge = new Edge(this.selectionId, id, transitions[0]);
                            this.addEdge(edge);
                        } else {
                            this.select(point, context);
                        }
                    } else {
                        this.select(point, context);
                    }
                    mouseDownLeft = true;
                    break;
                case 2: // right click
                    point = this.drawer.globalToLocal(event);
                    this.select(point, context);
                    break;
            }
        });
        canvas.addEventListener("mousemove", (event) => {
            if (mouseDownLeft && !event.ctrlKey &&
                this.selection && isDraggable(this.selection)) {
                document.body.style.cursor = "grabbing";
                let point = this.drawer.globalToLocal(event);
                this.selection.drag(point, context!);
                this.hoverId = null;
                this.drawer.draw();
            } else if (!mouseDownLeft) {
                let point = this.drawer.globalToLocal(event);
                this.hoverId = this.graphDrawing.getDrawingAt(point, context);
                if (this.hoverId !== null) {
                    document.body.style.cursor = "pointer";
                } else {
                    document.body.style.cursor = "default";
                }
            }
        });
        canvas.addEventListener("mouseup", (event) => {
            mouseDownLeft = false;
            this.drawer.draw(this.graphDrawing);
        });

        canvas.addEventListener("contextmenu", (event) => {
            event.preventDefault();
        });
    }
}
