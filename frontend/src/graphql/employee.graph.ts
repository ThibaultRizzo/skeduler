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
success
            errors
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
        name {
          name
          value
        }
        active
      }
    }
    success
    errors
  }
}
`;

export const UPDATE_EMPLOYEE = gql`
mutation updateEmployee($input: UpdateEmployeeInput!) {
	updateEmployee(input:$input) {
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
    success
    errors
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