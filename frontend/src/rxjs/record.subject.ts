import { getDays, setDayActivation } from '../api/day.api';
import { createEmployee, deleteEmployee, getEmployees, updateEmployee } from '../api/employee.api';
import { createShift, deleteShift, getShifts, updateShift } from '../api/shift.api';
import { Draft, DraftEmployee } from '../model';
import { Day, Employee, Shift } from '../types';
import { buildReadonlyRecordSubject, buildRecordSubject, ReadSubject, executeFnOrOpenSnackbar } from "./crud.subject";
import { BehaviorSubject } from 'rxjs';

export const employeeSubject = buildRecordSubject<Employee, DraftEmployee>({
    createOne: createEmployee,
    updateOne: updateEmployee,
    deleteOne: deleteEmployee,
    fetchAll: getEmployees,
});

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
