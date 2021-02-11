import { Maybe } from '../types'
export enum ApiErrorOrigin {
    graphql = 'graphql',
    unknown = 'unknown'
}

export type ApiResponse<T> = Promise<T | ApiError>

export type ApiError = {
    error: string;
    origin: ApiErrorOrigin;
}

export type Payload<T> = {
    result?: Maybe<T>;
    success: boolean;
    errors?: string[] | null;
}

// TODO: Make better matching func
export const isApiError = (v: any): boolean => {
    return !!v && !!v.error && !!v.origin
}

export const getResultOrError = <T>(payload: Payload<T> | null | undefined): T | ApiError => {
    if (payload && payload.success) {
        return payload.result as T;
    } else if (payload && !payload.success && payload.errors && payload.errors.length > 0) {
        return {
            error: !!payload.errors ? payload.errors.join(',') : '',
            origin: ApiErrorOrigin.graphql // TODO: Get actual origin
        }
    } else {
        return {
            error: 'Something went wrong',
            origin: ApiErrorOrigin.unknown
        }
    }
}