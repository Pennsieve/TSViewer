import './assets/styles.scss';

import TSViewer from './components/TSViewer/TSViewer.vue';
import viewerModule from './store/viewerModule.js'

export default {
  install(app) {
    app.component('TSViewer', TSViewer);
  },
};

export { TSViewer, viewerModule };