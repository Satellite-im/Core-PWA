<template src="./MostUsed.html" />
<script lang="ts">
import Vue from 'vue'

import {
  ChevronDownIcon,
  ChevronUpIcon,
  ImageIcon,
} from 'satellite-lucide-icons'

export default Vue.extend({
  components: {
    ChevronDownIcon,
    ChevronUpIcon,
    ImageIcon,
  },
  data() {
    return {
      isOpen: true,
    }
  },
  methods: {
    togglePack() {
      // close if open, open if closed
      console.log('test', this)
      this.isOpen = !this.isOpen
      console.log(this.isOpen)
    },
  },
})
</script>
<style scoped lang="less" src="./MostUsed.less"></style>
