import { getDays } from '../api/day.api';
import { createEmployee, deleteEmployee, getEmployees, updateEmployee } from '../api/employee.api.';
import { createShift, deleteShift, getShifts, updateShift } from '../api/shift.api';
import { DraftEmployee, DraftShift } from '../model';
import { Day, Employee, Shift } from '../types';
import { buildReadonlyRecordSubject, buildRecordSubject, ReadSubject } from "./crud.subject";
import { BehaviorSubject } from 'rxjs';

export const employeeSubject = buildRecordSubject<Employee, DraftEmployee>({
    createOne: createEmployee,
    updateOne: updateEmployee,
    deleteOne: deleteEmployee,
    fetchAll: getEmployees,
});

export const shiftSubject = buildRecordSubject<Shift, DraftShift>({
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
        toggleDayActivation: (res: Day) => {
            const currentValue = subject.value;
            if (currentValue) {
                subject.next(currentValue.map((d) => (d.id === res.id ? res : d)))
            }
        }
    }
};

export const daySubject = buildDaySubject();
