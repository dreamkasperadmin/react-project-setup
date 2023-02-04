import { gql } from '@apollo/client';

export const CREATE_USER = gql`
  mutation adminCreateUser($data: AdminCreateUserInput!) {
    adminCreateUser(data: $data) {
      data {
        id
        firstName
        lastName
        email
        phoneNo
        isActive
        roles
        profileImage {
          url
          key
          name
          extension
          contentType
        }
      }
      status
      message
    }
  }
`;

export const UPDATE_USER = gql`
  mutation adminUpdateUser($id: ID!, $data: AdminUpdateUserInput!) {
    adminUpdateUser(id: $id, data: $data) {
      data {
        id
        firstName
        lastName
        email
        phoneNo
        isActive
        roles
        profileImage {
          url
          key
          name
          extension
          contentType
        }
      }
      status
      message
    }
  }
`;
