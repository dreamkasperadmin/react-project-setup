import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { useHistory } from 'react-router-dom';

const Logout = () => {
  const history = useHistory();
  firebase.auth().signOut();
  // eslint-disable-next-line no-undef
  localStorage.clear();
  history.push('/login');

  return null;
};

export default Logout;
