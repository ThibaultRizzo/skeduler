import gql from "graphql-tag";


/************
 * Fragments *
 ************/

const shiftFragment = gql`
fragment shiftFragment on Shift {
  id
  title
  duration
  shiftImportance
  coverMonday
  coverTuesday
  coverWednesday
  coverThursday
  coverFriday
  coverSaturday
  coverSunday
}
`

/***********
 * Queries *
 ***********/
export const GET_SHIFTS = gql`
query getShifts {
                shifts {
                    result {
                        ...shiftFragment
                    }
                    success
            errors
                }
                  }
                  ${shiftFragment}
`;

/*************
 * Mutations *
 *************/

export const CREATE_SHIFT = gql`
mutation createShift($input: CreateShiftInput!) {
    createShift(input: $input) {
            result {
              ...shiftFragment
            }
            success
            errors
    }
  }
  ${shiftFragment}
`;


export const UPDATE_SHIFT = gql`
mutation updateShift($input: UpdateShiftInput!) {
	updateShift(input:$input) {
    result {
      ...shiftFragment
    }
    success
            errors
  }
}
${shiftFragment}
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