import Vue from 'vue'
import App from './App'
import Vuex from 'vuex'
import SystemDesignComponents from '@nih-sparc/sparc-design-system-components'
import * as svgicon from 'vue-svgicon'


Vue.use(Vuex)
Vue.use(SystemDesignComponents)
Vue.use(svgicon, {
  tagName: 'svg-icon'
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})