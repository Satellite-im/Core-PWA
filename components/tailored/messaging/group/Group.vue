<template src="./Group.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'

import { Group } from '~/types/messaging'

export default Vue.extend({
  props: {
    group: {
      type: Object as PropType<Group>,
      default: () => {},
    },
  },
  methods: {
    /**
     * @method showQuickProfile
     * @description Shows quickprofile component for user by setting quickProfile to true in state and setQuickProfilePosition
     * to the current group components click event data
     * @param e Event object from group component click
     * @example v-on:click="showQuickProfile"
     */
    showQuickProfile(e: Event) {
      this.$store.commit('setQuickProfilePosition', e)
      this.$store.commit('quickProfile', true)
    },
  },
})
</script>
<style scoped lang="less" src="./Group.less"></style>
