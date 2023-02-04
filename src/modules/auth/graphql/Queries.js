import { gql } from '@apollo/client';

// eslint-disable-next-line import/prefer-default-export
export const LOGOUT_USER = gql`
  query logout {
    logout {
      message
      status
    }
  }
`;

export const GET_INDUSTRIES = gql`
  query getIndustries($filter: IndustryFilter!) {
    getIndustries(filter: $filter) {
      count
      industries {
        id
        key
        value
      }
    }
  }
`;

export const GET_SKILLS = gql`
  query getSkills($filter: SkillFilter!) {
    getSkills(filter: $filter) {
      count
      skills {
        id
        key
        value
      }
    }
  }
`;
