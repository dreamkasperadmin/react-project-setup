import { message } from 'antd';
import moment from 'moment';
import client from '../apollo';
import { GET_SIGNED_URL } from '../components/graphql/Mutation';
import api from './api';
import { defaultDateFormat, REGEX } from './constants';

// Portal related methods
export const injectUsingPortal = (portalId) => {
  // eslint-disable-next-line no-undef
  return document?.getElementById(portalId);
};

export const isPortalIdExists = (portalId) => {
  return !!injectUsingPortal(portalId);
};

// Check for document Id's exists
export const getElementFromDocumentId = (portalId) => {
  // eslint-disable-next-line no-undef
  return document?.getElementById(portalId);
};

export const isDocumentIdExist = (portalId) => {
  return !!getElementFromDocumentId(portalId);
};
// Check for document Id's exists end

export const formatDate = (
  dateTime,
  format = `${defaultDateFormat} hh:mm A`
) => {
  if (dateTime && moment && format) {
    return moment(dateTime)?.format(format);
  }

  return dateTime;
};

export const formValidatorRules = {
  required: {
    required: true,
    message: 'Required'
  },
  email: {
    type: 'email',
    message: 'The input is not valid E-mail!'
  },
  number: () => ({
    validator(rule, value) {
      if (!value) {
        return Promise?.resolve();
      }
      if (!Number(value) || !REGEX?.NUMBER?.test(Number(value))) {
        // eslint-disable-next-line prefer-promise-reject-errors
        return Promise?.reject('Should be a valid Number');
      }
      return Promise?.resolve();
    }
  })
};

export const combineDateTimeAndGetISOString = (date, time) => {
  const timeObj = new Date(time);
  const dateObj = new Date(date);

  let formattedDateTime = dateObj?.setUTCHours(timeObj?.getUTCHours());
  formattedDateTime = new Date(formattedDateTime)?.setUTCMinutes(
    timeObj?.getUTCMinutes()
  );
  formattedDateTime = new Date(formattedDateTime)?.toISOString();

  return formattedDateTime;
};

export const formatPhoneNumber = (str) => {
  // Filter only numbers from the input
  const cleaned = `${str}`?.replace(/\D/g, '');

  // Check if the input is of correct length
  const match = cleaned?.match(/^(\d{3})(\d{3})(\d{4})$/);

  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }

  return null;
};

export const formatPhoneNumberWithoutMask = (str) => {
  // Filter only numbers from the input
  const cleaned = `${str}`?.replace(/\D/g, '');
  if (cleaned) return cleaned;
  return null;
};

export const formatPrice = (price) => {
  const formatedPrice = price || 0;

  return Number(formatedPrice)?.toLocaleString('en', {
    style: 'currency',
    currency: 'USD'
  });
};

export const formItemProps = { normalize: (value) => value?.trim() };

// Note : Function to upload on s3 bucket
export async function fileUpload(signedUrl, image, onUploadProgress) {
  try {
    return new Promise((resolve) => {
      // eslint-disable-next-line no-undef
      const xhr = new XMLHttpRequest();
      xhr?.open('PUT', signedUrl);
      xhr?.setRequestHeader('Content-Type', image?.type);
      xhr?.setRequestHeader('x-amz-acl', 'public-read');
      xhr?.addEventListener('readystatechange', function () {
        if (this?.readyState === 4) {
          resolve(xhr?.response);
        }
      });
      if (onUploadProgress) {
        xhr.upload.onprogress = (e) => {
          let percentComplete = 0;
          percentComplete = Math?.ceil((e?.loaded / e?.total) * 100);
          onUploadProgress(percentComplete);
        };
      }
      xhr?.send(image);
    });
  } catch (error) {
    message?.error(error?.message);
  }
}

export const getSignedUrl = async (fileObj) => {
  const fileName = fileObj?.name;

  const extension = fileName?.slice(fileName?.lastIndexOf('.') + 1);
  const key = `${fileName}`;

  const response = await client?.mutate({
    mutation: GET_SIGNED_URL,
    variables: {
      action: 'write',
      data: {
        extension: `.${extension}`,
        contentType: fileObj?.type,
        key
      }
    }
  });
  if (response) {
    return response?.data;
  }
  return null;
};

export const uploadImage = async (signedRequest, fileObj) => {
  await api(signedRequest, {
    method: 'PUT',
    data: fileObj?.originFileObj || fileObj,
    headers: {
      'Content-Type': fileObj?.type
    }
  });
};

export const fetchImage = async (fileObj) => {
  const fileName = fileObj?.name;
  const extension = fileName?.slice(fileName?.lastIndexOf('.') + 1);
  const key = `${fileName}`;

  const response = await client?.mutate({
    mutation: GET_SIGNED_URL,
    variables: {
      action: 'read',
      data: {
        extension: `.${extension}`,
        contentType: fileObj?.type,
        key
      }
    }
  });
  if (response) {
    return response?.data;
  }
  return null;
};

export const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line no-undef
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader?.result);
    reader.onerror = (error) => reject(error);
  });
};
