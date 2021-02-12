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

const employeeEventFragment = gql`
  fragment employeeEventFragment on EmployeeEvent {
      id
      shift {
        id
      }
      startDate
      endDate
      duration
      type
      status
      nature
      isDesired
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

export const GET_EMPLOYEE_EVENTS = gql`
  query getEmployeeEvents($id: String!) {
    employeeEvents(employeeId: $id) {
      result {
        ...employeeEventFragment
      }
      success
      errors
    }
  }
  ${employeeEventFragment}
`;

export const GET_EMPLOYEE_EVENTS_BY_INTERVAL = gql`
  query getEmployeeEventsByInterval($id: String!, $startDate: Datetime!, $endDate: Datetime!) {
    employeeEventsByInterval(id: $id, startDate: $startDate, endDate: $endDate) {
      result {
        ...employeeEventFragment
      }
      success
      errors
    }
  }
  ${employeeEventFragment}
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


export const CREATE_EMPLOYEE_EVENT = gql`
  mutation createEvent($input: CreateEventInput!) {
    createEvent(input: $input) {
      result {
        ...employeeEventFragment
      }
      success
      errors
    }
  }
  ${employeeEventFragment}
`;

export const UPDATE_EMPLOYEE_EVENT = gql`
  mutation updateEvent($input: UpdateEventInput!) {
    updateEvent(input: $input) {
      result {
        ...employeeEventFragment
      }
      success
      errors
    }
  }
  ${employeeEventFragment}
`;

export const DELETE_EMPLOYEE_EVENT = gql`
  mutation deleteEvent($id: String!) {
    deleteEvent(id: $id) {
      ...deleteOpFragment
    }
  }
  ${deleteOpFragment}
`;
