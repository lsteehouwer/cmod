import Petrinet from "./petrinet/petrinet";
import TokenCount from "./tokens/token-count";
import IntegerTokenCount from "./tokens/integer-token-count";

import { HashTable } from "lib/collections/hashtable/hash-table";
import { hashString, eqStrings } from "lib/collections/extensions/string-extension";

export default class Marking {
    protected map: HashTable<string, TokenCount>;

    public constructor(petrinet: Petrinet, map: HashTable<string, TokenCount> | null = null) {
        if (map !== null) {
            this.map = map;
        } else {
            this.map = new HashTable<string, TokenCount>(hashString, eqStrings);
        }
        let places = petrinet.places.toArray();
        for(let i = 0; i < places.length; i++) {
            this.map.put(places[i], new IntegerTokenCount(0));
        }
    }

    public set(place: string, tokens: TokenCount): void {
        this.map.put(place, tokens);
    }

    public get(place: string): TokenCount {
        if (this.map.hasKey(place)) {
            return this.map.get(place)!;
        }
        throw new Error(`Could not get tokens for place ${place}`);
    }

    get places() {
        return this.map.keys();
    }

    public static equals(lhs: Marking, rhs: Marking) {
        let lplaces = lhs.places.sort();
        let rplaces = rhs.places.sort();
        if (lplaces.length === rplaces.length) {
            for(let i = 0; i < lplaces.length; i++) {
                let lplace = lplaces[i];
                let rplace = rplaces[i];
                if (lplace !== rplace || !lhs.get(lplace).equals(rhs.get(rplace))) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }

    public toString(type: MarkingStringType = MarkingStringType.FULL): string {
        let places = this.map.keys();
        let result = new Array<string>();
        for(let i = 0; i < places.length; i++) {
            result.push(`${places[i]}: ${this.map.get(places[i])}`);
        }
        return `${result.join(", ")}`;
    }
}

enum MarkingStringType {
    MINIMAL,
    FULL
}

export { MarkingStringType };
