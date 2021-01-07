import { DraftShift, Shift } from "../model";
import { CREATE_SHIFT, DELETE_SHIFT, GET_SHIFTS } from '../components/graphql/shift.graph';
import httpWrapper from '../http';


export const createShift = async (input: DraftShift): Promise<Shift | null> => {
    const res = await httpWrapper.mutation(CREATE_SHIFT, { input });
    return res.data.data.createShift?.result || null;
}

export const deleteShift = async (id: string): Promise<boolean> => {
    const res = await httpWrapper.mutation(DELETE_SHIFT, { id });
    return res.data.data.deleteShift.success || false;
}

export const getShifts = async (): Promise<Shift[]> => {
    const res = await httpWrapper.query(GET_SHIFTS);
    return res.data.data.shifts.result || [];
}