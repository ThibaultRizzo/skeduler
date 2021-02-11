import gql from "graphql-tag";

/************
 * Fragments *
 ************/

const dayFragment = gql`
  fragment dayFragment on Day {
    id
    active
    name {
      name
      value
    }
  }
`;

/***********
 * Queries *
 ***********/
export const GET_DAYS = gql`
  query getDays {
    days {
      result {
        ...dayFragment
      }
      success
      errors
    }
  }
  ${dayFragment}
`;

/*************
 * Mutations *
 *************/
export const SET_DAY_ACTIVATION = gql`
  mutation setDayActivation($input: ToggleDayActivationInput!) {
    toggleDayActivation(input: $input) {
      result {
        ...dayFragment
      }
      success
      errors
    }
  }
  ${dayFragment}
`;
