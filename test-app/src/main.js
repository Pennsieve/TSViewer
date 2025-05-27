import { createApp } from 'vue';
import App from './App.vue';

// Import your local component library (linked via yarn link)
import TSViewer from 'tsviewer';
import store from 'tsviewer/src/store';

const app = createApp(App);

// Use the library (registers TSViewer globally)
app.use(store); 
app.use(TSViewer);

app.mount('#app');