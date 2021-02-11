import gql from "graphql-tag";


export const deleteOpFragment = gql`
fragment deleteOpFragment on Payload {
    result
    success
    errors
}
`