import gql from "graphql-tag";


/***********
 * Queries *
 ***********/
export const GET_SHIFTS = gql`
query getShifts {
                shifts {
                    result {
                        id
                        title
                        duration
                    }
                    success
            errors
                }
                  }
`;

/*************
 * Mutations *
 *************/

export const CREATE_SHIFT = gql`
mutation createShift($input: CreateShiftInput!) {
    createShift(input: $input) {
            result {
            id
            title
            duration
            }
            success
            errors
    }
  }
`;


export const UPDATE_SHIFT = gql`
mutation updateShift($input: UpdateShiftInput!) {
	updateShift(input:$input) {
    result {
      id
      title
      duration
    }
    success
            errors
  }
}
`;

export const DELETE_SHIFT = gql`
mutation deleteShift($id: String!) {
    deleteShift(id: $id) {
      result
        success
    errors
    }
  }
`;