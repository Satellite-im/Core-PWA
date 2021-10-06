<template src="./Info.html"></template>
<script lang="ts">
// eslint-disable-next-line import/named
import Vue from 'vue'
import { mapState } from 'vuex'

export default Vue.extend({
  computed: {
    ...mapState(['ui']),
  },
})
</script>
<style scoped lang="less" src="./Info.less"></style>
