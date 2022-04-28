<template src="./NumberedWord.html" />

<script lang="ts">
import Vue from 'vue'
import { XIcon } from 'satellite-lucide-icons'

// This component is helpful for displaying phrases
// It takes a word and a number and displays them neatly
export default Vue.extend({
  components: {
    XIcon,
  },
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
    /**
     * Remove numbered word
     */
    isRemoval: {
      type: Boolean,
      default: false,
    },
  },
})
</script>

<style scoped lang="less" src="./NumberedWord.less"></style>
