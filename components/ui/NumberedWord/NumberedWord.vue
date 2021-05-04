<template src="./NumberedWord.html"></template>

<script lang="ts">
import Vue from 'vue'
// This component is helpful for displaying phrases
// It takes a word and a number and displays them neatly
export default Vue.extend({
  props: {
    /**
     * Text to include in the word box
     */
    word: {
      type: String,
      default: 'Null',
    },
    /**
     * Top left number to display
     */
    number: {
      type: Number,
      default: 0,
    },
  },
})
</script>

<style scoped lang="less" src="./NumberedWord.less"></style>
