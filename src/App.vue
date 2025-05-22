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
const userToken = ref('eyJraWQiOiJ1UUMzRDl1RGpTTlhoNzZJRW1ldExcL05uOGRMazFyaU1LWSt5T2ZTUytHaz0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJmNmYxZTFlMy0zYjIyLTQ3ODEtOTgyZC0yMjUyYWJmNzBkZWEiLCJkZXZpY2Vfa2V5IjoidXMtZWFzdC0xX2I2MjZjMWIzLWM1NDctNDVlMS04N2EzLTBiMzQxMWQxY2I4MyIsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0xX0ZWTGhKN0NRQSIsImNsaWVudF9pZCI6IjcwM2xtNWQ4b2RjY3UyMXBhZ2NmamtlYWVhIiwib3JpZ2luX2p0aSI6IjY3MzcwZTAwLTczZjUtNGYyNi05ZTVkLTU3YzBkNTk1ZmVlNCIsImV2ZW50X2lkIjoiYjU5MDE3MjEtMmU4Yy00ZGZmLTk3YmItMjY2MDE3OGMzMTJkIiwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJhd3MuY29nbml0by5zaWduaW4udXNlci5hZG1pbiIsImF1dGhfdGltZSI6MTc0NzkzODYwMSwiZXhwIjoxNzQ3OTQyMjAxLCJpYXQiOjE3NDc5Mzg2MDEsImp0aSI6IjYwYTY3YTk4LWIzMTMtNGEzYi1hYTZhLWVlMDAzZTg2MTZkNyIsInVzZXJuYW1lIjoiZjZmMWUxZTMtM2IyMi00NzgxLTk4MmQtMjI1MmFiZjcwZGVhIn0.Ch3mRXPu-sqbE8G2uEKiX-UHI0xQ5lXFZLJG1zH8Gjsc36QfeAJJ2h6IUPEnI7_ogaIgDVJmsahbdWdpIlPvWTD5vIySGAQueVo4hltpb4E_laMnNxBCvcOXoYU6tbHJS0w6yJXcFXjLRhG-Fe7YGROqUtKunreBBzbLVUCNVDsa8JOGayicPD-dGrd7gn7LjDRg_bpFUoGmpmp1N5JjcpHnkjJ1mQYHTwAaD4E8OVx429Pfg2qWGaEjAa-NnFFl80aAz885nA2N3F05iIe6zpBSuZA4FrmwhOzxVYFqjN9H7usAh7mY9w48zRqdX7HgmecHRWivH9I5KDKMCJXGUg') // You can set a test token here for isolated testing
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