<template src="./Loading.html"></template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data() {
    return {
      step: 'Building State',
      totalSteps: 4,
      stepsCompleted: 0,
    }
  },
  computed: {
    // We need to make sure we've loaded state from storage
    loadedState(): Boolean {
      return (
        this.$store.state.localStorage && this.$store.state.localStorage.status
      )
    },
    // Helper method for prettier loading messages
    loadingStep(): String {
      return `${this.$data.stepsCompleted}/${this.$data.totalSteps} ${this.step}`
    },
  },
  watch: {
    // In the rare case state isn't loaded yet, we watch it here
    loadedState(val) {
      if (val) this.$data.stepsCompleted += 1
    },
  },
  mounted() {
    if (this.loadedState) {
      this.$data.stepsCompleted += 1
    }
  },
})
</script>

<style lang="less" scoped src="./Loading.less"></style>
