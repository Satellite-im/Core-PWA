<template>
  <vue-scroll class="container" :ops="ops" ref="menu-vs" id="menu-scroll">
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
          <li><NuxtLink to="auth/unlock">Unlock Screen</NuxtLink></li>
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
          <li><NuxtLink to="friends/list">Friends</NuxtLink></li>
          <li><NuxtLink to="files/browse">Files</NuxtLink></li>
        </ul>
      </aside>
    </div>
  </vue-scroll>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Main',
  data() {
    return {
      switch1State: false,
      switch2State: true,
      ops: {
        bar: {
          opacity: '0',
        },
        vuescroll: {
          mode: 'slide',
          zooming: false,
          maxZoom: 1,
          minZoom: 1,
          locking: true,
          bouncing: {
            top: 100,
            bottom: 100,
            left: 0,
            right: 0,
          },
        },
      },
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
.title {
  margin: 0;
}
.is-6 {
  margin: 0;
  padding: 0;
}
</style>
