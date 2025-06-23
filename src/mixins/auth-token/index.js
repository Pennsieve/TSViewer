import { useViewerStore } from '../../stores/viewerStore.js'

export default {
  methods: {
    async useGetToken() {
      const store = useViewerStore()
      return store.userToken
    }
  }
}