import TSViewer from './components/TSViewer/TSViewer.vue';
import viewerModule from './store/viewerModule.js'
import './assets/styles.scss';

export default {
  install(app) {
    app.component('TSViewer', TSViewer);
  },
};

export { TSViewer, viewerModule };