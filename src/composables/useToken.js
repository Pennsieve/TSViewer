import { inject } from 'vue';

export const useToken = () => {
  const getToken = inject('getToken');
  if (!getToken) {
    throw new Error(
      'getToken is not provided. Please use a Nuxt plugin or Vue app to provide it.'
    );
  }
  return getToken;
};