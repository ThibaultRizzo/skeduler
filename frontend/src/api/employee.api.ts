import { ApiResponse, getResultOrError } from './helper';
import { CREATE_EMPLOYEE, CREATE_EMPLOYEE_EVENT, DELETE_EMPLOYEE, DELETE_EMPLOYEE_EVENT, GET_EMPLOYEES, GET_EMPLOYEE_EVENTS, GET_EMPLOYEE_EVENTS_BY_INTERVAL, UPDATE_EMPLOYEE, UPDATE_EMPLOYEE_EVENT } from '../graphql/employee.graph';
import httpWrapper from '../http';
import { EmployeeEvent } from "../types";
import { buildCreateUpdateApi, buildDeleteApi, buildReadAllApi, buildReadApi } from './crud.api';

/************
 * Employee *
 ************/
export const createEmployee = buildCreateUpdateApi(CREATE_EMPLOYEE, res => res.data.data.createEmployee)
export const updateEmployee = buildCreateUpdateApi(UPDATE_EMPLOYEE, res => res.data.data.updateEmployee)
export const deleteEmployee = buildDeleteApi(DELETE_EMPLOYEE, res => res.data.data.deleteEmployee)
export const getEmployees = buildReadAllApi(GET_EMPLOYEES, res => res.data.data.employees);

export const createEmployeeEvent = buildCreateUpdateApi(CREATE_EMPLOYEE_EVENT, res => res.data.data.createEvent)
export const updateEmployeeEvent = buildCreateUpdateApi(UPDATE_EMPLOYEE_EVENT, res => res.data.data.updateEvent)
export const deleteEmployeeEvent = buildDeleteApi(DELETE_EMPLOYEE_EVENT, res => res.data.data.deleteEvent)
export const getEmployeeEvents = buildReadApi(GET_EMPLOYEE_EVENTS, res => res.data.data.employeeEvents);

export const getEmployeeEventsByInterval = async (id: string, interval: Interval): ApiResponse<EmployeeEvent[]> => {
    const res = await httpWrapper.query(GET_EMPLOYEE_EVENTS_BY_INTERVAL, { id, startDate: interval.start, endDate: interval.end });
    return getResultOrError(res.data.data.employeeEventsByInterval);
}

// export const createEmployee = async (input: DraftEmployee): ApiResponse<Employee> => {
//     const res = await httpWrapper.mutation(CREATE_EMPLOYEE, { input });
//     return getResultOrError(res.data.data.createEmployee);
// }

// export const updateEmployee = async (input: WithId<DraftEmployee>): ApiResponse<Employee> => {
//     const res = await httpWrapper.mutation(UPDATE_EMPLOYEE, { input });
//     return getResultOrError(res.data.data.updateEmployee);
// }

// export const deleteEmployee = async (id: string): ApiResponse<boolean> => {
//     const res = await httpWrapper.mutation(DELETE_EMPLOYEE, { id });
//     // TODO: Handle potential errors
//     return getResultOrError(res.data.data.deleteEmployee);
// }

// export const getEmployees = async (): ApiResponse<Employee[]> => {
//     const res = await httpWrapper.query(GET_EMPLOYEES);
//     return getResultOrError(res.data.data.employees);
// }


/**********
 * Events *
 **********/
// export const createEmployeeEvent = async (input: CreateEventInput): ApiResponse<EmployeeEvent> => {
//     const res = await httpWrapper.mutation(CREATE_EMPLOYEE_EVENT, { input });
//     return getResultOrError(res.data.data.createEvent);
// }

// export const updateEmployeeEvent = async (input: UpdateEventInput): ApiResponse<EmployeeEvent> => {
//     const res = await httpWrapper.mutation(UPDATE_EMPLOYEE_EVENT, { input });
//     return getResultOrError(res.data.data.updateEvent);
// }

// export const deleteEmployeeEvent = async (id: string): ApiResponse<boolean> => {
//     const res = await httpWrapper.mutation(DELETE_EMPLOYEE_EVENT, { id });
//     return getResultOrError(res.data.data.deleteEvent);
// }

// export const getEmployeeEvents = async (id: string): ApiResponse<EmployeeEvent[]> => {
//     const res = await httpWrapper.query(GET_EMPLOYEE_EVENTS, { id });
//     return getResultOrError(res.data.data.employeeEvents);
// }

