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

const store = useStore()
const isReady = ref(false)

const packageId = ref('N:package:e115e3a8-fba8-4e16-92d0-1394d192d509')
const userToken = ref('eyJraWQiOiJ1UUMzRDl1RGpTTlhoNzZJRW1ldExcL05uOGRMazFyaU1LWSt5T2ZTUytHaz0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJmNmYxZTFlMy0zYjIyLTQ3ODEtOTgyZC0yMjUyYWJmNzBkZWEiLCJkZXZpY2Vfa2V5IjoidXMtZWFzdC0xXzBiZTIwZWQzLTE3N2QtNGUyNy04YzhjLTNiZjRjMzk4MzIxMSIsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0xX0ZWTGhKN0NRQSIsImNsaWVudF9pZCI6IjcwM2xtNWQ4b2RjY3UyMXBhZ2NmamtlYWVhIiwib3JpZ2luX2p0aSI6IjJmNDVmZThhLWU4MjQtNDg3Ny04YmNiLTY1ODE3NzY4YmQxZiIsImV2ZW50X2lkIjoiMDY4ZGNlZjktNTU0Ni00MDI2LWI1YTEtZmYxYzU2OGZlYTUwIiwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJhd3MuY29nbml0by5zaWduaW4udXNlci5hZG1pbiIsImF1dGhfdGltZSI6MTc0ODY1OTA0NiwiZXhwIjoxNzQ4NjYyNjQ2LCJpYXQiOjE3NDg2NTkwNDYsImp0aSI6IjhjY2IwYzQzLWJkOGMtNGE3OC05NGFhLTRjOTNjZmU4N2E1ZiIsInVzZXJuYW1lIjoiZjZmMWUxZTMtM2IyMi00NzgxLTk4MmQtMjI1MmFiZjcwZGVhIn0.XF5bEHs6LGbIgJl7wHwQnOYzunWXPYxwu6gAxDfW5zfgOEL_TFgwGeV1ra_7wQpFnee66EyWpsL4CyD7hQ28N8kO515qkdzr5iJ3RIC17rC7vcrpH74QohFqWz4owVI-LkuSdlByTglU_-PJr8CVpRFScMkifVL7cZxkKJsrsNjEa8tF8nL8lSM39NY2yMg-8SFDbl1sr3MiHDiiPa8Pa8QfbAJmhfPj_sB0wH2ryjpsn5vMxISlBSM3WuERYj15g95T7pVNxtRahiX5QuB5DvlmHQDieizhC1eIjG51-TRcV5xxUxdqp0iJzb64jvEUQm32Zo_YA2v9IeKx_tq65w') // You can set a test token here for isolated testing
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