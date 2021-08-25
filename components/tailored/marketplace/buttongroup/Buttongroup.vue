<template src="./ButtonGroup.html"></template>

<script lang="ts">
import Vue from 'vue'
import { marketCategories } from '~/mock/marketplace'
export default Vue.extend({
  props: {},
  data() {
    return {
      marketCategories,
      active: null as HTMLElement | null,
    }
  },
  computed: {},
  mounted() {
    const btns = this.$refs.btns as HTMLElement
    btns.querySelectorAll('button').forEach((button) => {
      button.addEventListener('click', () => {
        if (this.active != null) {
          this.active.classList.remove('active')
        }
        button.classList.add('active')
        this.active = button
      })
    })
  },
  methods: {},
})
</script>

<style scoped lang="less" src="./ButtonGroup.less"></style>
