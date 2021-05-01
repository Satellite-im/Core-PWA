<template>
  <div class="container">
    <div>
      <TypographyTitle :size="1" text="Satellite-Absolute" />
      <TypographySubtitle
        :size="6"
        text="Generic compoment list for use building Satellite."
      />
      <br />

      <UiNumberedWord word="Elephant" :number="1" />
      <UiNumberedWord word="Telephone" :number="2" />
      <UiNumberedWord word="Rendered" :number="24" />

      <!-- Buttons -->
      <TypographyTitle :size="4" text="Buttons" />
      <InteractablesButton
        text="Test Button"
        size="normal"
        type="primary"
        :outlined="true"
        :action="testAction"
      />
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
      <TypographyTitle :size="4" text="Switches" />
      <InteractablesSwitch v-model="switch1State" small />
      <InteractablesSwitch
        v-model="switch1State"
        small
        label="Switch Label Goes Here"
      />
      <br />
      <InteractablesSwitch v-model="switch2State" />
      <InteractablesSwitch
        v-model="switch1State"
        label="Switch Label Goes Here"
      />
      <!-- Meter -->
      <TypographyTitle :size="4" text="Meter" />
      <p>Gradient</p>
      <UiMeter :value="15" />
      <UiMeter :value="19" />
      <UiMeter :value="25" />
      <p>Solid</p>
      <UiMeter :value="25" :solid="true" />

      <!-- Inputs -->
      <TypographyTitle :size="4" text="Inputs" />
      <InteractablesInput v-model="input1Text" :label-text="input1Text" />
      <p>Text: {{ input2Text }}</p>
      <InteractablesInput
        v-model="input2Text"
        size="small"
        input-kind="number"
        type="dark"
      />
      <p>Grouped Input</p>
      <InteractablesInputGroup
        v-model="input2Text"
        size="small"
        input-kind="number"
        type="dark"
        :label-text="input2Text.toString()"
        :loading="inputGroupLoading"
        :action="
          () => {
            inputGroupLoading = !inputGroupLoading
          }
        "
        :icon="{ style: 'far', name: 'lock-open' }"
      />

      <TypographyTitle :size="4" text="Typography" />

      <TypographyTitle :size="1" text="Title 1" />
      <TypographySubtitle :size="1" text="Subtitle 1" />

      <TypographyTitle :size="2" text="Title 2" />
      <TypographySubtitle :size="2" text="Subtitle 2" />

      <TypographyTitle :size="3" text="Title 3" />
      <TypographySubtitle :size="3" text="Subtitle 3" />

      <TypographyTitle :size="4" text="Title 4" />
      <TypographySubtitle :size="4" text="Subtitle 4" />

      <TypographyTitle :size="5" text="Title 5" />
      <TypographySubtitle :size="5" text="Subtitle 5" />

      <TypographyTitle :size="6" text="Title 6" />
      <TypographySubtitle :size="6" text="Subtitle 6" />
      <br />
      <TypographyLabel text="Label Component" />
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
      inputGroupLoading: false,
    }
  },
  methods: {
    testAction(): void {
      alert('test')
    },
  },
})
</script>

<style scoped lang="less">
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  text-align: center;
}
</style>
