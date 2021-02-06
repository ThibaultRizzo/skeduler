import gql from "graphql-tag";


/***********
 * Queries *
 ***********/
export const GET_DAYS = gql`
query getDays {
  days {
    result {
      id
      name {
        name
        value
      }
      active
    }
    success
    errors
  }
}
`;


/*************
 * Mutations *
 *************/
export const SET_DAY_ACTIVATION = gql`
mutation setDayActivation($input: ToggleDayActivationInput!) {
  toggleDayActivation(input:$input) {
    result {
      id
      active
      name {
        name
        value
      }
    }
    success
    errors
  }
}
`;