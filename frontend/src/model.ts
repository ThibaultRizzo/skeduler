import { CreateEmployeeInput, Shift, Employee, EmployeeEvent, CreateEventInput, CreateSequenceRuleInput, CompanySequenceRule, CompanyTransitionRule, CreateTransitionRuleInput, EmployeeAvailability, DayEnum } from "./types";


export type DraftEmployee = CreateEmployeeInput

export type Draft<T> = Omit<T, 'id'>;

export type WithId<T> = T & {
    id: string;
}

export function employeetoDraft({ id, skills, ...employee }: Employee): DraftEmployee {
    return {
        ...employee,
        skills: skills.map(({ shiftId, level }) => ({ level, shiftId: shiftId })) || []
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

export function getEmployeeDays(employee: Employee, availability: EmployeeAvailability): string[] {
    const days = Object.keys(DayEnum);
    return [
        employee.availabilityMonday,
        employee.availabilityTuesday,
        employee.availabilityWednesday,
        employee.availabilityThursday,
        employee.availabilityFriday,
        employee.availabilitySaturday,
        employee.availabilitySunday
    ].map((a, i) => a === availability ? days[i] : null).filter(Boolean) as string[];
}