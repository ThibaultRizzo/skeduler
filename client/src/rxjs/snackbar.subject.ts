import React from 'react';
import { BehaviorSubject } from 'rxjs'

export enum LogLevel {
    ERROR = 'ERROR', WARNING = 'WARNING', INFO = 'INFO', SUCCESS = 'SUCCESS'
}


type SnackbarState = {
    level: LogLevel | null,
    title: string,
    message?: string
}


const initialState: SnackbarState = {
    level: null,
    title: '',
    message: ''
};

const subject = new BehaviorSubject<SnackbarState>(initialState);


const DEFAULT_TIMING = 2000;

let state = initialState;

const closeSnackbar = () => subject.next(initialState)

const snackbarSubject = {
    init: () => subject.next(state),
    subscribe: (setState: React.Dispatch<React.SetStateAction<SnackbarState>>) => subject.subscribe(setState),
    openSnackbar: (input: SnackbarState, timing = DEFAULT_TIMING) => {
        state = {
            ...input
        };
        subject.next(state);
        setTimeout(closeSnackbar, timing)
    },
    value: subject.value,
    closeSnackbar,
    initialState

}

export default snackbarSubject;