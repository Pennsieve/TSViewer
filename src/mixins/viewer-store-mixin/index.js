import { useViewerStore } from '../../stores/viewerStore'

export default {
  computed: {
    viewerStore() {
      return useViewerStore()
    }
  }
}