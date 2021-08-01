<template src="./Statusbar.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { User, Server } from '~/types/ui/core'

export default Vue.extend({
  props: {
    collapsed: {
      type: Boolean,
      default: false,
    },
    server: {
      type: Object as PropType<Server>,
      default: () => {},
    },
    user: {
      type: Object as PropType<User>,
      default: () => ({
        name: '',
        address: '',
        status: '',
      }),
      required: true,
    },
  },
  methods: {
    change(value: String) {
      console.log(value)
    },
  },
})
</script>

<style scoped lang="less" src="./Statusbar.less"></style>
