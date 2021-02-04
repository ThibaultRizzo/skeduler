import { CreateEmployeeInput } from './types.d';
import { Employee } from "./types";


export interface Shift {
    id: string;
    title: string;
    duration: number;
}


export type DraftShift = Omit<Shift, 'id'>

export type DraftEmployee = CreateEmployeeInput
export type UpdatedEmployee = Omit<Employee, 'id' | 'workingDays' | 'skills'> & Pick<CreateEmployeeInput, 'workingDays' | 'skills'>;


export type Draft<T> = Omit<T, 'id'>;

export type WithId<T> = T & {
    id: string;
}

export function employeetoDraft({ contract, name, skills, workingDays }: Employee): DraftEmployee {
    return {
        contract, name,
        skills: skills.map(({ shift, level }) => ({ level, shift: shift.id })) || [],
        workingDays: workingDays?.map(d => d.name.name) || []
    }
}


export function shifttoDraft({ title, duration }: Shift): DraftShift {
    return {
        duration,
        title
    }
}