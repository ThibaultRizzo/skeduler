import { useEffect, useState } from "react";
import { ApiResponse } from "../api/helper";
import { BaseCRUDRecord, executeFnOrOpenSnackbar, SimpleSubjectProp } from "../rxjs/crud.subject";

export function useAsyncState<T>(initialState: T, asyncLoader: () => ApiResponse<T>, filterData?: (data: T) => T): [state: T, setState: (s: T) => void] {
    const [state, setState] = useState(initialState);
    useEffect(() => {
        asyncLoader().then(dataOrError => {
            executeFnOrOpenSnackbar(v => setState(v), dataOrError)
        })
    }, [asyncLoader]);
    return [state, setState];
}

export function useSubject<T extends BaseCRUDRecord>(initialState: T[] | null, subject: SimpleSubjectProp<T>): [state: T[] | null, setState: (s: T[] | null) => void] {
    const [state, setState] = useState<T[] | null>(initialState);

    useEffect(() => {
        const sub = subject.subscribe(setState);
        return function cleanup() {
            sub.unsubscribe();
        }
    }, [subject]);
    return [state, setState];
}