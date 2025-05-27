<template>
  <div id="app">
    <div>Test app</div>
    <div class="timeseries-viewer-wrapper">
      <div v-if="isReady">
        <TSViewer
        :userToken="userToken" 
        :packageId="packageId"
        :packageType="packageType"
        :is-preview="false"
        />
      </div>
      <div v-else>
        <p>Loading...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import TSViewer from './components/TSViewer/TSViewer.vue'
import { useStore } from 'vuex'

const store = useStore()
const isReady = ref(false)

// test data for a timeseries file in dataset 214 on pennsieve.io: PackageId = N:package:0930a78f-518c-4028-b33e-092fe5df87ad
// test data for a timeseries file in dataset 4982 on pennsieve.net: PackageId = N:package:311c0f93-f1cf-4527-922d-80b61de81d5e
// test data for a timeseries file in dataset N:dataset:1a997f33-4ae7-4b5d-98a2-75620370487d on pennsieve.net: PackageId = N:package:e115e3a8-fba8-4e16-92d0-1394d192d509
const packageId = ref('N:package:e115e3a8-fba8-4e16-92d0-1394d192d509')
const userToken = ref('eyJraWQiOiJ1UUMzRDl1RGpTTlhoNzZJRW1ldExcL05uOGRMazFyaU1LWSt5T2ZTUytHaz0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJmNmYxZTFlMy0zYjIyLTQ3ODEtOTgyZC0yMjUyYWJmNzBkZWEiLCJkZXZpY2Vfa2V5IjoidXMtZWFzdC0xXzFkZDBjYzA1LTRmMDktNDg2NC05ZmExLTEwNTAzZTE4NTllOCIsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0xX0ZWTGhKN0NRQSIsImNsaWVudF9pZCI6IjcwM2xtNWQ4b2RjY3UyMXBhZ2NmamtlYWVhIiwib3JpZ2luX2p0aSI6IjYxOWQ1Yjk4LWVkZjgtNGFiNC04MWI2LTE0ZDMwM2ZlOGM1YyIsImV2ZW50X2lkIjoiOWU4MmM2ZTAtNDFjZi00MTljLWE1YjgtMWY3NDQ1NGRkNzEzIiwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJhd3MuY29nbml0by5zaWduaW4udXNlci5hZG1pbiIsImF1dGhfdGltZSI6MTc0ODM2MDg2OCwiZXhwIjoxNzQ4MzY0NDY4LCJpYXQiOjE3NDgzNjA4NjgsImp0aSI6Ijk4Njc1ZjIyLTBiNTktNGQ4MC04MTkzLTZjMmNjNGZiZDFmMiIsInVzZXJuYW1lIjoiZjZmMWUxZTMtM2IyMi00NzgxLTk4MmQtMjI1MmFiZjcwZGVhIn0.swHMc7b2n1JKNDYzk5cNBwx7UVtyOloYUeFk8pkJ7ZGDQNlt-sp5EtCOZ3clvmBsU-Q3BQtI1za2U4kg_clKeEQhIPACSUxtWzFp2biolDyo_SBZe86WF6SVIGh14iFBAO2hpugxnJ3nl_beZtI2FS3F72-rNQ0XoN9C78FC2IV3ZP230a-5Qay8KiIbQrB8alRfOS5nqpa_yRT0oHaD79D-A7mWtKVfo_JHv6sL4mIozYf6qCikKR44bnnn7fTO6OKDAuu9qne_VwFG3gcPe4og5xKJX4Ea75CPHL9dIodQBi7Fjpn9QEK092Jq7VaFo7wuGGIJDUmDH-8fPOtbag') // You can set a test token here for isolated testing
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

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>