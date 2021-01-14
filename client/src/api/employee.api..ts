import { DraftEmployee, WithId } from './../model';
import { CREATE_EMPLOYEE, DELETE_EMPLOYEE, GET_EMPLOYEES, UPDATE_EMPLOYEE } from '../graphql/employee.graph';
import httpWrapper from '../http';
import { Employee } from "../types";


export const createEmployee = async (input: DraftEmployee): Promise<Employee | null> => {
    const res = await httpWrapper.mutation(CREATE_EMPLOYEE, { input });
    return res.data.data.createEmployee?.result || null;
}

export const updateEmployee = async (input: WithId<DraftEmployee>): Promise<Employee | null> => {
    const res = await httpWrapper.mutation(UPDATE_EMPLOYEE, { input });
    return res.data.data.updateEmployee?.result || null;
}

export const deleteEmployee = async (id: string): Promise<boolean> => {
    const res = await httpWrapper.mutation(DELETE_EMPLOYEE, { id });
    // TODO: Handle potential errors
    return res.data.data.deleteEmployee?.success || false;
}

export const getEmployees = async (): Promise<Employee[]> => {
    const res = await httpWrapper.query(GET_EMPLOYEES);
    return res.data.data.employees?.result || [];
}