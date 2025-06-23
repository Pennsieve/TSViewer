import { useViewerStore } from '../../stores/viewerStore.js'

export default {
  methods: {
    useGetToken() {
      const store = useViewerStore()
      return store.userToken
    }
  }
}