import { ApiResponse, getResultOrError } from './helper';
import { SET_DAY_ACTIVATION } from '../graphql/day.graph';
import { GET_DAYS } from '../graphql/day.graph';
import httpWrapper from '../http';
import { Day } from '../types';

export const getDays = async (): ApiResponse<Day[]> => {
    const res = await httpWrapper.query(GET_DAYS);
    const sortByOrder = (d: Day[]) => d.sort((a, b) => (a.order - b.order))
    return getResultOrError(res.data.data.days, sortByOrder);

}

export const setDayActivation = async ({ id, active }: Day): ApiResponse<Day> => {
    const input = { id, active: !active };
    const res = await httpWrapper.mutation(SET_DAY_ACTIVATION, { input });
    return getResultOrError(res.data.data.setDayActivation);
}