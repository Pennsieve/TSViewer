<template>
  <div id="app">
    <div> Test app</div>
  </div>
</template>

<script>

export default {
  name: 'App',
  data() {
    return {
      // test data for a timeseries file in dataset 214 on pennsieve.io: PackageId = N:package:0930a78f-518c-4028-b33e-092fe5df87ad
      // test data for a timeseries file in dataset 4982 on pennsieve.net: PackageId = N:package:311c0f93-f1cf-4527-922d-80b61de81d5e
      packageId: 'N:package:311c0f93-f1cf-4527-922d-80b61de81d5e',
      // In order to test in isolation you will need to set this user token. You can retrieve it by logging into pennsieve.net and inspecting the network calls for the api_key value
      userToken: 'eyJraWQiOiJ1UUMzRDl1RGpTTlhoNzZJRW1ldExcL05uOGRMazFyaU1LWSt5T2ZTUytHaz0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJlMjYwMDE2ZS04MmU0LTRlNmItYTAyYS0wMTcxNzgwZmE5YjQiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6Im9wZW5pZCIsImF1dGhfdGltZSI6MTY1MzQwODQxMCwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tXC91cy1lYXN0LTFfRlZMaEo3Q1FBIiwiZXhwIjoxNjUzNDEyMDEwLCJpYXQiOjE2NTM0MDg0MTEsInZlcnNpb24iOjIsImp0aSI6ImMwNDVlODllLTg3NjktNGQxMi05OWUzLWVkZDUwMmNhNzllNSIsImNsaWVudF9pZCI6IjcwM2xtNWQ4b2RjY3UyMXBhZ2NmamtlYWVhIiwidXNlcm5hbWUiOiJlMjYwMDE2ZS04MmU0LTRlNmItYTAyYS0wMTcxNzgwZmE5YjQifQ.sfhRcP0U0qU52o-WJv7D0QnKdfiFLl9S8QnXTmNgs5zOLYaqwnY6Ml4u_NT6F6959zvTlS0us-KKG5j94hGKhiB8bLnm3WnTCpKgMzcJFseqNmhqSSz0w35s302ayAAskxKx9jQYvNM0vF5T3zX2_ftmi9gx6CNOckiFpiMh3tMhVyEJJXVcjBULApCgLFXru3Y4VLYGqnI8iXHH4hhQyg1L-oo-S2FalgYJFDoQbDmjyv6TBcDSeZnTNVe9DYGWLzyade_HlFhfFVzF8ATD8DSTbJ29WoyUiH7CVGYR65faZnD1FnKUWTUDpySFLsFvWSoCyyt91LZ_8LXYgi3YXg',
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
