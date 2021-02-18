import gql from "graphql-tag";

/************
 * Fragments *
 ************/

const companyFragment = gql`
  fragment companyFragment on Company {
    id
    name

      transitionRules {
        id
        from_shiftId
        to_shiftId
        penalty
      }
  }
`;

const companySequenceRuleFragment = gql`
  fragment companySequenceRuleFragment on CompanySequenceRule {

  id
  company_id
  ruleType
  shiftId
  hardMin
  softMin
  penaltyMin
  hardMax
  softMax
  penaltyMax

  }
`;

const companyTransitionRuleFragment = gql`
  fragment companyTransitionRuleFragment on CompanyTransitionRule {
      transitionRules {
        id
        company_id
        from_shiftId
        to_shiftId
        penalty
      }
  }
`;

/***********
 * Queries *
 ***********/
export const GET_COMPANIES = gql`
  query getCompanies {
    companies {
      result {
        ...companyFragment
      }
      success
      errors
    }
  }
  ${companyFragment}
`;

export const GET_COMPANY = gql`
  query getCompany($id: String!) {
    company {
      result {
        ...companyFragment
      }
      success
      errors
    }
  }
  ${companyFragment}
`;

export const GET_COMPANY_SEQUENCE_RULES = gql`
  query getCompanySequenceRules($id: String!) {
    company {
      result {
        ...companySequenceRuleFragment
      }
      success
      errors
    }
  }
  ${companySequenceRuleFragment}
`;

/*************
 * Mutations *
 *************/

export const CREATE_COMPANY = gql`
  mutation createCompany($input: CreateCompanyInput!) {
    createCompany(input: $input) {
      result {
        ...companyFragment
      }
      success
      errors
    }
  }
  ${companyFragment}
`;

export const UPDATE_COMPANY = gql`
  mutation updateCompany($input: UpdateCompanyInput!) {
    updateCompany(input: $input) {
      result {
        ...companyFragment
      }
      success
      errors
    }
  }
  ${companyFragment}
`;

export const DELETE_COMPANY = gql`
  mutation deleteCompany($id: String!) {
    deleteCompany(id: $id) {
      result
      success
      errors
    }
  }
`;
