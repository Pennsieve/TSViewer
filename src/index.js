import './assets/styles.scss';

import TSViewer from './components/TSViewer/TSViewer.vue';
import { useViewerStore } from './stores/tsviewer';

export { useViewerStore, TSViewer }; 

export default {
  install(app) {
    app.component('TSViewer', TSViewer);
  },
};