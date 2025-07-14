import { useViewerStore } from '../../stores/tsviewer'

export default {
  computed: {
    viewerStore() {
      return useViewerStore()
    }
  }
}