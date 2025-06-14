<template>
  <div id="app">
    <div>Test app</div>
    <div class="timeseries-viewer-wrapper">
      <div v-if="isReady" :key="isReady">
        <TSViewer/>
      </div>
      <div v-else>
        <p>Loading...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import testAuthKey from './constants/auth.js'
import { TSViewer } from 'tsviewer'
import 'tsviewer/style'

const store = useStore()
const isReady = ref(false)

const packageId = ref('N:package:e115e3a8-fba8-4e16-92d0-1394d192d509')
const userToken = ref(testAuthKey) // You can set a test token here for isolated testing
const packageType = ref('TimeSeries')


async function fetchInitialData() {
  store.commit('viewerModule/UPDATE_USER_TOKEN', userToken.value)
  return store.dispatch('viewerModule/setActiveViewer', {
                  packageId: packageId.value,
                  packageType: packageType.value
                })       
}

onMounted(async () => {
  await fetchInitialData()
  isReady.value = true
})
</script>