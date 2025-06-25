import { inject, getCurrentInstance } from 'vue';
import { useNuxtApp } from 'nuxt/app';

export function useToken() {
  const nuxtApp = getCurrentInstance() ? null : useNuxtApp();

  if (nuxtApp) {
    const getToken = nuxtApp.$getToken;
    if (!getToken) {
      throw new Error('getToken is not provided via Nuxt app.');
    }
    return getToken;
  } else {
    const useGetToken = inject('useGetToken');
    if (!useGetToken) {
      throw new Error('useGetToken is not provided via Vue inject.');
    }
    return useGetToken;
  }
}