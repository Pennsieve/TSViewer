// logout-handler_composable.js

import {defaultTo, prop} from "ramda";

export function useHandleLogout(payload) {

    const route = useRoute()


    if (route.name === 'docs-login') {
        return
    }

    const shouldShowToast = defaultTo(false, prop('shouldShowToast', payload))
    const shouldRedirect = defaultTo(false, prop('shouldRedirect', payload))

    // clear vuex
    this.clearState()


    // Add a redirect link
    let query = {}
    if (shouldRedirect) {
        query = {
            redirectTo: this.$route.fullPath
        }
    }
}