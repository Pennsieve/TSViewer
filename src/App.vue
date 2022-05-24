<template>
  <div id="app">
    <TSViewer
      :userToken="userToken" 
      :packageId="packageId"
      :packageType="packageType"
    />
  </div>
</template>

<script>
import TSViewer from "./components/TSViewer.vue"

export default {
  name: 'App',
  components: {
    TSViewer
  },
  data() {
    return {
      // test data for a timeseries file in dataset 214 on pennsieve.io: PackageId = N:package:0930a78f-518c-4028-b33e-092fe5df87ad
      // test data for a timeseries file in dataset 4982 on pennsieve.net: PackageId = N:package:311c0f93-f1cf-4527-922d-80b61de81d5e
      packageId: 'N:package:311c0f93-f1cf-4527-922d-80b61de81d5e',
      // In order to test in isolation you will need to set this user token. You can retrieve it by logging into pennsieve.net and inspecting the network calls for the api_key value
      userToken: 'eyJraWQiOiJ1UUMzRDl1RGpTTlhoNzZJRW1ldExcL05uOGRMazFyaU1LWSt5T2ZTUytHaz0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJlMjYwMDE2ZS04MmU0LTRlNmItYTAyYS0wMTcxNzgwZmE5YjQiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6Im9wZW5pZCIsImF1dGhfdGltZSI6MTY1MzMxMjI1NSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tXC91cy1lYXN0LTFfRlZMaEo3Q1FBIiwiZXhwIjoxNjUzMzE1ODU1LCJpYXQiOjE2NTMzMTIyNTUsInZlcnNpb24iOjIsImp0aSI6ImUxMmMxZmRhLWEzNzItNDAyNi1iOTlkLWEzNmI3NmM4NzNkZSIsImNsaWVudF9pZCI6IjcwM2xtNWQ4b2RjY3UyMXBhZ2NmamtlYWVhIiwidXNlcm5hbWUiOiJlMjYwMDE2ZS04MmU0LTRlNmItYTAyYS0wMTcxNzgwZmE5YjQifQ.iTYYckB5eBHWu8pDLPacCLi9r0Rnl6ieH_27qwjhtESFVSDBOJQy0IWAXaxlYpvjpoHYPyy5DGZjm_pgnXSSfcvoUVVrWyTwY4FgIpO9qvQ7bHyRgTz2G8yP0usq0Yh3bNAG4JUARmuJAlBU2uam6jHRXIPvGaIaEmZYxNfMQK2wRnCDb8dP-VqA1rreYnvsCJSGxwdXSOKXIScOUaWHTwTeSdnXo_UXerD8Yl5CMMK4GJHgYfa_TZD78-XQv9I1INJDaqJpjeh2RximRN40Hh8Uji4rCzviEvvyfK-y13ZbQvEnEYk449wN1ScTneJgOJCxB_Rmz3P6_ICpC7cyNg',
      packageType: 'TimeSeries',
    }
  },
}
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
