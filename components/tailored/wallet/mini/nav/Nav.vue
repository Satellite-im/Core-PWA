<template src="./Nav.html"></template>
<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { ChevronsRightIcon, ChevronsLeftIcon } from 'satellite-lucide-icons'

export default Vue.extend({
  props: {
    route: {
      type: String,
      default: '',
    }
  },
  computed: {
    ...mapState(['ui']),
    route: {
      get() {
        return this.$props.route
      },
      set(value) {
        this.$emit('update:route', value) 
      },
    },
  },
  components: {
    ChevronsRightIcon,
    ChevronsLeftIcon,
  },
})
</script>
<style scoped lang="less" src="./Nav.less"></style>
