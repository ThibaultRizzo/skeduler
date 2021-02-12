import { BehaviorSubject } from "rxjs";
import { BaseCRUDRecord } from "./crud.subject";

/**
 * @generic T: type of item from array
 */
export class BehaviorArrayLikeSubject<T extends BaseCRUDRecord> extends BehaviorSubject<T[] | null> {

    name: string;
    constructor(value: T[] | null, name = 'default') {
        super(value);
        this.name = name;
    }

    createRecord(newRecord: T) {
        // TODO: Find a way to only add  record to subjects matching its constraints
        this.next([...(this.value || []), newRecord]);
    }

    updateRecord(updatedRecord: T) {
        if (this.value) {
            this.next(this.value.map(r => r.id === updatedRecord.id ? updatedRecord : r) || [updatedRecord]);
        }
    }

    deleteRecord(deletedId: string) {
        if (this.value) {
            this.next(this.value.filter(r => r.id !== deletedId));
        }
    }
}
