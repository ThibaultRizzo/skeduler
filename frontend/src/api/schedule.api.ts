import { GET_SCHEDULE } from './../graphql/schedule.graph';
import { GENERATE_SCHEDULE } from '../graphql/schedule.graph';
import httpWrapper from '../http';
import { CompleteSchedule, GenerateScheduleInput } from '../types';
import { ApiResponse, getResultOrError } from './helper';

export const getSchedule = async (): ApiResponse<CompleteSchedule> => {
    const res = await httpWrapper.query(GET_SCHEDULE);
    return getResultOrError(res.data.data.schedule);
}

export const generateSchedule = async (): ApiResponse<CompleteSchedule> => {
    const input: GenerateScheduleInput = {
        nbWeeks: 1,
        startDate: new Date(2021, 1, 2).toISOString()
    }
    const res = await httpWrapper.mutation(GENERATE_SCHEDULE, {
        input
    });
    return getResultOrError(res.data.data.generateSchedule)
}
