import gql from "graphql-tag";


/***********
 * Queries *
 ***********/
export const GET_EMPLOYEES = gql`
query getEmployees {
 employees {
     result {

  id
  name
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
    name

  }
}
     }
}
`;


/*************
 * Mutations *
 *************/

export const CREATE_EMPLOYEE = gql`
mutation createEmployee($input: CreateEmployeeInput!) {
	createEmployee(input:$input) {
    result {
      id
      name
      contract
      skills {
				level
        shift {
          title
        }
      }
      workingDays {
        id
        name
        active
      }
    }
  }
}
`;

export const DELETE_EMPLOYEE = gql`
mutation deleteEmployee($id: String!) {
    deleteEmployee(id: $id) {
        success
        errors
    }
  }
`;