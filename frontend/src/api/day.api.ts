import { SET_DAY_ACTIVATION } from '../graphql/day.graph';
import { GET_DAYS } from '../graphql/day.graph';
import httpWrapper from '../http';
import { Day } from '../types';

export const getDays = async (): Promise<Day[]> => {
    const res = await httpWrapper.query(GET_DAYS);
    return res.data.data.days.result?.sort((a, b) => (a.name.value - b.name.value)) || [];
}

export const setDayActivation = async ({ id, active }: Day): Promise<Day | null> => {
    const input = { id, active: !active };
    const res = await httpWrapper.mutation(SET_DAY_ACTIVATION, { input });
    return res.data.data.toggleDayActivation?.result || null;
}