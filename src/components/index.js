import TSViewer from './TSViewer/TSViewer.vue';

export { TSViewer };

export default {
  install(app) {
    app.component('TSViewer', TSViewer);
  },
};