import gql from "graphql-tag";
import { deleteOpFragment } from "./helper.graphql";

/************
 * Fragments *
 ************/

const employeeFragment = gql`
  fragment employeeFragment on Employee {
    id
    name
    contract
    skills {
      level
      shift {
        id
        title
      }
    }
    workingDays {
      id
      active
      name {
        name
        value
      }
    }
  }
`;

/***********
 * Queries *
 ***********/
export const GET_EMPLOYEES = gql`
  query getEmployees {
    employees {
      result {
        ...employeeFragment
      }
      success
      errors
    }
  }
  ${employeeFragment}
`;

/*************
 * Mutations *
 *************/

export const CREATE_EMPLOYEE = gql`
  mutation createEmployee($input: CreateEmployeeInput!) {
    createEmployee(input: $input) {
      result {
        ...employeeFragment
      }
      success
      errors
    }
  }
  ${employeeFragment}
`;

export const UPDATE_EMPLOYEE = gql`
  mutation updateEmployee($input: UpdateEmployeeInput!) {
    updateEmployee(input: $input) {
      result {
        ...employeeFragment
      }
      success
      errors
    }
  }
  ${employeeFragment}
`;

export const DELETE_EMPLOYEE = gql`
  mutation deleteEmployee($id: String!) {
    deleteEmployee(id: $id) {
      ...deleteOpFragment
    }
  }
  ${deleteOpFragment}
`;
