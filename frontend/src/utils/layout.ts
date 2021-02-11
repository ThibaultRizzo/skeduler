import { createElement, FunctionComponent } from "react";

export const renderComponent = <T extends {}>(component: FunctionComponent<T> | null, props?: T | null) => {
    return component ? createElement(component, props) : null;
}

export const iter = (nb: number) => Array.from(new Array(nb), (_, i) => i);