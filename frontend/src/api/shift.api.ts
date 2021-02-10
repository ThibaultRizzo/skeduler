import { UPDATE_SHIFT } from './../graphql/shift.graph';
import { Draft } from "../model";
import { CREATE_SHIFT, DELETE_SHIFT, GET_SHIFTS } from '../graphql/shift.graph';
import httpWrapper from '../http';
import { Shift } from '../types';
import { ApiError, getResultOrError } from './helper';


export const createShift = async (input: Draft<Shift>): Promise<Shift | ApiError> => {
    const res = await httpWrapper.mutation(CREATE_SHIFT, { input });
    return getResultOrError(res.data.data.createShift);
}

export const updateShift = async (input: Shift): Promise<Shift | null> => {
    const res = await httpWrapper.mutation(UPDATE_SHIFT, { input });
    return res.data.data.updateShift?.result || null;
}

export const deleteShift = async (id: string): Promise<boolean> => {
    const res = await httpWrapper.mutation(DELETE_SHIFT, { id });
    return res.data.data.deleteShift.success || false;
}

export const getShifts = async (): Promise<Shift[]> => {
    const res = await httpWrapper.query(GET_SHIFTS);
    return res.data.data.shifts.result || [];
}