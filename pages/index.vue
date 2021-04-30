<template>
  <div class="container">
    <div>
      <h1 class="title">Satellite-Absolute</h1>
      <h3>Links</h3>
      <ul>
        <li><NuxtLink to="components">Browse Components</NuxtLink></li>
        <li><NuxtLink to="generic/loading">Loading Screen</NuxtLink></li>
        <li><NuxtLink to="auth/unlock">Unlock Screen</NuxtLink></li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data() {
    return {
      switch1State: false,
      switch2State: true,
    }
  },
  methods: {
    testAction(): void {
      alert('test')
    },
  },
})
</script>

<style lang="less">
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  text-align: center;
}
</style>
