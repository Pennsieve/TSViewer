<template>
  <div id="app">
    <TSViewer 
      :userToken="userToken"
      :package="selectedPackage"
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
      // test data for a timeseries file in dataset 4982 on pennsieve.net
      selectedPackage: {"content":{"id":"N:package:311c0f93-f1cf-4527-922d-80b61de81d5e","nodeId":"N:package:311c0f93-f1cf-4527-922d-80b61de81d5e","name":"test.edf","packageType":"TimeSeries","datasetId":"N:dataset:35881ab1-e289-42b6-a21c-7ded18b54be7","datasetNodeId":"N:dataset:35881ab1-e289-42b6-a21c-7ded18b54be7","ownerId":24,"state":"READY","createdAt":"2021-12-21T18:53:58.682712Z","updatedAt":"2021-12-21T19:06:29.298564Z","intId":18972,"datasetIntId":1660},"properties":[{"category":"Pennsieve","properties":[{"key":"subtype","value":"Timeseries","dataType":"string","fixed":false,"hidden":true,"display":"Timeseries"},{"key":"icon","value":"Timeseries","dataType":"string","fixed":false,"hidden":true,"display":"Timeseries"}]}],"children":[],"channels":[{"content":{"id":"N:channel:6587ba3b-acb3-4171-8ae7-1fc1c47afb02","packageId":"N:package:311c0f93-f1cf-4527-922d-80b61de81d5e","name":"ramp","start":1301921822000000,"end":1301922421990000,"unit":"uV","rate":200,"channelType":"CONTINUOUS","group":"default","lastAnnotation":0,"createdAt":"2021-12-21T18:59:42.441172Z"},"properties":[]},{"content":{"id":"N:channel:857aa377-8179-47e5-837b-898fb64ac688","packageId":"N:package:311c0f93-f1cf-4527-922d-80b61de81d5e","name":"pulse","start":1301921822000000,"end":1301922421990000,"unit":"uV","rate":200,"channelType":"CONTINUOUS","group":"default","lastAnnotation":0,"createdAt":"2021-12-21T18:59:42.628489Z"},"properties":[]},{"content":{"id":"N:channel:8580578e-7045-43dd-8a1a-1ee05a517cbc","packageId":"N:package:311c0f93-f1cf-4527-922d-80b61de81d5e","name":"noise","start":1301921822000000,"end":1301922421990000,"unit":"uV","rate":200,"channelType":"CONTINUOUS","group":"default","lastAnnotation":0,"createdAt":"2021-12-21T19:00:25.119243Z"},"properties":[]},{"content":{"id":"N:channel:8bc29a43-9624-428c-92ff-a57ad80d6753","packageId":"N:package:311c0f93-f1cf-4527-922d-80b61de81d5e","name":"sine 1 Hz","start":1301921822000000,"end":1301922421990000,"unit":"uV","rate":200,"channelType":"CONTINUOUS","group":"default","lastAnnotation":0,"createdAt":"2021-12-21T19:00:27.008624Z"},"properties":[]},{"content":{"id":"N:channel:9bcc73d7-574c-40cb-bf7e-0ddf6d4e0d3c","packageId":"N:package:311c0f93-f1cf-4527-922d-80b61de81d5e","name":"sine 8.1777 Hz","start":1301921822000000,"end":1301922421990000,"unit":"uV","rate":200,"channelType":"CONTINUOUS","group":"default","lastAnnotation":0,"createdAt":"2021-12-21T19:00:59.086478Z"},"properties":[]},{"content":{"id":"N:channel:4414f836-ba49-4e44-a1db-2c89bee836e2","packageId":"N:package:311c0f93-f1cf-4527-922d-80b61de81d5e","name":"sine 8 Hz","start":1301921822000000,"end":1301922421990000,"unit":"uV","rate":200,"channelType":"CONTINUOUS","group":"default","lastAnnotation":0,"createdAt":"2021-12-21T19:00:59.292772Z"},"properties":[]},{"content":{"id":"N:channel:18ef952f-f97c-4cbb-95f3-806a67d4665a","packageId":"N:package:311c0f93-f1cf-4527-922d-80b61de81d5e","name":"sine 15 Hz","start":1301921822000000,"end":1301922421990000,"unit":"uV","rate":200,"channelType":"CONTINUOUS","group":"default","lastAnnotation":0,"createdAt":"2021-12-21T19:02:40.21106Z"},"properties":[]},{"content":{"id":"N:channel:51132de6-7432-42ef-b78c-58fa1238def9","packageId":"N:package:311c0f93-f1cf-4527-922d-80b61de81d5e","name":"sine 50 Hz","start":1301921822000000,"end":1301922421990000,"unit":"uV","rate":200,"channelType":"CONTINUOUS","group":"default","lastAnnotation":0,"createdAt":"2021-12-21T19:02:41.289992Z"},"properties":[]},{"content":{"id":"N:channel:6faf8f60-3a07-4ab6-b6d9-ef9891520d4a","packageId":"N:package:311c0f93-f1cf-4527-922d-80b61de81d5e","name":"sine 8.5 Hz","start":1301921822000000,"end":1301922421990000,"unit":"uV","rate":200,"channelType":"CONTINUOUS","group":"default","lastAnnotation":0,"createdAt":"2021-12-21T19:02:41.543665Z"},"properties":[]},{"content":{"id":"N:channel:52779a70-5963-4b7c-9086-b841bae45126","packageId":"N:package:311c0f93-f1cf-4527-922d-80b61de81d5e","name":"sine 17 Hz","start":1301921822000000,"end":1301922421990000,"unit":"uV","rate":200,"channelType":"CONTINUOUS","group":"default","lastAnnotation":0,"createdAt":"2021-12-21T19:02:41.503821Z"},"properties":[]},{"content":{"id":"N:channel:40761a8e-e35d-4fb8-8123-21b298fe7f21","packageId":"N:package:311c0f93-f1cf-4527-922d-80b61de81d5e","name":"squarewave","start":1301921822000000,"end":1301922421990000,"unit":"uV","rate":200,"channelType":"CONTINUOUS","group":"default","lastAnnotation":0,"createdAt":"2021-12-21T19:03:26.680259Z"},"properties":[]}],"storage":2711728,"extension":"edf"},
      userToken: 'eyJraWQiOiJ1UUMzRDl1RGpTTlhoNzZJRW1ldExcL05uOGRMazFyaU1LWSt5T2ZTUytHaz0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI2NWQ5NDMwYi01MjJmLTRkMjUtYWU5ZS02YzZhYmRiODA3MzkiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6Im9wZW5pZCIsImF1dGhfdGltZSI6MTY1MTI2MTkzMSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tXC91cy1lYXN0LTFfRlZMaEo3Q1FBIiwiZXhwIjoxNjUxMjY1NTMxLCJpYXQiOjE2NTEyNjE5MzEsInZlcnNpb24iOjIsImp0aSI6ImNlYTMzMmY2LTRlNWItNGY4Yy1iNDgzLTY1MzBiMTE3MGFiMyIsImNsaWVudF9pZCI6IjcwM2xtNWQ4b2RjY3UyMXBhZ2NmamtlYWVhIiwidXNlcm5hbWUiOiI2NWQ5NDMwYi01MjJmLTRkMjUtYWU5ZS02YzZhYmRiODA3MzkifQ.DKHKjp85lLRCPOl0JiQzDMNi1nhHVrSBQI1EGio6Qe1ceDb3XW5mVo_zhWuRZEgURyWRx1dl0cP91HO6ReHG_N97pkTsBUDNCG4sKm0ghsiE_RGuBeVNNpRZBHLUPoD46fj1KXKYQkNKQVTjk2_vUvtCXaGVWsLI0jMzJCBRPzJW0ePOmpvN2JaotSaIvmANaXrtw0xbUqNcGyofp6IqdvKlc1ElJwAzT1UcgCovcMDkXJjrtErIGKTpokA31E6n72Zrw6go_hpzs-wJnwOB_BMx8buz-wFm8CJ_k-Pn3pslVbJZz6CeyeXDCe0tE4dRwCkAZHSmDpW_2TTmxkEZIw'
    }
  }
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
