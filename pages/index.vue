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
          <li><NuxtLink to="auth/unlock">Unlok Screen</NuxtLink></li>
        </ul>
        <p class="menu-label">Setup</p>
        <ul class="menu-list">
          <li><NuxtLink to="setup/disclaimer">Account Creation</NuxtLink></li>
          <li><NuxtLink to="setup/phrase">Account Phrase</NuxtLink></li>
        </ul>
        <p class="menu-label">Settings</p>
        <ul class="menu-list">
          <li><NuxtLink to="settings/profile">Profile</NuxtLink></li>
          <li><NuxtLink to="settings/account">Account</NuxtLink></li>
          <li><NuxtLink to="settings/audio">Audio</NuxtLink></li>
          <li><NuxtLink to="settings/storage">Storage</NuxtLink></li>
          <li><NuxtLink to="settings/personalize">Personalize</NuxtLink></li>
        </ul>
      </aside>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Main',
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

<style lang="less" scoped>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  text-align: center;
}
</style>
