import { ApiResponse, getResultOrError } from './helper';
import { DraftEmployee, WithId } from '../model';
import { CREATE_EMPLOYEE, DELETE_EMPLOYEE, GET_EMPLOYEES, UPDATE_EMPLOYEE } from '../graphql/employee.graph';
import httpWrapper from '../http';
import { Employee } from "../types";


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