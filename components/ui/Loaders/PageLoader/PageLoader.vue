<template>
  <div v-if="isLoading" class="page-loader">
    <div class="page-loader-content">
      <img v-if="issues" src="~/static/img/this-is-fine.gif" />
      <TypographyText v-if="issues" class="issues-message">
        {{ $t('welcome_message.issues') }}
        <a target="_blank" href="https://twitter.com/Satellite_im">Twitter</a>
      </TypographyText>
      <UiLoadersLoadingBar class="page-loader-bar" />
      <TypographyTitle :size="5" :text="title" class="page-loader-title" />
      <TypographySubtitle
        :size="6"
        :text="subtitle"
        class="page-loader-subtitle"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Main',
  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    subtitle: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      issues: false,
    }
  },
  mounted() {
    setTimeout(() => {
      this.issues = true
    }, 7000)
  },
})
</script>

<style scoped lang="less">
.page-loader {
  max-width: 600px;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-content: center;
  padding: 0 16px;
  box-sizing: border-box;
  &-bar {
    margin-bottom: 4px;
  }
  &-subtitle {
    margin-top: 0 !important;
  }
  &-content {
    align-self: center;
  }
  &-issues-message {
    margin: 10px !important;
  }
}
</style>
