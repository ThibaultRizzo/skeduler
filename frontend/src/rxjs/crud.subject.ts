import { WithId } from '../model';
import { BehaviorSubject, Subscription } from "rxjs"
import snackbarSubject, { LogLevel } from "./snackbar.subject";
import { ApiError, isApiError } from '../api/helper';

/*********
 * Types *
 *********/
export type BaseCRUDRecord = {
    id: string
}

export type CUD<T, D, U = WithId<D>, R = null> = {
    createOne: (draftRecord: D) => Promise<T | R>,
    updateOne: (record: U) => Promise<T | R>,
    deleteOne: (id: string) => Promise<boolean | R>,
}
export type Read<T, R> = {
    fetchAll: () => Promise<T[] | R>;
}


export type ReadSubjectProps<T extends BaseCRUDRecord> = Read<T, ApiError>
export type CUDSubjectProps<T extends BaseCRUDRecord, D, U = WithId<D>> = CUD<T, D, U, ApiError>
export type CRUDSubjectProps<T extends BaseCRUDRecord, D, U = WithId<D>> = ReadSubjectProps<T> & CUDSubjectProps<T, D, U>;



export type SimpleSubject<T extends BaseCRUDRecord> = {
    subscribe: (setState: (d: T[] | null) => void) => Subscription,
    unsubscribe: () => void
}
export type ReadSubject<T extends BaseCRUDRecord> = Read<T, null> & SimpleSubject<T> & {
    lazyFetchAll: () => Promise<T[]>
}
export type CUDSubject<T extends BaseCRUDRecord, D, U = WithId<D>> = CUD<T, D, U, null> & SimpleSubject<T>
export type CRUDSubject<T extends BaseCRUDRecord, D, U = WithId<D>> = ReadSubject<T> & CUDSubject<T, D, U>


/***********
 * Helpers *
 ***********/
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

/*********************
 * Subject factories *
 *********************/
export function buildSimpleSubject<T extends BaseCRUDRecord>(injectedSubject?: BehaviorSubject<T[] | null>): SimpleSubject<T> {
    const subject = injectedSubject ? injectedSubject : new BehaviorSubject<T[] | null>(null);
    return {
        subscribe: (setState: (arr: T[] | null) => void) => subject.subscribe(setState),
        unsubscribe: () => subject.unsubscribe()
    };
}

export function buildReadonlyRecordSubject<T extends BaseCRUDRecord>({ fetchAll }: ReadSubjectProps<T>, injectedSubject?: BehaviorSubject<T[] | null>): ReadSubject<T> {
    const subject = injectedSubject ? injectedSubject : new BehaviorSubject<T[] | null>(null);
    const fetchSubject = async () => {
        const recordList = await fetchAll();
        executeFnOrOpenSnackbar((v) => subject.next(v), recordList)
        return getResultElseNull(recordList);
    };

    // Fetch first
    fetchSubject();
    return {
        ...buildSimpleSubject(subject),
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

export function buildCUDRecordSubject<T extends BaseCRUDRecord, D, U>({ createOne, updateOne, deleteOne }: CUDSubjectProps<T, D, U>, s?: BehaviorSubject<T[] | null>): CUDSubject<T, D, U> {
    const subject = s ? s : new BehaviorSubject<T[] | null>(null);

    return {
        ...buildSimpleSubject(subject),
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
    }
}


export function buildRecordSubject<T extends BaseCRUDRecord, D>({ createOne, updateOne, deleteOne, fetchAll }: CRUDSubjectProps<T, D>): CRUDSubject<T, D> {
    const subject = new BehaviorSubject<T[] | null>(null);

    return {
        ...buildReadonlyRecordSubject({ fetchAll }, subject),
        ...buildCUDRecordSubject({ createOne, updateOne, deleteOne }, subject)
    };

}