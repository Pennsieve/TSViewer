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

// test data for a timeseries file in dataset 214 on pennsieve.io: PackageId = N:package:0930a78f-518c-4028-b33e-092fe5df87ad
// test data for a timeseries file in dataset 4982 on pennsieve.net: PackageId = N:package:311c0f93-f1cf-4527-922d-80b61de81d5e
// test data for a timeseries file in dataset N:dataset:1a997f33-4ae7-4b5d-98a2-75620370487d on pennsieve.net: PackageId = N:package:e115e3a8-fba8-4e16-92d0-1394d192d509
const packageId = ref('N:package:e115e3a8-fba8-4e16-92d0-1394d192d509')
const userToken = ref('eyJraWQiOiJ1UUMzRDl1RGpTTlhoNzZJRW1ldExcL05uOGRMazFyaU1LWSt5T2ZTUytHaz0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJmNmYxZTFlMy0zYjIyLTQ3ODEtOTgyZC0yMjUyYWJmNzBkZWEiLCJkZXZpY2Vfa2V5IjoidXMtZWFzdC0xXzI0ZGZkNDQxLWIzN2EtNDgxMy05MWU5LWEzNmYxMGIxMWMzNyIsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0xX0ZWTGhKN0NRQSIsImNsaWVudF9pZCI6IjcwM2xtNWQ4b2RjY3UyMXBhZ2NmamtlYWVhIiwib3JpZ2luX2p0aSI6ImIwMGEyNWFmLWIxMzQtNDdmZS05NWNiLTZhOTYyNTc3OTY1NyIsImV2ZW50X2lkIjoiNTA2ZGRmYzEtZWVjNi00MDU4LTk1ZGYtYmE1YzI3OWMwYzBhIiwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJhd3MuY29nbml0by5zaWduaW4udXNlci5hZG1pbiIsImF1dGhfdGltZSI6MTc0ODQ0ODk5OCwiZXhwIjoxNzQ4NDUyNTk4LCJpYXQiOjE3NDg0NDg5OTgsImp0aSI6IjE1OWY1Njk3LTRmMDEtNDBlZS05Nzk5LTNhYTM0NGMxMDE5OCIsInVzZXJuYW1lIjoiZjZmMWUxZTMtM2IyMi00NzgxLTk4MmQtMjI1MmFiZjcwZGVhIn0.AoJSCVc7tJL1xbfVGNDuVGNDiuPYYj6j2TUTzBZV16qbZEC2DMjjQ_ums5pT8i8PkqOrQOvViJkU1ujcc22bdg4JXIZlwCNmE3C4T2egPJt1WSkJep2EqRf7D0tTZqPCjlIIBGfsBeudRVYBcIXPWhTZ7HmhTW4rmVxYwpuK7TnOQ_LQ-ze3sYkDXUw_9sxpw0Qvcwnhcq8EFn33XYy1CSMJTgwvA2wQxJYYeUP88RnyLsemxntKFb2ufa3Tscg0K9H0odgFLeYOBMmRkwK8AKxBZ017nH403ileQbefVGnhp5F7mc_0-_eLVZKtDEkyjrNeLptlvZwB3t_b2c4bvA') // You can set a test token here for isolated testing
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