<template>
  <div id="app">
    <h1>Test App Using TSViewer Component</h1>
    <TSViewer/>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const sampleData = ref([
  { label: 'Alpha', value: 1 },
  { label: 'Beta', value: 2 },
]);
</script>