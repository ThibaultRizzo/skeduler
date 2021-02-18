import { getCompany, getCompanies } from './../api/company.api';
import { BehaviorSubject } from "rxjs"
import { Company } from "../types";
import { tokenSubject } from "./auth.subject";
import { executeFnOrOpenSnackbar, getResultElseNull } from './crud.subject';
import { ApiError, isApiError } from '../api/helper';
import { Dispatch, SetStateAction } from 'react';

export const companySubject = function () {
    const subject = new BehaviorSubject<Company | null>(null);

    const fetchCompany = async (id: string) => {
        // TODO: When auth is coded --> const company = await getCompany(id);
        const company = await getCompanies().then(c => isApiError(c) ? (c as ApiError) : ((c as Company[])[0] as Company))
        executeFnOrOpenSnackbar((v) => subject.next(v), company)
        return getResultElseNull(company);
    };
    tokenSubject.subject.subscribe(async v => v !== null ? await fetchCompany(tokenSubject.parseToken() as string) : null)
    return {
        subject,
        // rule
        unsubscribe: (setState: Dispatch<SetStateAction<Company | null>>) => {
            const sub = companySubject.subject.subscribe(c => setState(c));
            return () => {
                sub.unsubscribe();
            }
        },
        fetchCompany
    }
}()