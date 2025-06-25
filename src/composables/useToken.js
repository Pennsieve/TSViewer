import { inject } from 'vue';

export function useToken() {
  const useGetToken = inject('useGetToken');
  if (!useGetToken) {
    throw new Error('useGetToken is not provided. Make sure to provide it in your app.');
  }
  return useGetToken;
}