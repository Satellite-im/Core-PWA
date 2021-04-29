<template>
  <div class="container">
    <div>
      <h1 class="title">Satellite-Absolute</h1>
      <h3>Links</h3>
      <ul>
        <li><NuxtLink to="components">Browse Components</NuxtLink></li>
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
@import 'bulma/css/bulma.css';

.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 20px;
  color: #35495e;
  letter-spacing: 1px;
  margin-bottom: 4rem;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
