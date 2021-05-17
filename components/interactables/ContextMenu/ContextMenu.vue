<template src="./ContextMenu.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'

export default Vue.extend({
  data() {
    return {
    };
  },
  mounted() {
    let el = document.querySelector('body');
    if(el){
      el.addEventListener('click', this.close);
    }
  },
  destroyed() {
    let el = document.querySelector('body');
    if(el){
      el.removeEventListener('click', this.close);
    }
  },
  methods: { 
    close() {
      this.$store.commit('toggleContextMenu', false)
    },
  },
})
</script>
<style scoped lang="less" src="./ContextMenu.less"></style>
