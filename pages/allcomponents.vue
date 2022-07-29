<template>
  <div class="container hidden-scroll">
    <div>
      <UiSpacer :height="25" />
      <img src="~/static/icon.png" alt="" />
      <TypographyTitle :size="5" text="Satellite Absolute" />
      <TypographySubtitle :size="5" text="UI Preview" />
      <UiSpacer :height="25" />

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
        <p class="menu-label">General</p>
        <ul class="menu-list">
          <li><NuxtLink to="settings/profile">Settings</NuxtLink></li>
          <li><NuxtLink to="chat/direct">Chat</NuxtLink></li>
          <li><NuxtLink to="friends">Friends</NuxtLink></li>
          <li><NuxtLink to="files">Files</NuxtLink></li>
        </ul>
      </aside>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'AllComponents',
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
  display: flex;
  justify-content: center;
  text-align: center;
}
.title {
  margin: 0;
}
.is-6 {
  margin: 0;
  padding: 0;
}
</style>
