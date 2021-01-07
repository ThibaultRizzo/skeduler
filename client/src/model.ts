import { CreateEmployeeInput } from './types.d';
import { Employee } from "./types";


export interface Shift {
    id: string;
    title: string;
    duration: number;
}


export type DraftShift = Omit<Shift, 'id'>

export type DraftEmployee = Omit<Employee, 'id' | 'workingDays' | 'skills'> & Pick<CreateEmployeeInput, 'workingDays' | 'skills'>;

export type Draft<T> = Omit<T, 'id'>;