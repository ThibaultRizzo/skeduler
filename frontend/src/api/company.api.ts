import { CompanySummary } from './../types';
import { Draft } from "../model";
import { CREATE_COMPANY, DELETE_COMPANY, GET_COMPANY, GET_COMPANIES, UPDATE_COMPANY } from '../graphql/company.graph';
import httpWrapper from '../http';
import { Company } from '../types';
import { ApiResponse, getResultOrError } from './helper';


export const createCompany = async (input: Draft<Company>): ApiResponse<CompanySummary> => {
    const res = await httpWrapper.mutation(CREATE_COMPANY, { input });
    return getResultOrError(res.data.data.createCompany);
}

export const updateCompany = async (input: Company): ApiResponse<CompanySummary> => {
    const res = await httpWrapper.mutation(UPDATE_COMPANY, { input });
    return getResultOrError(res.data.data.updateCompany);
}

export const deleteCompany = async (id: string): ApiResponse<boolean> => {
    const res = await httpWrapper.mutation(DELETE_COMPANY, { id });
    return getResultOrError(res.data.data.deleteCompany);
}

export const getCompany = async (id: string): ApiResponse<CompanySummary> => {
    const res = await httpWrapper.query(GET_COMPANY);
    return getResultOrError(res.data.data.company);
}

export const getCompanies = async (): ApiResponse<CompanySummary[]> => {
    const res = await httpWrapper.query(GET_COMPANIES);
    return getResultOrError(res.data.data.companies);
}