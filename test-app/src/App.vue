<template>
  <div id="app">
    <div>Test app</div>
    <div class="timeseries-viewer-wrapper">
      <div v-if="isReady">
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
const userToken = ref('eyJraWQiOiJ1UUMzRDl1RGpTTlhoNzZJRW1ldExcL05uOGRMazFyaU1LWSt5T2ZTUytHaz0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJmNmYxZTFlMy0zYjIyLTQ3ODEtOTgyZC0yMjUyYWJmNzBkZWEiLCJkZXZpY2Vfa2V5IjoidXMtZWFzdC0xXzI0ZDBmMmQxLTcyNmQtNGY4Mi05NjU4LWI5MmQzNzcwNTA0OCIsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0xX0ZWTGhKN0NRQSIsImNsaWVudF9pZCI6IjcwM2xtNWQ4b2RjY3UyMXBhZ2NmamtlYWVhIiwib3JpZ2luX2p0aSI6IjQxNmU4YzIyLWEyMDYtNDRjNy05ODYxLTYwNTRhNjJjYjU5MSIsImV2ZW50X2lkIjoiMWI1OWYwZGEtZThiNS00NGM4LWEyOWUtODFiODRlM2ZkZmYwIiwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJhd3MuY29nbml0by5zaWduaW4udXNlci5hZG1pbiIsImF1dGhfdGltZSI6MTc0ODU1MTM3MSwiZXhwIjoxNzQ4NTU4Njk5LCJpYXQiOjE3NDg1NTUwOTksImp0aSI6IjFjMTgxMTVlLTMwZjAtNGQ1ZS04OGI2LWQ5ODIzNTQwYmU2NiIsInVzZXJuYW1lIjoiZjZmMWUxZTMtM2IyMi00NzgxLTk4MmQtMjI1MmFiZjcwZGVhIn0.AR8zVgaYVTzx03P_CIaibXEUo_q7yUyIqZzu8j3gK5-ciMTp6MNoYG26A4o87K6DIjQ5yU4i92TpX8Vylma-i6CsMc6X0pvoVRQLUjW2Hej0zvhyN3CcXO6t6vQ3-rGcyFKfetLgk3kqMmk67H1rXqKzBV2ZPUiqhDChz2o9u3sCauUwORevcX1AgjJtMLJHu76zAFE1eCwwKSWcVcDMqwuzwgOS3OoL_7CnNhFd9QawiRyfAF0LBi_sLdXNFinUNwKXOnFsEz_lknmAs5_CxTgZUOcyRKYpeAbjh87r6G9moWh409EVBJv6TCgdbdhqNKkmnIqbZCZ0f614QWDmeA') // You can set a test token here for isolated testing
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