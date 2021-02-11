import { getDays, setDayActivation } from '../api/day.api';
import { createEmployee, createEmployeeEvent, deleteEmployee, deleteEmployeeEvent, getEmployeeEvents, getEmployees, updateEmployee, updateEmployeeEvent } from '../api/employee.api';
import { createShift, deleteShift, getShifts, updateShift } from '../api/shift.api';
import { Draft, DraftEmployee } from '../model';
import { CreateEventInput, Day, Employee, EmployeeEvent, Shift } from '../types';
import { buildReadonlyRecordSubject, buildRecordSubject, ReadSubject, executeFnOrOpenSnackbar, buildCUDRecordSubject, getResultElseNull } from "./crud.subject";
import { BehaviorSubject } from 'rxjs';

export const employeeSubject = buildRecordSubject<Employee, DraftEmployee>({
    createOne: createEmployee,
    updateOne: updateEmployee,
    deleteOne: deleteEmployee,
    fetchAll: getEmployees,
});

export const buildEmployeeEventSubject = () => {
    const subject = new BehaviorSubject<EmployeeEvent[] | null>(null);
    const cudSubject = buildCUDRecordSubject<EmployeeEvent, CreateEventInput>({
        createOne: createEmployeeEvent,
        updateOne: updateEmployeeEvent,
        deleteOne: deleteEmployeeEvent,
    }, subject)
    return {
        ...cudSubject,
        fetchInterval: async (employeeId: string, interval: Interval) => {
            const recordList = await getEmployeeEvents(employeeId, interval);
            executeFnOrOpenSnackbar((v) => subject.next(v), recordList);
            return getResultElseNull(recordList);
        }
    }
};

export const employeeEventSubject = buildEmployeeEventSubject();

export const shiftSubject = buildRecordSubject<Shift, Draft<Shift>>({
    createOne: createShift,
    updateOne: updateShift,
    deleteOne: deleteShift,
    fetchAll: getShifts,
});

type DaySubjectProps = {
    toggleDayActivation: (day: Day) => void
} & ReadSubject<Day>;
const buildDaySubject = (): DaySubjectProps => {
    const subject = new BehaviorSubject<Day[] | null>(null);
    const readOnlySubjectProps = buildReadonlyRecordSubject<Day>({
        fetchAll: getDays,
    }, subject);
    return {
        ...readOnlySubjectProps,
        toggleDayActivation: async (day: Day) => {
            const currentValue = subject.value;
            if (currentValue) {
                const res = await setDayActivation(day);
                executeFnOrOpenSnackbar(v => subject.next(v), (currentValue.map((d) => (d.id === (res as Day).id ? res : d)) as Day[]))
            }
        }
    }
};

export const daySubject = buildDaySubject();
