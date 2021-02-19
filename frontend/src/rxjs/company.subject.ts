import { BehaviorArrayLikeSubject } from './subject';
import { getCompany, getCompanies, createSequenceRule, updateSequenceRule, deleteSequenceRule, getSequenceRules, createTransitionRule, deleteTransitionRule, getTransitionRules, updateTransitionRule } from './../api/company.api';
import { BehaviorSubject } from "rxjs"
import { Company, CompanySequenceRule, CompanyTransitionRule } from "../types";
import { tokenSubject } from "./auth.subject";
import { executeFnOrOpenSnackbar, getResultElseNull, buildCUDRecordSubject, buildReadListSubject } from './crud.subject';
import { ApiError, isApiError } from '../api/helper';
import { Dispatch, SetStateAction } from 'react';

export const buildCompanySubject = function () {
    const subject = new BehaviorSubject<Company | null>(null);

    const fetchCompany = async (id: string) => {
        // TODO: When auth is coded --> const company = await getCompany(id);
        const company = await getCompanies().then(c => isApiError(c) ? (c as ApiError) : ((c as Company[])[0] as Company))
        executeFnOrOpenSnackbar((v) => subject.next(v), company)
        return getResultElseNull(company);
    };
    tokenSubject.subject.subscribe(async v => v !== null ? await fetchCompany(tokenSubject.parseToken() as string) : null)
    subject.subscribe(s => sessionStorage.setItem('companyId', s ? s.id : ""))
    return {
        subject,
        // rule
        unsubscribe: (setState: Dispatch<SetStateAction<Company | null>>) => {
            const sub = subject.subscribe(c => setState(c));
            return () => {
                sub.unsubscribe();
            }
        },
        fetchCompany
    }
}

export const companySubject = buildCompanySubject();

export const sequenceRuleSubject = function () {
    const subject = new BehaviorArrayLikeSubject<CompanySequenceRule>(null);
    const readSubject = buildReadListSubject<CompanySequenceRule, string>(getSequenceRules, false, subject);

    companySubject.subject.subscribe(s => {
        if (s) {
            readSubject.fetchAll(s.id)
        }
    })
    return {
        subject,
        ...readSubject,
        ...buildCUDRecordSubject({
            createOne: createSequenceRule,
            updateOne: updateSequenceRule,
            deleteOne: deleteSequenceRule,
        }, subject)
    }
}()

export const transitionRuleSubject = function () {
    const subject = new BehaviorArrayLikeSubject<CompanyTransitionRule>(null);
    const readSubject = buildReadListSubject<CompanyTransitionRule, string>(getTransitionRules, false, subject);

    companySubject.subject.subscribe(s => {
        if (s) {
            readSubject.fetchAll(s.id)
        }
    })
    return {
        subject,
        ...readSubject,
        ...buildCUDRecordSubject({
            createOne: createTransitionRule,
            updateOne: updateTransitionRule,
            deleteOne: deleteTransitionRule,
        }, subject)
    }
}()