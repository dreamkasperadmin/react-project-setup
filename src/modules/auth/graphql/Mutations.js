import { gql } from '@apollo/client';

export const USER_LOGIN = gql`
  mutation userLogin($token: String!) {
    userLogin(token: $token) {
      isOnboardingCompleted
      isEmailVerified
      data {
        id
        firstName
        lastName
        email
        profileImage
        coverImage
        bio
        profileId
      }
    }
  }
`;

export const COMPANY_LOGIN = gql`
  mutation companyLogin($token: String!) {
    companyLogin(token: $token) {
      isCompanyVerified
      isCompanyEmailVerified
      isCompanyOnboardingCompleted
      data {
        id
        name
        email
        profileImage
        profileId
        coverImage
        subscriptionStatus
      }
    }
  }
`;

export const FORGOT_PASSWORD = gql`
  mutation forgotUserPassword($email: String) {
    forgotUserPassword(where: { email: $email }) {
      status
      message
    }
  }
`;
export const RESET_PASSWORD = gql`
  mutation updateUserPassword($password: String) {
    updateUserPassword(data: { password: $password }) {
      status
      message
    }
  }
`;

export const TOKEN_VALIDATION = gql`
  mutation isValidToken($resetToken: String) {
    isValidToken(data: { reset_token: $resetToken }) {
      message
      status
    }
  }
`;

export const EMAIL_VALIDATION = gql`
  mutation verifyUserEmail($resetToken: String) {
    verifyUserEmail(where: { reset_token: $resetToken }) {
      message
      status
    }
  }
`;

export const USER_SOCIAL_LOGIN = gql`
  mutation userSocialLogin($token: String!) {
    userSocialLogin(token: $token) {
      isOnboardingCompleted
      data {
        id
        firstName
        lastName
        email
        profileImage
        coverImage
        bio
        profileId
      }
      isEmailVerified
    }
  }
`;

export const USER_SIGNUP = gql`
  mutation userSignup($data: UserSignUpInput!) {
    userSignup(data: $data) {
      isOnboardingCompleted
      isEmailVerified
      data {
        id
        firstName
        lastName
        email
        profileImage
        coverImage
        bio
        profileId
      }
    }
  }
`;

export const COMPANY_SIGNUP = gql`
  mutation companySignup($data: CompanySignUpInput!) {
    companySignup(data: $data) {
      isCompanyVerified
      isCompanyEmailVerified
      isCompanyOnboardingCompleted
      data {
        id
        name
        email
        profileImage
        profileId
      }
    }
  }
`;

export const GET_RESUME_SIGNED_URL = gql`
  mutation getUserResumeSignedUrl($data: CommonFileInput!) {
    getUserResumeSignedUrl(data: $data) {
      fileName
      signedUrl
      getUrl
    }
  }
`;
export const GET_COMPANY_PROFILE_SIGNED_URL = gql`
  mutation getCompanyProfileSignedUrl($data: CommonFileInput!) {
    getCompanyProfileSignedUrl(data: $data) {
      fileName
      signedUrl
      getUrl
    }
  }
`;

export const ONBOARD_USER = gql`
  mutation onboardUser($data: OnboardUserInput!) {
    onboardUser(data: $data) {
      message
    }
  }
`;

export const EDIT_USER_PROFILE = gql`
  mutation editUserProfile($data: UpdateProfileInput!) {
    editUserProfile(data: $data) {
      message
    }
  }
`;

export const EDIT_COMPANY_PROFILE = gql`
  mutation updateCompany($data: CompanyUpdateInput!) {
    updateCompany(data: $data) {
      message
    }
  }
`;
export const ONBOARD_COMPANY = gql`
  mutation onboardCompany($data: OnboardCompanyInput!) {
    onboardCompany(data: $data) {
      message
      plans {
        id
        currency
        amount
        type
      }
    }
  }
`;

export const VERIFY_USER_OTP = gql`
  mutation verifyUserOtp($where: VerifyOtpInput!) {
    verifyUserOtp(where: $where) {
      message
    }
  }
`;

export const RESEND_USER_OTP = gql`
  mutation resendUserOtp($where: ResendOtpInput!) {
    resendUserOtp(where: $where) {
      message
    }
  }
`;

export const RECOVER_PASSWORD = gql`
  mutation resetPassword($email: String!) {
    resetPassword(email: $email) {
      message
    }
  }
`;

export const GET_COVER_IMAGE_SIGNED_URL = gql`
  mutation getUserCoverImageSignedUrl($data: CommonFileInput!) {
    getUserCoverImageSignedUrl(data: $data) {
      fileName
      signedUrl
      getUrl
    }
  }
`;

export const GET_COMPANY_COVER_IMAGE_SIGNED_URL = gql`
  mutation getCompanyCoverSignedUrl($data: CommonFileInput!) {
    getCompanyCoverSignedUrl(data: $data) {
      fileName
      signedUrl
      getUrl
    }
  }
`;

export const GET_STRIPE_SESSION = gql`
  mutation getStripeSession($tokenId: String!) {
    getStripeSession(tokenId: $tokenId) {
      url
    }
  }
`;
