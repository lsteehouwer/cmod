import FeedbackCode from "./feedback-code";
import FeedbackRecord from "./feedback-record";

import HashTable from "src/hash-table/hash-table";

export default class Feedback {
    public general: FeedbackRecord;
    public specific: HashTable<number, FeedbackRecord>;
    protected _correct: boolean;

    public constructor() {
        this.general = new FeedbackRecord();
        this.specific = new HashTable<number, FeedbackRecord>();
        this._correct = true;
    }

    public get(id: number): FeedbackRecord {
        if(this.specific.has(id)) {
            return this.specific.get(id)!;
        }
        return new FeedbackRecord();
    }

    public add(code: FeedbackCode, id: number | null = null): void {
        if(id === null) {
            this.general.add(code);
        } else {
            if(!this.specific.has(id)) {
                this.specific.set(id, new FeedbackRecord());
            }
            this.specific.get(id)!.add(code);
        }

        if (code >= 400) {
            this._correct = false;
        }
    }

    public del(code: FeedbackCode, id: number | null = null): void {
        if(id === null) {
            this.general.delete(code);
        } else {
            if(this.specific.has(id)) {
                this.specific.get(id)!.delete(code);
            }
        }

        if (this.general.highest >= 400) {
            this._correct = false;
        }

        if (this._correct) {
            this.specific.each((id: number, record: FeedbackRecord) => {
                if (record.highest >= 400) {
                    this._correct = false;
                }
            });
        }
    }

    public get correct() {
        return this._correct && !this.general.isEmpty() && !this.specific.isEmpty();
    }
}
