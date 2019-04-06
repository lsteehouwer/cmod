import Graph from "src/editor/system/graph/graph";
import Edge from "src/editor/system/graph/edge";
import State from "src/editor/system/graph/state";
import { StateRequest, EdgeRequest, InitialRequest, GraphRequest } from "src/types";

export default class GraphToRequest {
    public static convert(g: Graph) {
        let states = g.states;
        let edges = g.edges;
        
        let requestStates = new Array<StateRequest>();
        let requestEdges = new Array<EdgeRequest>();

        let sids = states.keys();
        for(let i = 0; i < sids.length; i++) {
            let state: State = states.get(sids[i])!;
            let r: StateRequest = {
                state: state.toString(),
                id: sids[i]
            };
            requestStates.push(r);
        }
        
        let eids = edges.keys();
        for(let i = 0; i < eids.length; i++) {
            let edge: Edge = edges.get(eids[i])!;
            let r: EdgeRequest = {
                id: eids[i],
                fromId: edge.from,
                toId: edge.to,
                transition: edge.label
            };
            requestEdges.push(r);
        }

        let initial = g.initial;
        let requestInitial: InitialRequest = {
            id: initial
        }

        let result: GraphRequest = {
            states: requestStates,
            edges: requestEdges,
            initial: requestInitial
        };
        return result;
    }
}