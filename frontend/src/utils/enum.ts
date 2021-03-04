import { EmployeeAvailability, EventNature, EventStatus, EventType, RulePenalty, SequenceRuleType, ShiftImportance } from "../types";

export const getEnumKey = (enumObj: { [key: string]: string }, value: string): string => {
    const res = Object.entries(enumObj).find(([k, v]) => v === value);
    return res ? res[0] : "";
}

export type Enumerable<T extends Object> = { [key: string]: T };
export type EnumFactory<T> = {
    enumType: Enumerable<T>;
    list: T[]
}
export const enumFactory = <T>(enumType: Enumerable<T>): EnumFactory<T> => {
    const list = Object.values(enumType);
    return {
        enumType,
        list
    }
}


export const employeeAvailabilityFactory = enumFactory(EmployeeAvailability);
export const shiftImportanceFactory = enumFactory(ShiftImportance);
export const eventNatureFactory = enumFactory(EventNature);
export const eventStatusFactory = enumFactory(EventStatus);
export const eventTypeFactory = enumFactory(EventType);
export const sequenceRuleTypeFactory = enumFactory(SequenceRuleType);
export const rulePenaltyFactory = enumFactory(RulePenalty);
