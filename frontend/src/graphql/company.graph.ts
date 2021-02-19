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
        id
        companyId
        fromShiftId
        toShiftId
        penalty
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

export const GET_SEQUENCE_RULES = gql`
  query getCompanySequenceRules {
    sequenceRules {
      result {
        ...companySequenceRuleFragment
      }
      success
      errors
    }
  }
  ${companySequenceRuleFragment}
`;

export const GET_TRANSITION_RULES = gql`
  query getCompanyTransitionRules {
    transitionRules {
      result {
        ...companyTransitionRuleFragment
      }
      success
      errors
    }
  }
  ${companyTransitionRuleFragment}
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

export const CREATE_SEQUENCE_RULE = gql`
  mutation createSequenceRule($input: CreateSequenceRuleInput!) {
    createSequenceRule(input: $input) {
      result {
        ...companySequenceRuleFragment
      }
      success
      errors
    }
  }
  ${companySequenceRuleFragment}
`;

export const UPDATE_SEQUENCE_RULE = gql`
  mutation updateSequenceRule($input: UpdateSequenceRuleInput!) {
    updateSequenceRule(input: $input) {
      result {
        ...companySequenceRuleFragment
      }
      success
      errors
    }
  }
  ${companySequenceRuleFragment}
`;

export const DELETE_SEQUENCE_RULE = gql`
  mutation deleteSequenceRule($id: String!) {
    deleteSequenceRule(id: $id) {
      result
      success
      errors
    }
  }
`;

export const CREATE_TRANSITION_RULE = gql`
  mutation createTransitionRule($input: CreateTransitionRuleInput!) {
    createTransitionRule(input: $input) {
      result {
        ...companyTransitionRuleFragment
      }
      success
      errors
    }
  }
  ${companyTransitionRuleFragment}
`;

export const UPDATE_TRANSITION_RULE = gql`
  mutation updateTransitionRule($input: UpdateTransitionRuleInput!) {
    updateTransitionRule(input: $input) {
      result {
        ...companyTransitionRuleFragment
      }
      success
      errors
    }
  }
  ${companyTransitionRuleFragment}
`;

export const DELETE_TRANSITION_RULE = gql`
  mutation deleteTransitionRule($id: String!) {
    deleteTransitionRule(id: $id) {
      result
      success
      errors
    }
  }
`;
