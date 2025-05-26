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
const userToken = ref('eyJraWQiOiJ1UUMzRDl1RGpTTlhoNzZJRW1ldExcL05uOGRMazFyaU1LWSt5T2ZTUytHaz0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJmNmYxZTFlMy0zYjIyLTQ3ODEtOTgyZC0yMjUyYWJmNzBkZWEiLCJkZXZpY2Vfa2V5IjoidXMtZWFzdC0xX2ZjYmFlNjcyLTlkY2UtNDk5Mi1iZWYwLTQ3NTM1MzUxNjljYiIsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0xX0ZWTGhKN0NRQSIsImNsaWVudF9pZCI6IjcwM2xtNWQ4b2RjY3UyMXBhZ2NmamtlYWVhIiwib3JpZ2luX2p0aSI6IjU3NzA1NTY5LWE1M2YtNGNlNS1hOWVkLTYwMTZkNGE4ZTUzOSIsImV2ZW50X2lkIjoiYjQxZmM5NWMtMzUzOC00MWE3LTk2NzctNTUxMTgzMmVmNmRlIiwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJhd3MuY29nbml0by5zaWduaW4udXNlci5hZG1pbiIsImF1dGhfdGltZSI6MTc0ODMwMjIyOSwiZXhwIjoxNzQ4MzA1ODI5LCJpYXQiOjE3NDgzMDIyMjksImp0aSI6ImZiYjUyYTUxLWFhMWItNDRkZC1iOGEyLTUwZGFlMDA3ZDNlNiIsInVzZXJuYW1lIjoiZjZmMWUxZTMtM2IyMi00NzgxLTk4MmQtMjI1MmFiZjcwZGVhIn0.O5GhPFwZJelw0vh66bnO8hCcbO6cBp1ydl5juyDO9rbqTOSVWLDdLvrAI7UnNK0P2PnzuSQGXfp3V_vG0T4gh-UOiBdK6zM4qLUp7nDm2QUz5Ud1cPynmN9siDrIb_vL5AneMtlDxX-xzlfocKlYYta7A19Nra0J8uIpp6ic4BqCzvnzfgZi4B3nHfBT956yOMyxIYIGOLpipe0ldHP2cGECX2spEqNcFDlLs_oJTGtPn9YcQXhtNpQFNMMhFW98Ufd1ZwdMM7a-LFKB1QdC-aU8DG6pnaViXeiaamMTJUD5fixM67rh7hb-gPQwGE_vcBeaXubvgrnPOlF6ZPBUxQ') // You can set a test token here for isolated testing
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