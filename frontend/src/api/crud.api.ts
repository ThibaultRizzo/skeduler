import { AxiosResponse } from "axios"
import { DocumentNode } from "graphql"
import httpWrapper from "../http"
import { Mutation, Query } from "../types"
import { ApiResponse, getResultOrError, Payload } from "./helper"

type QueryResponse = AxiosResponse<{ data: Query; }>
type MutationResponse = AxiosResponse<{ data: Mutation; }>

type InputCRUDDictionary<R> = {
    create: [DocumentNode, (r: MutationResponse) => Payload<R> | null | undefined],
    read: [DocumentNode, (r: QueryResponse) => Payload<R> | null | undefined],
    readAll: [DocumentNode, (r: QueryResponse) => Payload<R[]> | null | undefined],
    update: [DocumentNode, (r: MutationResponse) => Payload<R> | null | undefined],
    delete: [DocumentNode, (r: MutationResponse) => Payload<boolean> | null | undefined],
}


type OutputCRUDDictionary<C, U, R> = {
    create: (input: C) => ApiResponse<R>,
    read: (id: string) => ApiResponse<R>,
    readAll: () => ApiResponse<R[]>,
    update: (id: U) => ApiResponse<R>,
    delete: (id: string) => ApiResponse<boolean>,
}

export const buildCreateUpdateApi = <C, R>(doc: DocumentNode, getter: (r: MutationResponse) => Payload<R> | null | undefined) => {
    return async (input: C) => {
        const res = await httpWrapper.mutation(doc, { input });
        return getResultOrError(getter(res));
    }
}

export const buildDeleteApi = (doc: DocumentNode, getter: (r: MutationResponse) => Payload<boolean> | null | undefined) => {
    return async (id: string) => {
        const res = await httpWrapper.mutation(doc, { id });
        return getResultOrError(getter(res));
    }
}

export const buildReadApi = <R>(doc: DocumentNode, getter: (r: QueryResponse) => Payload<R> | null | undefined) => {
    return async (id: string) => {
        const res = await httpWrapper.query(doc, { id });
        return getResultOrError(getter(res));
    }
}


export const buildReadAllApi = <R>(doc: DocumentNode, getter: (r: QueryResponse) => Payload<R> | null | undefined) => {
    return async () => {
        const res = await httpWrapper.query(doc);
        return getResultOrError(getter(res));
    }
}


export const buildCRUDApi = <C, U, R>(dict: InputCRUDDictionary<R>): OutputCRUDDictionary<C, U, R> => {
    return {
        create: buildCreateUpdateApi(...dict.create),
        read: buildReadApi(...dict.read),
        readAll: buildReadAllApi(...dict.readAll),
        update: buildCreateUpdateApi(...dict.update),
        delete: buildDeleteApi(...dict.delete),
    }
}