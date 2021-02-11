import gql from "graphql-tag";

/************
 * Fragments *
 ************/

const completeScheduleFragment = gql`
  fragment completeScheduleFragment on CompleteSchedule {
    schedule {
      day
      shifts {
        shift
        employee
      }
    }
    meta {
      createdAt
    }
  }
`;

/***********
 * Queries *
 ***********/
export const GET_SCHEDULE = gql`
  query getSchedule {
    schedule {
      result {
        ...completeScheduleFragment
      }
      success
      errors
    }
  }
  ${completeScheduleFragment}
`;

/*************
 * Mutations *
 *************/
export const GENERATE_SCHEDULE = gql`
  mutation generateSchedule($input: GenerateScheduleInput!) {
    generateSchedule(input: $input) {
      result {
        ...completeScheduleFragment
      }
      success
      errors
    }
  }
  ${completeScheduleFragment}
`;