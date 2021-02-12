import axios, { AxiosRequestConfig, AxiosResponse, AxiosTransformer } from "axios";
import { isValid, parseISO } from "date-fns";
import { DocumentNode, print } from 'graphql';
import { Mutation, Query } from "./types";

const GRAPHQL_ENDPOINT = '/graphql';

const baseAxios = axios.create();

function reviver(key: string, value: any) {
    if (typeof value === "string") {
        const date = parseISO(value)
        if (isValid(date)) {
            return date;
        }
    }
    return value;
}
function dateParser(data: string) {
    return JSON.parse(data, reviver)
}
baseAxios.defaults.headers.post['Content-Type'] = "application/json";
baseAxios.defaults.transformResponse = [
    dateParser,
    ...(axios.defaults.transformResponse as AxiosTransformer[]),
]

const query = (query: DocumentNode, queryVariables?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<{ data: Query }>> => {
    try {
        const variables = queryVariables ? { variables: queryVariables } : null;
        return baseAxios.post<{ data: Query }>(GRAPHQL_ENDPOINT, {
            method: "POST",
            query: print(query),
            ...variables,
            ...config
        });
    } catch (e: any) {
        throw new Error(e);
    }
};

const mutation = (mutation: DocumentNode, mutationVariables?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<{ data: Mutation }>> => {
    try {
        const variables = mutationVariables ? { variables: mutationVariables } : null;
        return baseAxios.post<{ data: Mutation }>(GRAPHQL_ENDPOINT, {
            method: "POST",
            query: print(mutation),
            ...variables,
            ...config
        });
    } catch (e: any) {
        throw new Error(e);
    }
}

const httpWrapper = {
    query,
    mutation,
}

export default httpWrapper;