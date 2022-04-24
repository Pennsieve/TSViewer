import TSViewer from './TSViewer.vue'
import store from '../store'
export default {
  install (Vue, options) {
    if (!options || !options.store) {
      throw new Error('Please initialise plugin with a Vuex store.')
    }
    
    options.store.registerModule('tsviewer', store)
    
    Vue.component('ts-viewer', TSViewer)
  }
}