import { CreateEmployeeInput, Shift, Employee } from "./types";


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


export function shifttoDraft({ id, ...rest }: Shift): Draft<Shift> {
    return rest
}