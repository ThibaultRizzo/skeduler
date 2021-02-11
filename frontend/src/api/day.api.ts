import { ApiResponse, getResultOrError, isApiError } from './helper';
import { SET_DAY_ACTIVATION } from '../graphql/day.graph';
import { GET_DAYS } from '../graphql/day.graph';
import httpWrapper from '../http';
import { Day } from '../types';

export const getDays = async (): ApiResponse<Day[]> => {
    const res = await httpWrapper.query(GET_DAYS);
    const result = getResultOrError(res.data.data.days);
    return isApiError(result) || !result ? result : (result as Day[]).sort((a, b) => (a.name.value - b.name.value))

}

export const setDayActivation = async ({ id, active }: Day): ApiResponse<Day> => {
    const input = { id, active: !active };
    const res = await httpWrapper.mutation(SET_DAY_ACTIVATION, { input });
    return getResultOrError(res.data.data.toggleDayActivation);
}