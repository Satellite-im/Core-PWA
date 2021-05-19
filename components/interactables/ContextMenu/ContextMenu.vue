<template src="./ContextMenu.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'

export default Vue.extend({
  methods: { 
    close() {
      this.$store.commit('toggleContextMenu', false)
    },
    handle(func: any) {
      func()
      this.close()
    }
  },
})
</script>
<style scoped lang="less" src="./ContextMenu.less"></style>
