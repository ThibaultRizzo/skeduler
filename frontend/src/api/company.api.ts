import { CREATE_TRANSITION_RULE, GET_SEQUENCE_RULES, UPDATE_TRANSITION_RULE, DELETE_TRANSITION_RULE, GET_TRANSITION_RULES } from './../graphql/company.graph';
import { CREATE_COMPANY, DELETE_COMPANY, GET_COMPANY, GET_COMPANIES, UPDATE_COMPANY, CREATE_SEQUENCE_RULE, UPDATE_SEQUENCE_RULE, DELETE_SEQUENCE_RULE } from '../graphql/company.graph';
import { buildCreateUpdateApi, buildDeleteApi, buildReadAllApi, buildReadApi } from './crud.api';

export const createCompany = buildCreateUpdateApi(CREATE_COMPANY, res => res.data.data.createCompany)
export const updateCompany = buildCreateUpdateApi(UPDATE_COMPANY, res => res.data.data.updateCompany)
export const deleteCompany = buildDeleteApi(DELETE_COMPANY, res => res.data.data.deleteCompany)
export const getCompany = buildReadApi(GET_COMPANY, res => res.data.data.company);
export const getCompanies = buildReadAllApi(GET_COMPANIES, res => res.data.data.companies);

export const createSequenceRule = buildCreateUpdateApi(CREATE_SEQUENCE_RULE, res => res.data.data.createSequenceRule)
export const updateSequenceRule = buildCreateUpdateApi(UPDATE_SEQUENCE_RULE, res => res.data.data.updateSequenceRule)
export const deleteSequenceRule = buildDeleteApi(DELETE_SEQUENCE_RULE, res => res.data.data.deleteSequenceRule)
export const getSequenceRules = buildReadAllApi(GET_SEQUENCE_RULES, res => res.data.data.sequenceRules);

export const createTransitionRule = buildCreateUpdateApi(CREATE_TRANSITION_RULE, res => res.data.data.createTransitionRule)
export const updateTransitionRule = buildCreateUpdateApi(UPDATE_TRANSITION_RULE, res => res.data.data.updateTransitionRule)
export const deleteTransitionRule = buildDeleteApi(DELETE_TRANSITION_RULE, res => res.data.data.deleteTransitionRule)
export const getTransitionRules = buildReadAllApi(GET_TRANSITION_RULES, res => res.data.data.transitionRules);