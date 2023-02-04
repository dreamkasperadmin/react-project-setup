import { gql } from '@apollo/client';

// eslint-disable-next-line import/prefer-default-export
export const GET_USERS = gql`
  query users($filter: UserFilter!) {
    users(filter: $filter) {
      count
      data {
        id
        firstName
        lastName
        email
        phoneNo
        roles
        roleValues {
          id
          key
          label
        }
        tenantId
        emailVerified
        createdAt
        updatedAt

        isActive
      }
    }
  }
`;

export const GET_PROFILE = gql`
  query getProfile {
    getProfile {
      id
      firstName
      lastName
      email
      phoneNo
      roles
      profileImage {
        url
        key
        name
        extension
        contentType
      }
      isActive
      tenantId
    }
  }
`;
