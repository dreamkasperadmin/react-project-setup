/* ROUTERS  */
export const ROUTES = {
  MAIN: '/',
  USERS: '/users',
  LOGOUT: '/logout',
  LOGIN: '/login',
  RESET: '/forgot-password',
  CHANGE: '/reset',
  VERIFY: '/verify',
  USERS_MANAGEMENT: '/users'
};

/*  Modules */
export const MODULES = {
  DASHBOARD: 'Dashboard',
  USERS_MANAGEMENT: 'User Management'
};

/* Authentication */
export const TOKEN = 'TOKEN';
export const USER = 'USER';

export const ROLES = {
  SUPER_ADMIN: 'Super admin',
  ADMIN: 'Admin'
};

export const ROLE_KEYS = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN'
};

/* Date and time */
export const defaultDateFormat = 'MM/DD/YYYY';

export const REGEX = {
  NAME: /^[a-z ,.'-]+$/i,
  ZIPCODE: /^[0-9]{5,6}$/,
  CITY: /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/,
  WEB_URL: /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi,
  PASSWORD: /^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9!@#$%^&*]{8,16}$/,
  PHONE: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
  EMAIL: /^(([^<>()[\]\\.,;:!#$*%^'`~={}?/&\s@"]+(\.[^<>()[\]\\.,;:!#$*%^'`~={}?/&\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  AMOUNT: /^\d+$|^\d+\.\d*$/,
  OPTIONALNEGATIVEAMOUNT: /^[-]?\d+$|^[-]?\d+\.\d*$/,
  NUMBER: /^\d+$/
};
