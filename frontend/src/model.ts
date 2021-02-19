import { CreateEmployeeInput, Shift, Employee, EmployeeEvent, CreateEventInput, CreateSequenceRuleInput, CompanySequenceRule, CompanyTransitionRule, CreateTransitionRuleInput } from "./types";


export type DraftEmployee = CreateEmployeeInput
export type UpdatedEmployee = Omit<Employee, 'id' | 'workingDays' | 'skills'> & Pick<CreateEmployeeInput, 'workingDays' | 'skills'>;


export type Draft<T> = Omit<T, 'id'>;

export type WithId<T> = T & {
    id: string;
}

export function employeetoDraft({ contract, name, skills, workingDays }: Employee): DraftEmployee {
    return {
        contract, name,
        skills: skills.map(({ shiftId, level }) => ({ level, shiftId: shiftId })) || [],
        workingDays: workingDays?.map(d => d.name) || []
    }
}

export function employeeEventToDraft({ id, shift, employee, endDate, ...event }: EmployeeEvent, employeeId: string): CreateEventInput {
    return { employeeId: employeeId, shiftId: shift?.id, ...event }
}


export function shifttoDraft({ id, ...rest }: Shift): Draft<Shift> {
    return rest
}

export function sequenceRuleToDraft({ id, ...rest }: CompanySequenceRule): CreateSequenceRuleInput {
    return rest;
}

export function transitionRuleToDraft({ id, ...rest }: CompanyTransitionRule): CreateTransitionRuleInput {
    return rest;
}