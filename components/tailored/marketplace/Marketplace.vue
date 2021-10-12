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
  watch: {
    subject(newVal, oldVal) {
      console.log(newVal, oldVal)
    },
  },
  methods: {
    /**
     * @method changeSubject DocsTODO
     * @description
     * @param subject
     * @returns
     * @example
     */
    changeSubject(subject: String) {
      console.log(subject)
    },
  },
})
</script>

<style scoped lang="less" src="./Marketplace.less"></style>
