<template>
  <div class="container">
    <div>
      <h1 class="title">Satellite-Absolute</h1>

      <aside class="menu">
        <p class="menu-label">General</p>
        <ul class="menu-list">
          <li><NuxtLink to="components">Components</NuxtLink></li>
          <li><NuxtLink to="generic/loading">Loading Screen</NuxtLink></li>
        </ul>
        <p class="menu-label">Auth</p>
        <ul class="menu-list">
          <li><NuxtLink to="generic/loading">Loading Screen</NuxtLink></li>
        </ul>
        <p class="menu-label">setup</p>
        <ul class="menu-list">
          <li><NuxtLink to="setup/disclaimer">Account Creation</NuxtLink></li>
          <li><NuxtLink to="setup/phrase">Account Phrase</NuxtLink></li>
        </ul>
      </aside>
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
