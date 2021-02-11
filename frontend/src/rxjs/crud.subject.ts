import { WithId } from '../model';
import { BehaviorSubject, Subscription } from "rxjs"
import snackbarSubject, { LogLevel } from "./snackbar.subject";
import { ApiError, isApiError } from '../api/helper';

export type BaseCRUDRecord = {
    id: string
}

export type CUD<T, D, R> = {
    createOne: (draftRecord: D) => Promise<T | R>,
    updateOne: (record: WithId<D>) => Promise<T | R>,
    deleteOne: (id: string) => Promise<boolean | R>,
}
export type Read<T, R> = {
    fetchAll: () => Promise<T[] | R>;
}


export type ReadSubjectProps<T extends BaseCRUDRecord, O = {}> = Read<T, ApiError> & {
    custom?: (subject: ReadSubject<T>) => O
}
export type CRUDSubjectProps<T extends BaseCRUDRecord, D> = CUD<T, D, ApiError> & ReadSubjectProps<T, D>
export type SimpleSubjectProp<T extends BaseCRUDRecord> = {
    subscribe: (setState: (d: T[] | null) => void) => Subscription,
    unsubscribe: () => void
}



export type CRUDSubject<T extends BaseCRUDRecord, D> = ReadSubject<T> & CUD<T, D, null>
export type ReadSubject<T extends BaseCRUDRecord, O = {}> = Read<T, null> & {
    custom?: (subject: ReadSubject<T>) => O
} & SimpleSubjectProp<T> & {
    lazyFetchAll: () => Promise<T[]>
}

export function executeFnOrOpenSnackbar<T>(fn: (val: T) => unknown, payloadOrError: T | ApiError) {
    if (fn) {
        if (isApiError(payloadOrError)) {
            const apiError = payloadOrError as ApiError;
            console.error(apiError);
            snackbarSubject.openSnackbar({ title: apiError.error, level: LogLevel.ERROR })
        } else {
            const payload = payloadOrError as T;
            fn(payload)
        }
    }
}

export function getResultElseNull<T>(result: T | ApiError): T | null {
    return isApiError(result) ? null : result as T;
}

export function buildReadonlyRecordSubject<T extends BaseCRUDRecord, O = {}>({ fetchAll }: ReadSubjectProps<T, O>, injectedSubject?: BehaviorSubject<T[] | null>): ReadSubject<T, O> {
    const subject = injectedSubject ? injectedSubject : new BehaviorSubject<T[] | null>(null);
    const fetchSubject = async () => {
        const recordList = await fetchAll();
        executeFnOrOpenSnackbar((v) => subject.next(v), recordList)
        return getResultElseNull(recordList);
    };

    // Fetch first
    fetchSubject();
    return {
        subscribe: (setState: (arr: T[] | null) => void) => subject.subscribe(setState),
        unsubscribe: () => subject.unsubscribe(),
        lazyFetchAll: async () => {
            const currentValue = subject.value;
            if (currentValue) {
                return Promise.resolve(currentValue)
            } else {
                const res = fetchSubject();
                return isApiError(res) ? [] : (res as Promise<T[]>);
            }
        },
        fetchAll: fetchSubject,
    };
}
export function buildRecordSubject<T extends BaseCRUDRecord, D>({ createOne, updateOne, deleteOne, fetchAll }: CRUDSubjectProps<T, D>): CRUDSubject<T, D> {
    const subject = new BehaviorSubject<T[] | null>(null);
    const fetchSubject = async () => {
        const recordList = await fetchAll();
        executeFnOrOpenSnackbar(v => subject.next(v), recordList)
        return getResultElseNull(recordList);
    };
    // Fetch first
    fetchSubject();
    return {
        subscribe: (setState: (arr: T[] | null) => void) => subject.subscribe(setState),
        unsubscribe: () => subject.unsubscribe(),
        createOne: async (draftRecord) => {
            const newRecordOrError = await createOne(draftRecord);
            if (isApiError(newRecordOrError)) {
                const apiError = newRecordOrError as ApiError;
                snackbarSubject.openSnackbar({ title: apiError.error, level: LogLevel.ERROR })
            } else {
                const newRecord = newRecordOrError as T;
                subject.next([...(subject.value || []), newRecord]);
                snackbarSubject.openSnackbar({ title: 'Record created', level: LogLevel.SUCCESS })
            }
            return getResultElseNull(newRecordOrError);
        },
        updateOne: async (record) => {
            const updatedRecordOrError = await updateOne(record);
            if (isApiError(updatedRecordOrError)) {
                const apiError = updatedRecordOrError as ApiError;
                snackbarSubject.openSnackbar({ title: apiError.error, level: LogLevel.ERROR })
            } else {
                const updatedRecord = updatedRecordOrError as T;
                subject.next(subject.value?.map(r => r.id === updatedRecord.id ? updatedRecord : r) || [updatedRecord]);
                snackbarSubject.openSnackbar({ title: 'Record updated', level: LogLevel.SUCCESS })
            }
            return getResultElseNull(updatedRecordOrError);
        },
        deleteOne: async (id) => {
            const isDeletedOrError = await deleteOne(id);
            if (isApiError(isDeletedOrError)) {
                const apiError = isDeletedOrError as ApiError;
                snackbarSubject.openSnackbar({ title: apiError.error, level: LogLevel.ERROR })
            } else {
                subject.next(subject.value?.filter(r => r.id !== id) || []);
                snackbarSubject.openSnackbar({ title: 'Record deleted', level: LogLevel.SUCCESS })
            }
            return getResultElseNull(isDeletedOrError);
        },
        lazyFetchAll: async () => {
            const currentValue = subject.value;
            if (currentValue) {
                return Promise.resolve(currentValue)
            } else {
                const sub = await fetchSubject();
                return sub || [];
            }
        },
        fetchAll: fetchSubject
    };

}