import { UPDATE_SHIFT } from '../graphql/shift.graph';
import { Draft } from "../model";
import { CREATE_SHIFT, DELETE_SHIFT, GET_SHIFTS } from '../graphql/shift.graph';
import httpWrapper from '../http';
import { Shift } from '../types';
import { ApiResponse, getResultOrError } from './helper';


export const createShift = async (input: Draft<Shift>): ApiResponse<Shift> => {
    const res = await httpWrapper.mutation(CREATE_SHIFT, { input });
    return getResultOrError(res.data.data.createShift);
}

export const updateShift = async (input: Shift): ApiResponse<Shift> => {
    const res = await httpWrapper.mutation(UPDATE_SHIFT, { input });
    return getResultOrError(res.data.data.updateShift);
}

export const deleteShift = async (id: string): ApiResponse<boolean> => {
    const res = await httpWrapper.mutation(DELETE_SHIFT, { id });
    return getResultOrError(res.data.data.deleteShift);
}

export const getShifts = async (): ApiResponse<Shift[]> => {
    const res = await httpWrapper.query(GET_SHIFTS);
    return getResultOrError(res.data.data.shifts);
}