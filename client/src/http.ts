import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { DocumentNode, print } from 'graphql';
import { Mutation, Query } from "./types";

const GRAPHQL_ENDPOINT = '/graphql';


const query = (query: DocumentNode, queryVariables?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<{ data: Query }>> => {
    try {
        const variables = queryVariables ? { variables: queryVariables } : null;
        return axios.post<{ data: Query }>(GRAPHQL_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
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
        return axios.post<{ data: Mutation }>(GRAPHQL_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
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