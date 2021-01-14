import { WithId } from '../model';
import { BehaviorSubject } from "rxjs"
import snackbarSubject, { LogLevel } from "./snackbar.subject";

export type BaseCRUDRecord = {
    id: string
}

export type ReadSubjectProps<T extends BaseCRUDRecord, O = {}> = {
    fetchAll: () => Promise<T[]>;
    custom?: (subject: ReadSubject<T>) => O
}

export type CRUDSubjectProps<T extends BaseCRUDRecord, D> = {
    createOne: (draftRecord: D) => Promise<T | null>,
    updateOne: (record: WithId<D>) => Promise<T | null>,
    deleteOne: (id: string) => Promise<boolean>,
} & ReadSubjectProps<T>

export type SimpleSubjectProp<T extends BaseCRUDRecord> = {
    subscribe: (setState: React.Dispatch<React.SetStateAction<T[] | null>>) => void,
    unsubscribe: () => void
}
export type CRUDSubject<T extends BaseCRUDRecord, D> = ReadSubject<T> & CRUDSubjectProps<T, D>

export type ReadSubject<T extends BaseCRUDRecord> = ReadSubjectProps<T> & SimpleSubjectProp<T> & {
    lazyFetchAll: () => Promise<T[]>
}

export function buildReadonlyRecordSubject<T extends BaseCRUDRecord, O = {}>({ fetchAll }: ReadSubjectProps<T, O>, injectedSubject?: BehaviorSubject<T[] | null>): ReadSubject<T> {
    const subject = injectedSubject ? injectedSubject : new BehaviorSubject<T[] | null>(null);
    const fetchSubject = async () => {
        const recordList = await fetchAll();
        if (subject)
            if (recordList) {
                subject.next(recordList);
                snackbarSubject.openSnackbar({ title: 'Something went wrong', level: LogLevel.SUCCESS })
            } else {
                snackbarSubject.openSnackbar({ title: 'Something went wrong', level: LogLevel.ERROR })
            }
        return recordList;
    };

    // Fetch first
    fetchSubject();
    return {
        subscribe: (setState: React.Dispatch<React.SetStateAction<T[] | null>>) => subject.subscribe(setState),
        unsubscribe: () => subject.unsubscribe(),
        lazyFetchAll: async () => {
            const currentValue = subject.value;
            if (currentValue) {
                return Promise.resolve(currentValue)
            } else {
                return fetchSubject();
            }
        },
        fetchAll: fetchSubject,
    };
}
export function buildRecordSubject<T extends BaseCRUDRecord, D>({ createOne, updateOne, deleteOne, fetchAll }: CRUDSubjectProps<T, D>): CRUDSubject<T, D> {
    const subject = new BehaviorSubject<T[] | null>(null);
    const fetchSubject = async () => {
        const recordList = await fetchAll();
        if (subject)
            if (recordList) {
                subject.next(recordList);
                snackbarSubject.openSnackbar({ title: 'Something went wrong', level: LogLevel.SUCCESS })
            } else {
                snackbarSubject.openSnackbar({ title: 'Something went wrong', level: LogLevel.ERROR })
            }
        return recordList;
    };
    // Fetch first
    fetchSubject();
    return {
        subscribe: (setState: React.Dispatch<React.SetStateAction<T[] | null>>) => subject.subscribe(setState),
        unsubscribe: () => subject.unsubscribe(),
        createOne: async (draftRecord) => {
            const newRecord = await createOne(draftRecord);
            if (newRecord) {
                subject.next([...(subject.value || []), newRecord]);
                snackbarSubject.openSnackbar({ title: 'Record created', level: LogLevel.SUCCESS })
            } else {
                snackbarSubject.openSnackbar({ title: 'Something went wrong', level: LogLevel.ERROR })

            }
            return newRecord;
        },
        updateOne: async (record) => {
            const updatedRecord = await updateOne(record);
            if (updatedRecord) {
                subject.next(subject.value?.map(r => r.id === updatedRecord.id ? updatedRecord : r) || [updatedRecord]);
                snackbarSubject.openSnackbar({ title: 'Record updated', level: LogLevel.SUCCESS })
            } else {
                snackbarSubject.openSnackbar({ title: 'Something went wrong', level: LogLevel.ERROR })
            }
            return updatedRecord;
        },
        deleteOne: async (id) => {
            const isDeleted = await deleteOne(id);
            if (isDeleted) {
                subject.next(subject.value?.filter(r => r.id !== id) || []);
                snackbarSubject.openSnackbar({ title: 'Record deleted', level: LogLevel.SUCCESS })
            } else {
                snackbarSubject.openSnackbar({ title: 'Something went wrong', level: LogLevel.ERROR })
            }
            return isDeleted;
        },
        lazyFetchAll: async () => {
            const currentValue = subject.value;
            if (currentValue) {
                return Promise.resolve(currentValue)
            } else {
                return fetchSubject();
            }
        },
        fetchAll: fetchSubject
    };

}