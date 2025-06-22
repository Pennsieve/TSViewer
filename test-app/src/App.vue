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
import { useViewerStore, TSViewer } from 'tsviewer'
import 'tsviewer/dist/tsviewer.css'

import testAuthKey from './constants/auth.js'

const viewerStore = useViewerStore()

const isReady = ref(false)
const packageId = ref('N:package:e115e3a8-fba8-4e16-92d0-1394d192d509')
const userToken = ref(testAuthKey)
const packageType = ref('TimeSeries')

async function fetchInitialData() {
  viewerStore.updateUserToken(userToken.value)
  await viewerStore.fetchAndSetActiveViewer({
    packageId: packageId.value,
    packageType: packageType.value
  })
}

onMounted(async () => {
  await fetchInitialData()
  isReady.value = true
})
</script>