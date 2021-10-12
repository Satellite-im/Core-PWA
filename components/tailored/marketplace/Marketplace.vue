<template src="./Marketplace.html"></template>

<script lang="ts">
import Vue from 'vue'

import { BoxIcon, LayersIcon, SmileIcon } from 'satellite-lucide-icons'
import { marketCategories } from '~/mock/marketplace'
export default Vue.extend({
  components: {
    BoxIcon,
    LayersIcon,
    SmileIcon,
  },
  props: {
    closeModal: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      subject: 'Themes',
      marketCategories,
    }
  },
  methods: {
    changeSubject(subject: string) {
      this.subject = subject
    },
  },
})
</script>

<style scoped lang="less" src="./Marketplace.less"></style>
