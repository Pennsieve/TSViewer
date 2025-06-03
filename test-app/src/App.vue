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
const userToken = ref('eyJraWQiOiJ1UUMzRDl1RGpTTlhoNzZJRW1ldExcL05uOGRMazFyaU1LWSt5T2ZTUytHaz0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJmNmYxZTFlMy0zYjIyLTQ3ODEtOTgyZC0yMjUyYWJmNzBkZWEiLCJkZXZpY2Vfa2V5IjoidXMtZWFzdC0xXzkxMTU0YTYxLTYyMjMtNGQwNS1hODBhLTJiZTU3NWZiMzdiNSIsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0xX0ZWTGhKN0NRQSIsImNsaWVudF9pZCI6IjcwM2xtNWQ4b2RjY3UyMXBhZ2NmamtlYWVhIiwib3JpZ2luX2p0aSI6IjQ3YzQ0ZGYwLWQ2NWItNDlkOC05ZDcxLTQ5Y2YxN2RhN2NiZCIsImV2ZW50X2lkIjoiMGVkYThiZTgtOGM1Zi00NTYyLWFjOTEtODZhZGExYjVjNTdiIiwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJhd3MuY29nbml0by5zaWduaW4udXNlci5hZG1pbiIsImF1dGhfdGltZSI6MTc0ODkyOTUwMywiZXhwIjoxNzQ4OTMzMTAzLCJpYXQiOjE3NDg5Mjk1MDMsImp0aSI6ImQwOWRhZTM1LWFiZGQtNDU1Mi04N2IwLWU2ZjhiZTNhZmQ5MyIsInVzZXJuYW1lIjoiZjZmMWUxZTMtM2IyMi00NzgxLTk4MmQtMjI1MmFiZjcwZGVhIn0.TkjcvxPnPu9XZ9Vd533IpANN2mtTFXQAde-5GMvq2BFtFee9uMrlHzVhV3d8o_5W7Q-3aRuMTs-cWLFVSNEb1F3W5ltLac8h-I_PauAcrcG8-iUnJTgwE4_Zv4I-95_75efWQWWKo9R0kAybZ3OXmPa1KiET_Jh00BdUgtALP1c4tXU06qs1q99cIHoBb7WuJWOpknaS1fxV2ZHSZFiQFJ9Z3R1HQ0oswiTJ9R_hw6G7BqKUoRIKEsudykMabc1zfV_YQgUyjQZghTcTLuUEQiwHhGUR0vgsUyTos0-4QNZs-M2WR-55Fpl77nYQmj4JNTTQHhIMNXU6qn-2_HXgqA') // You can set a test token here for isolated testing
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