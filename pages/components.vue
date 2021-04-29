<template>
  <div class="container">
    <div>
      <h1 class="title">Satellite-Absolute</h1>
      <br />

      <!-- Buttons -->
      <h3>Buttons</h3>
      <InteractablesButton
        text="Test Button"
        size="normal"
        type="primary"
        :icon="{ style: 'far', name: 'arrow-circle-right' }"
        :outlined="false"
        :action="testAction"
      />
      <InteractablesButton
        text="Test Button"
        size="normal"
        type="dark"
        :action="() => {}"
        :loading="true"
        loading-text="Loading..."
      />

      <!-- Switches -->
      <h3>Switches</h3>
      <InteractablesSwitch v-model="switch1State" />
      <br />
      <InteractablesSwitch v-model="switch2State" />

      <!-- Meter -->
      <h3>Meter</h3>
      <p>Gradient</p>
      <UiMeter :value="15" />
      <UiMeter :value="19" />
      <UiMeter :value="25" />
      <p>Solid</p>
      <UiMeter :value="25" :solid="true" />

      <!-- Inputs -->
      <h3>Inputs</h3>
      <p>Text: {{ input1Text }}</p>
      <InteractablesInput v-model="input1Text" />
      <p>Text: {{ input2Text }}</p>
      <InteractablesInput
        v-model="input2Text"
        size="small"
        input-kind="number"
        type="dark"
      />
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
      input1Text: '',
      input2Text: 0,
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
