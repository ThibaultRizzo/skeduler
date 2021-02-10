import { GET_SCHEDULE } from './../graphql/schedule.graph';
import { GENERATE_SCHEDULE } from '../graphql/schedule.graph';
import httpWrapper from '../http';
import { CompleteSchedule, GenerateScheduleInput } from '../types';

export const getSchedule = async (): Promise<CompleteSchedule | null> => {
    const res = await httpWrapper.query(GET_SCHEDULE);
    return res.data.data.schedule.result || null;
}

export const generateSchedule = async (): Promise<CompleteSchedule | null> => {
    const input: GenerateScheduleInput = {
        nbWeeks: 1,
        startDate: new Date(2021, 1, 2).toISOString()
    }
    const res = await httpWrapper.mutation(GENERATE_SCHEDULE, {
        input
    });
    return res.data.data.generateSchedule?.result || null
}
