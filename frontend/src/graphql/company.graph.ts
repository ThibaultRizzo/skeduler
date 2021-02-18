import gql from "graphql-tag";

/************
 * Fragments *
 ************/

const companySummaryFragment = gql`
  fragment companySummaryFragment on CompanySummary {
    id
    name
  }
`;

const companySequenceRuleFragment = gql`
  fragment companySequenceRuleFragment on CompanySequenceRule {
    id
    companyId
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
        companyId
        fromShiftId
        toShiftId
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
        ...companySummaryFragment
      }
      success
      errors
    }
  }
  ${companySummaryFragment}
`;

export const GET_COMPANY = gql`
  query getCompany {
    company {
      result {
        ...companySummaryFragment
      }
      success
      errors
    }
  }
  ${companySummaryFragment}
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
        ...companySummaryFragment
      }
      success
      errors
    }
  }
  ${companySummaryFragment}
`;

export const UPDATE_COMPANY = gql`
  mutation updateCompany($input: UpdateCompanyInput!) {
    updateCompany(input: $input) {
      result {
        ...companySummaryFragment
      }
      success
      errors
    }
  }
  ${companySummaryFragment}
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
