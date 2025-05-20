<template>
  <div id="app">
    <div>Test app</div>
    <div class="timeseries-viewer-wrapper">
      <TSViewer
      :userToken="userToken" 
      :packageId="packageId"
      :packageType="packageType"
      :is-preview="false"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import TSViewer from './components/TSViewer/TSViewer.vue'
// test data for a timeseries file in dataset 214 on pennsieve.io: PackageId = N:package:0930a78f-518c-4028-b33e-092fe5df87ad
// test data for a timeseries file in dataset 4982 on pennsieve.net: PackageId = N:package:311c0f93-f1cf-4527-922d-80b61de81d5e
// test data for a timeseries file in dataset N:dataset:1a997f33-4ae7-4b5d-98a2-75620370487d on pennsieve.net: PackageId = N:package:e115e3a8-fba8-4e16-92d0-1394d192d509
const packageId = ref('N:package:e115e3a8-fba8-4e16-92d0-1394d192d509')
const userToken = ref('eyJraWQiOiJ1UUMzRDl1RGpTTlhoNzZJRW1ldExcL05uOGRMazFyaU1LWSt5T2ZTUytHaz0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJmNmYxZTFlMy0zYjIyLTQ3ODEtOTgyZC0yMjUyYWJmNzBkZWEiLCJkZXZpY2Vfa2V5IjoidXMtZWFzdC0xXzAwNmU2NjU2LWZiNjktNGQ1OS1iZWYyLWExOWQxMDlmOWY2YiIsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0xX0ZWTGhKN0NRQSIsImNsaWVudF9pZCI6IjcwM2xtNWQ4b2RjY3UyMXBhZ2NmamtlYWVhIiwib3JpZ2luX2p0aSI6ImVjNjEyZjk2LTZlYTAtNGJmNy1hNDY1LTE4NDg4NGZiNTg0OCIsImV2ZW50X2lkIjoiNjk3ZDdkYTQtNTRkMi00ZmYyLWE1MzAtZWU2NTk2MDg4MjkxIiwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJhd3MuY29nbml0by5zaWduaW4udXNlci5hZG1pbiIsImF1dGhfdGltZSI6MTc0NzM0MzYwOSwiZXhwIjoxNzQ3MzQ3MjA5LCJpYXQiOjE3NDczNDM2MDksImp0aSI6IjJlZGQzYTkzLWFjOGYtNGZmNC04YWJjLWMxMGIwZjZmZDE2MiIsInVzZXJuYW1lIjoiZjZmMWUxZTMtM2IyMi00NzgxLTk4MmQtMjI1MmFiZjcwZGVhIn0.Z_T8Yp16z_W6noISnsT9OwA_ur172LUhktvLDm_GAt6upLvCArxuQ2mrAQtN7JDKrWcTpdQCRuUTEGzoFjz7dCLoKasb_ybanwRbt_5SeFuJL3Dp0PXq_TWQdQSud205ElnvYEi6B6E2Q_JYOaWjJEDepG3sJRxAMXhE134FT3FZBSJ6pvVezc6HbTpPy8EXtw4v07mGCt6Q-cG8h4_E86Sn1pgOByxbMd7fVYACDXHEtJjOVzwLDF2_sfYMxj0nw60I6c9qOuNGyyqX_QcmhGk9wkjSts320KBRnKWpm9rhR9tRA0ufs2EL9Sf_nHXfsae55LiXNLp5cT-DOnIQaQ') // You can set a test token here for isolated testing
const packageType = ref('TimeSeries')
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