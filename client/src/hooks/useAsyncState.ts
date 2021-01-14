import { useEffect, useState } from "react";
import { BaseCRUDRecord, SimpleSubjectProp } from "../rxjs/crud.subject";

export function useAsyncState<T>(initialState: T, asyncLoader: () => Promise<T>, filterData?: (data: T) => T): [state: T, setState: (s: T) => void] {
    const [state, setState] = useState(initialState);

    useEffect(() => {
        asyncLoader().then(data => {
            setState(data)
        })
    }, [asyncLoader]);
    return [state, setState];
}

export function useSubject<T extends BaseCRUDRecord>(initialState: T[] | null, subject: SimpleSubjectProp<T>): [state: T[] | null, setState: (s: T[] | null) => void] {
    const [state, setState] = useState<T[] | null>(initialState);

    useEffect(() => {
        subject.subscribe(setState);
    }, [subject]);
    return [state, setState];
}