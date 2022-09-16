<template>
  <div ref="message-row" v-html="text" />
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    text: {
      type: String,
      default: '',
    },
  },
  mounted() {
    Array.from(
      (this.$refs['message-row'] as HTMLElement).getElementsByClassName(
        'spoiler-container',
      ),
    ).forEach((spoiler) => {
      spoiler.addEventListener('click', (e) => {
        e.preventDefault()
        e.stopPropagation()
        spoiler.classList.add('spoiler-open')
      })
    })
  },
})
</script>
<style lang="less"></style>
