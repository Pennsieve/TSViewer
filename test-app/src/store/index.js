import { createStore } from 'vuex';
import { viewerModule } from 'tsviewer';

const store = createStore({
  modules: {
    viewerModule: viewerModule
  },
  state: () => ({
    // Define your global state here if needed
    tempState: 'This is a temporary state value'
  }),
});

export default store;