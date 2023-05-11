import State from "./state";
import Edge from "./edge";

import HashTable from "src/hash-table/hash-table";

export default class Graph {
    protected _states: HashTable<number, State>;
    protected _edges: HashTable<number, Edge>;
    protected _initial: number | null;

    protected counter: number;

    public constructor() {
        this._states = new HashTable<number, State>();
        this._edges = new HashTable<number, Edge>();
        this._initial = null;

        this.counter = 1;
    }

    public addState(state: State, id: number | null = null): number {
        if(id !== null) {
            this._states.set(id!, state);
            return id!;
        } else {
            let result = this.counter;
            this._states.set(this.counter++, state);
            return result;
        }
    }

    public addEdge(edge: Edge, id: number | null = null): number {
        if (id !== null) {
            this._edges.set(id, edge);
            return id;
        } else {
            let result = this.counter;
            this._edges.set(this.counter++, edge);
            return result;
        }
    }

    public preset(id: number): HashTable<number, Edge> {
        let result = this.edges.filterValues((edge: Edge) => {
            return edge.to == id;
        });
        return result;
    }

    public postset(id: number): HashTable<number, Edge> {
        let result = this.edges.filterValues((edge: Edge) => {
            return edge.from == id && edge.to != id;
        });
        return result;
    }

    public delState(id: number): void {
        this._states.remove(id);
    }

    public delEdge(id: number): void {
        this._edges.remove(id);
    }

    public getState(id: number): State | null {
        return this._states.get(id);
    }

    public getEdge(id: number): Edge | null {
        return this._edges.get(id);
    }

    public hasState(id: number): boolean {
        return this._states.has(id);
    }

    public hasEdge(id: number): boolean {
        return this._edges.has(id);
    }

    get initial(): number {
        return this._initial;
    }

    set initial(id: number | null) {
        this._initial = id;
    }

    get states(): HashTable<number, State> {
        return this._states;
    }

    get edges(): HashTable<number, Edge> {
        return this._edges;
    }
}
