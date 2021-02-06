import React from 'react';
import { Subject } from 'rxjs'
import { renderComponent } from '../utils/layout';

const subject = new Subject<SidebarState>();

type SidebarState = {
    // TODO: Remove any
    renderComponent: (() => React.FunctionComponentElement<any> | null) | null,
    title: string
}


const initialState: SidebarState = {
    renderComponent: null,
    title: ''
};

let state = initialState;

const sidebarStore = {
    init: () => subject.next(state),
    subscribe: (setState: React.Dispatch<React.SetStateAction<SidebarState>>) => subject.subscribe(setState),
    openSidebar: <P extends {}>(title: string, component: React.FunctionComponent<P> | null, props?: P) => {
        state = {
            ...state,
            renderComponent: () => renderComponent(component, props),
            title
        };
        subject.next(state);
    },
    closeSidebar: () => {
        state = {
            ...state,
            renderComponent: null,
            title: ''
        }
        subject.next(state)
    },
    isSidebarOpen: () => state.renderComponent !== null,
    initialState

}

export default sidebarStore;