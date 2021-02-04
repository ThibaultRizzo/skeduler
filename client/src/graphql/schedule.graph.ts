import gql from "graphql-tag";


/***********
 * Queries *
 ***********/
export const GET_SCHEDULE = gql`
query getSchedule {
  schedule {
    result {
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
    success
    errors
  }
}
`;

/*************
 * Mutations *
 *************/
export const GENERATE_SCHEDULE = gql`
mutation generateSchedule($input: GenerateScheduleInput!) {
    generateSchedule(input: $input) {
        result {
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
        success
        errors
    }
  }
`;

