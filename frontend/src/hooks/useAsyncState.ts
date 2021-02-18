import { useEffect, useState } from "react";
import { BehaviorSubject } from "rxjs";
import { ApiResponse } from "../api/helper";
import { BaseCRUDRecord, executeFnOrOpenSnackbar, SimpleSubject } from "../rxjs/crud.subject";

export function useAsyncState<T, A = []>(initialState: T, asyncLoader: (...args: A[]) => ApiResponse<T>, args: A[] = [], filterData?: (data: T) => T): [state: T, setState: (s: T) => void] {
    const [state, setState] = useState(initialState);
    useEffect(() => {
        asyncLoader(...args).then(dataOrError => {
            executeFnOrOpenSnackbar(v => setState(v), dataOrError)
        })
    }, [asyncLoader]);
    return [state, setState];
}

export function useIterableSubject<T extends BaseCRUDRecord>(initialState: T[] | null, subject: SimpleSubject<T>): [state: T[] | null, setState: (s: T[] | null) => void] {
    const [state, setState] = useState<T[] | null>(initialState);

    useEffect(() => {
        const sub = subject.subscribe(setState);
        return function cleanup() {
            sub.unsubscribe();
        }
    }, [subject]);
    return [state, setState];
}

export function useSubject<T extends BaseCRUDRecord>(initialState: T | null, subject: BehaviorSubject<T | null>): [state: T | null, setState: (s: T | null) => void] {
    const [state, setState] = useState<T | null>(initialState);

    useEffect(() => {
        const sub = subject.subscribe(setState);
        return function cleanup() {
            sub.unsubscribe();
        }
    }, [subject]);
    return [state, setState];
}