import { message } from 'antd';
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword
} from 'firebase/auth';
import 'firebase/compat/analytics';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import client from '../../apollo';
import {
  USER_LOGIN
} from './graphql/Mutations';

// Configure Firebase.
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

firebase.initializeApp(firebaseConfig);

export const analytics = firebase.analytics();

export const auth = getAuth();

export const googleAuthProvider = new GoogleAuthProvider();

export const handleFirebaseError = (error) => {
  if (error.code === 'auth/invalid-email') {
    message.error('Invalid email address');
  }
  if (error.code === 'auth/user-not-found') {
    message.error('You have not registered yet');
  }
  if (error.code === 'auth/wrong-password') {
    message.error('Invalid password');
  }
  if (error.code === 'auth/weak-password') {
    message.error('Password must be at least 6 characters long');
  }
  if (error.code === 'auth/email-already-in-use') {
    message.error('Email already in use');
  }
  if (error.code === 'auth/too-many-requests') {
    message.error('Too many requests');
  }
  if (error.code === 'auth/user-disabled') {
    message.error('User disabled');
  }
  if (error.code === 'auth/network-request-failed') {
    message.error('Network request failed');
  }
  if (error.code === 'auth/account-exists-with-different-credential') {
    message.error('Account exists with different credential');
  }
  if (error.code === 'auth/popup-blocked') {
    message.error('Popup blocked');
  }
  if (error.code === 'auth/popup-closed-by-user') {
    message.error('Popup closed by user');
  }
  if (error.code === 'auth/invalid-action-code') {
    message.error('Invalid action code');
  }
};

export const SignInWithEmailAndPassword = async (
  email,
  password,
  setLoginLoading
) => {
  try {
    setLoginLoading(true);
    const response = await signInWithEmailAndPassword(auth, email, password);
    if (response) {
      const result = {};
      const loginSuccessful = await client.mutate({
        mutation: USER_LOGIN,
        variables: {
          token: response?.user?.accessToken
        }
      });
      if (loginSuccessful) {
        result.success =
          loginSuccessful?.data?.userLogin?.isOnboardingCompleted;
        result.userData = loginSuccessful?.data?.userLogin?.data;
        result.token = response?.user?.accessToken;
        result.isEmailVerified =
          loginSuccessful?.data?.userLogin?.isEmailVerified;
        return result;
      }
      result.success = null;
      result.token = null;
      return result;
    }
  } catch (error) {
    setLoginLoading(false);
    // eslint-disable-next-line no-console
    if (error && error.code) {
      return handleFirebaseError(error);
    }
    throw error;
  }
};

export const CreateUserWithEmailAndPassword = async (
  email,
  password,
  setLoading
) => {
  try {
    setLoading(true);
    const response = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    if (response) {
      const result = {};
      result.token = response?.user?.accessToken;
      return result;
    }
  } catch (error) {
    setLoading(false);
    if (error && error.code) {
      return handleFirebaseError(error);
    }
    throw error;
  }
};
