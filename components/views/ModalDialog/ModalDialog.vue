<template>
  <div class="modal-dialog">
    <div class="content" :style="{ height }">
      <!-- image -->
      <div v-if="$slots.image" class="image-wrapper">
        <slot name="image"></slot>
      </div>

      <!-- title -->
      <TypographyText v-if="$slots.title" as="h1" color="body" class="title">
        <slot name="title"></slot>
      </TypographyText>

      <!-- subtitle -->
      <div v-if="$slots.subtitle" class="subtitle hover-scroll">
        <TypographyText color="light">
          <slot name="subtitle"></slot>
        </TypographyText>
      </div>

      <!-- body -->
      <div v-if="$slots.body" class="body hover-scroll">
        <slot name="body"></slot>
      </div>

      <!-- primary button -->
      <InteractablesButton
        v-if="primaryButton"
        class="action"
        size="lg"
        @click="primaryButton.action"
      >
        <component
          :is="primaryButton.icon"
          v-if="primaryButton.icon"
          size="1x"
        />

        {{ primaryButton.text }}
      </InteractablesButton>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

type ModalDialogButton = {
  text: string
  action: () => void
  icon?: any
}

export default Vue.extend({
  name: 'ModalDialog',
  props: {
    primaryButton: {
      type: Object as () => ModalDialogButton,
      default: null,
    },
    // TODO: Remove height prop after move to Vue 3
    height: {
      type: String,
      default: 'auto',
    },
  },
})
</script>

<style scoped lang="less" src="./ModalDialog.less"></style>
