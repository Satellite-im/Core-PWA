<template src="./Actions.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

export default Vue.extend({
  computed: {
    ...mapState(['audio']),
  },
})
</script>

<style scoped lang="less" src="./Actions.less"></style>
