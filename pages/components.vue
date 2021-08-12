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
            <UiBadgedIcon
              :icon="{ style: 'far', name: 'user' }"
              :size="26"
              :badge-count="0"
            />

            <UiBadgedIcon
              :icon="{ style: 'far', name: 'user' }"
              :size="26"
              :badge-count="33"
            />

            <UiBadgedIcon
              :icon="{ style: 'far', name: 'user' }"
              :size="16"
              :badge-count="3"
            />
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
              type="primary"
              :options="[
                { text: 'Option 1', value: 1 },
                { text: 'Option 2', value: 2 },
                { text: 'Option 3', value: 3 },
              ]"
            />
            <InteractablesSelect
              v-model="selectValue"
              size="normal"
              type="primary"
              :options="[
                { text: 'Option 1', value: 1 },
                { text: 'Option 2', value: 2 },
                { text: 'Option 3', value: 3 },
              ]"
            />
            <br />
            <InteractablesSelect
              v-model="selectValue"
              type="primary"
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
            <UiNumberedWord word="Elephant" :number="1" />
            <UiNumberedWord word="Telephone" :number="2" />
            <UiNumberedWord word="Rendered" :number="24" />
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

      <TypographyLabel text="Auto Scroll" />
      <div class="card">
        <div class="card-content">
          <div class="content">
            <UiAutoScroll height="240px">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
                nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed
                nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis
                ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta.
                Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent
                taciti sociosqu ad litora torquent per conubia nostra, per
                inceptos himenaeos. Curabitur sodales ligula in libero. Sed
                dignissim lacinia nunc.
              </p>
              <p>
                Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque
                sem at dolor. Maecenas mattis. Sed convallis tristique sem.
                Proin ut ligula vel nunc egestas porttitor. Morbi lectus risus,
                iaculis vel, suscipit quis, luctus non, massa. Fusce ac turpis
                quis ligula lacinia aliquet. Mauris ipsum. Nulla metus metus,
                ullamcorper vel, tincidunt sed, euismod in, nibh. Quisque
                volutpat condimentum velit. Class aptent taciti sociosqu ad
                litora torquent per conubia nostra, per inceptos himenaeos.
              </p>
              <p>
                Nam nec ante. Sed lacinia, urna non tincidunt mattis, tortor
                neque adipiscing diam, a cursus ipsum ante quis turpis. Nulla
                facilisi. Ut fringilla. Suspendisse potenti. Nunc feugiat mi a
                tellus consequat imperdiet. Vestibulum sapien. Proin quam. Etiam
                ultrices. Suspendisse in justo eu magna luctus suscipit. Sed
                lectus.
              </p>
              <p>
                Integer euismod lacus luctus magna. Quisque cursus, metus vitae
                pharetra auctor, sem massa mattis sem, at interdum magna augue
                eget diam. Vestibulum ante ipsum primis in faucibus orci luctus
                et ultrices posuere cubilia Curae; Morbi lacinia molestie dui.
                Praesent blandit dolor. Sed non quam. In vel mi sit amet augue
                congue elementum. Morbi in ipsum sit amet pede facilisis
                laoreet. Donec lacus nunc, viverra nec, blandit vel, egestas et,
                augue. Vestibulum tincidunt malesuada tellus. Ut ultrices
                ultrices enim. Curabitur sit amet mauris. Morbi in dui quis est
                pulvinar ullamcorper. Nulla facilisi. Integer lacinia
                sollicitudin massa.
              </p>
              <p>
                Cras metus. Sed aliquet risus a tortor. Integer id quam. Morbi
                mi. Quisque nisl felis, venenatis tristique, dignissim in,
                ultrices sit amet, augue. Proin sodales libero eget ante. Nulla
                quam. Aenean laoreet. Vestibulum nisi lectus, commodo ac,
                facilisis ac, ultricies eu, pede. Ut orci risus, accumsan
                porttitor, cursus quis, aliquet eget, justo. Sed pretium blandit
                orci.
              </p>
            </UiAutoScroll>
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
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
