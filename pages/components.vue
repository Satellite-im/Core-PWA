<template>
  <div v-scroll-lock="true" class="container">
    <div>
      <TypographyTitle :size="1" text="Satellite-Absolute" />
      <TypographySubtitle
        :size="6"
        text="Generic compoment list for use building Satellite."
      />
      <br />

      <TypographyLabel text="Loading" />
      <div class="card">
        <div class="card-content">
          <div class="content">
            <UiLoadersGenericContent :count="3" />
          </div>
        </div>
      </div>

      <TypographyLabel text="Loading Logo" />
      <div class="card">
        <div class="card-content">
          <div class="content">
            <UiLoadersLogoLoader :size="64" />
          </div>
        </div>
      </div>

      <TypographyLabel text="Loading" />
      <div class="card">
        <div class="card-content">
          <div class="content">
            <UiLoadersMessage :count="3" />
          </div>
        </div>
      </div>

      <TypographyLabel text="Loading" />
      <div class="card">
        <div class="card-content">
          <div class="content">
            <UiLoadersLoadingInline text="Loading..." />
          </div>
        </div>
      </div>

      <TypographyLabel text="Badged Icons" />
      <div class="card">
        <div class="card-content">
          <div class="content">
            <UiBadgedIcon icon="user" :size="26" :badge-count="0" />

            <UiBadgedIcon icon="user" :size="26" :badge-count="33" />

            <UiBadgedIcon icon="user" :size="16" :badge-count="3" />
          </div>
        </div>
      </div>

      <TypographyLabel text="Selects" />
      <div class="card">
        <div class="card-content">
          <div class="content">
            <TypographyLabel :text="`Select: ${selectValue}`" />
            <br />
            <InteractablesSelect
              v-model="selectValue"
              size="small"
              :options="[
                { text: 'Option 1', value: 1 },
                { text: 'Option 2', value: 2 },
                { text: 'Option 3', value: 3 },
              ]"
            />
            <InteractablesSelect
              v-model="selectValue"
              size="normal"
              :options="[
                { text: 'Option 1', value: 1 },
                { text: 'Option 2', value: 2 },
                { text: 'Option 3', value: 3 },
              ]"
            />
            <br />
            <InteractablesSelect
              v-model="selectValue"
              full-width
              :options="[
                { text: 'Option 1', value: 1 },
                { text: 'Option 2', value: 2 },
                { text: 'Option 3', value: 3 },
              ]"
            />
          </div>
        </div>
      </div>

      <TypographyLabel text="Numbered Words" />
      <div class="card">
        <div class="card-content">
          <div class="content">
            <TypographyNumberedWord word="Elephant" :number="1" />
            <TypographyNumberedWord word="Telephone" :number="2" />
            <TypographyNumberedWord word="Rendered" :number="24" />
          </div>
        </div>
      </div>

      <!-- Buttons -->
      <TypographyLabel text="Buttons" />
      <div class="card">
        <div class="card-content">
          <div class="content">
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
          </div>
        </div>
      </div>
      <!-- Switches -->
      <TypographyLabel text="Switches" />
      <div class="card">
        <div class="card-content">
          <div class="content">
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
          </div>
        </div>
      </div>

      <!-- Meter -->
      <TypographyLabel text="Meter" />
      <div class="card">
        <div class="card-content">
          <div class="content">
            <p>Gradient</p>
            <UiMeter :value="60" />
            <UiMeter :value="75" />
            <UiMeter :value="100" />
            <p>Solid</p>
            <UiMeter :value="100" :solid="true" />
          </div>
        </div>
      </div>

      <!-- Inputs -->
      <TypographyLabel text="Inputs" />
      <div class="card">
        <div class="card-content">
          <div class="content">
            <InteractablesInput v-model="input1Text" :label-text="input1Text" />
            <p>Text: {{ input2Text }}</p>
            <InteractablesInput
              v-model="input2Text"
              size="small"
              input-kind="number"
              type="primary"
            />
            <p>Grouped Input</p>
            <InteractablesInputGroup
              v-model="input2Text"
              size="small"
              input-kind="number"
              type="primary"
              :label-text="input2Text.toString()"
              :loading="inputGroupLoading"
              :action="
                () => {
                  inputGroupLoading = !inputGroupLoading
                }
              "
              :icon="{ style: 'far', name: 'lock-open' }"
            />
          </div>
        </div>
      </div>

      <TypographyLabel text="Typography" />
      <div class="card">
        <div class="card-content">
          <div class="content">
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
      </div>

      <TypographyLabel text="Circles" />
      <div class="card">
        <div class="card-content">
          <div class="content">
            <UiCircle
              type="random"
              seed="0x0000000000000000000000000000000000000000"
              :size="152"
            />
            <UiCircle
              type="image"
              source="https://i.pinimg.com/originals/8c/13/bf/8c13bf23627ae9188968fadf541cf1f9.jpg"
              :size="152"
            />
            <UiCircle
              type="icon"
              :icon="{ style: 'far', name: 'arrow-circle-right' }"
              :size="152"
              color="#3498db"
            />
          </div>
        </div>
      </div>
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
      selectValue: 1,
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
  display: flex;
  justify-content: center;
  text-align: center;
  overflow: scroll;
}
</style>
