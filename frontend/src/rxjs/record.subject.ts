import { getDays, setDayActivation } from '../api/day.api';
import { createEmployee, createEmployeeEvent, deleteEmployee, deleteEmployeeEvent, getEmployeeEvents, getEmployeeEventsByInterval, getEmployees, updateEmployee, updateEmployeeEvent } from '../api/employee.api';
import { createShift, deleteShift, getShifts, updateShift } from '../api/shift.api';
import { Draft, DraftEmployee } from '../model';
import { CreateEventInput, Day, Employee, EmployeeEvent, Shift, UpdateEventInput } from '../types';
import { buildReadonlyRecordSubject, buildRecordSubject, ReadSubject, executeFnOrOpenSnackbar, buildCUDRecordSubject, getResultElseNull, buildSimpleSubject } from "./crud.subject";
import { BehaviorArrayLikeSubject } from './subject';

export const employeeSubject = buildRecordSubject<Employee, DraftEmployee>({
    createOne: createEmployee,
    updateOne: updateEmployee,
    deleteOne: deleteEmployee,
    fetchAll: getEmployees,
});

export const buildEmployeeEventSubject = () => {
    const allEventsSubject = new BehaviorArrayLikeSubject<EmployeeEvent>(null);
    const agendaSubject = new BehaviorArrayLikeSubject<EmployeeEvent>(null);

    const cudSubject = buildCUDRecordSubject<EmployeeEvent, CreateEventInput, UpdateEventInput>({
        createOne: createEmployeeEvent,
        updateOne: updateEmployeeEvent,
        deleteOne: deleteEmployeeEvent,
    })
    return {
        agenda: buildSimpleSubject(agendaSubject),
        all: buildSimpleSubject(allEventsSubject),
        createOne: async (r: CreateEventInput) => {
            const record = await cudSubject.createOne(r);
            if (record) {
                agendaSubject.createRecord(record)
                allEventsSubject.createRecord(record)
            }
            return record;
        },
        updateOne: async (r: UpdateEventInput) => {
            const record = await cudSubject.updateOne(r);
            if (record) {
                agendaSubject.updateRecord(record)
                allEventsSubject.updateRecord(record)
            }
            return record;
        },
        deleteOne: async (id: string) => {
            const isDeleted = await cudSubject.deleteOne(id);
            if (isDeleted) {
                agendaSubject.deleteRecord(id)
                allEventsSubject.deleteRecord(id)
            }
            return isDeleted;
        },
        fetchAll: async (employeeId: string) => {
            const recordList = await getEmployeeEvents(employeeId);
            executeFnOrOpenSnackbar((v) => allEventsSubject.next(v), recordList);
            return getResultElseNull(recordList);
        },
        fetchInterval: async (employeeId: string, interval: Interval) => {
            const recordList = await getEmployeeEventsByInterval(employeeId, interval);
            executeFnOrOpenSnackbar((v) => agendaSubject.next(v), recordList);
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
    const subject = new BehaviorArrayLikeSubject<Day>(null);
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
