import { CreateEmployeeInput, Shift, Employee, EmployeeEvent, CreateEventInput } from "./types";


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

export function employeeEventToDraft({ id, shift, employee, endDate, ...event }: EmployeeEvent, employeeId: string): CreateEventInput {
    return { employee: employeeId, shift: shift?.id, ...event }
}


export function shifttoDraft({ id, ...rest }: Shift): Draft<Shift> {
    return rest
}