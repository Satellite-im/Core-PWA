<template>
  <div v-html="text" ref="message-row" />
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
        'spoiler',
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
