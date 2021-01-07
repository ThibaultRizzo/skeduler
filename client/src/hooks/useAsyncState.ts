import { useEffect, useState } from "react";

export function useAsyncState<T>(initialState: T, asyncLoader: () => Promise<T>, filterData?: (data: T) => T): [state: T, setState: (s: T) => void] {
    const [state, setState] = useState(initialState);

    useEffect(() => {
        asyncLoader().then(data => {
            setState(data)
        })
    }, [asyncLoader]);
    return [state, setState];
}