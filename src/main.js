import Vue from 'vue'
import App from './App'
import store from '@/store/index.js'
import Vuex from 'vuex'
import SystemDesignComponents from '@nih-sparc/sparc-design-system-components'
import * as svgicon from 'vue-svgicon'
import '@/assets/icons/index.js'


Vue.use(Vuex)
Vue.use(SystemDesignComponents)
Vue.use(svgicon, {
  tagName: 'svg-icon'
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  store: new Vuex.Store(store),
  template: '<App/>',
  components: { App }
})