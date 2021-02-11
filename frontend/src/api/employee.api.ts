import { ApiResponse, getResultOrError } from './helper';
import { Draft, DraftEmployee, WithId } from '../model';
import { CREATE_EMPLOYEE, CREATE_EMPLOYEE_EVENT, DELETE_EMPLOYEE, DELETE_EMPLOYEE_EVENT, GET_EMPLOYEES, GET_EMPLOYEE_EVENTS, UPDATE_EMPLOYEE, UPDATE_EMPLOYEE_EVENT } from '../graphql/employee.graph';
import httpWrapper from '../http';
import { CreateEventInput, Employee, EmployeeEvent, UpdateEventInput } from "../types";

/************
 * Employee *
 ************/
export const createEmployee = async (input: DraftEmployee): ApiResponse<Employee> => {
    const res = await httpWrapper.mutation(CREATE_EMPLOYEE, { input });
    return getResultOrError(res.data.data.createEmployee);
}

export const updateEmployee = async (input: WithId<DraftEmployee>): ApiResponse<Employee> => {
    const res = await httpWrapper.mutation(UPDATE_EMPLOYEE, { input });
    return getResultOrError(res.data.data.updateEmployee);
}

export const deleteEmployee = async (id: string): ApiResponse<boolean> => {
    const res = await httpWrapper.mutation(DELETE_EMPLOYEE, { id });
    // TODO: Handle potential errors
    return getResultOrError(res.data.data.deleteEmployee);
}

export const getEmployees = async (): ApiResponse<Employee[]> => {
    const res = await httpWrapper.query(GET_EMPLOYEES);
    return getResultOrError(res.data.data.employees);
}


/**********
 * Events *
 **********/
export const createEmployeeEvent = async (input: CreateEventInput): ApiResponse<EmployeeEvent> => {
    const res = await httpWrapper.mutation(CREATE_EMPLOYEE_EVENT, { input });
    return getResultOrError(res.data.data.createEvent);
}

export const updateEmployeeEvent = async (input: UpdateEventInput): ApiResponse<EmployeeEvent> => {
    const res = await httpWrapper.mutation(UPDATE_EMPLOYEE_EVENT, { input });
    return getResultOrError(res.data.data.updateEvent);
}

export const deleteEmployeeEvent = async (id: string): ApiResponse<boolean> => {
    const res = await httpWrapper.mutation(DELETE_EMPLOYEE_EVENT, { id });
    return getResultOrError(res.data.data.deleteEvent);
}

export const getEmployeeEvents = async (id: string, interval: Interval): ApiResponse<EmployeeEvent[]> => {
    const res = await httpWrapper.query(GET_EMPLOYEE_EVENTS, { id, startDate: interval.start, endDate: interval.end });
    return getResultOrError(res.data.data.employeeEvents);
}