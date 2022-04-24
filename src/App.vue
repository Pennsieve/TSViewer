<template>
  <div id="app">
    <TSViewer />
  </div>
</template>

<script>
import TSViewer from "./components/TSViewer.vue"

export default {
  name: 'App',
  components: {
    TSViewer
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
