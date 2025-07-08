import { defaultTo, prop } from 'ramda'

export default {
  methods: {
    /**
     * 'logout' event callback
     */
    handleLogout: function(payload) {
      if (this.$route.name === 'docs-login') {
        return
      }

      const shouldShowToast = defaultTo(false, prop('shouldShowToast', payload))
      const shouldRedirect = defaultTo(false, prop('shouldRedirect', payload))

      // clear vuex
      this.viewerStore.clearState()


      // Add a redirect link
      let query = {}
      if (shouldRedirect) {
        query = {
          redirectTo: this.$route.fullPath
        }
      }

      // route user to login page
      this.$router.replace({
        name: 'home',
        query
      })

      // // fire toast
      // if (shouldShowToast) {
      //   EventBus.$emit('toast', { detail: { msg: 'Logged Out' }})
      // } TODO
    }
  }
}
