<template src="./Topbar.html"></template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    handleFile: {
      type: Function,
      default: () => () => {},
    },
  },
  data() {
    return {
      text: '',
    }
  },
  methods: {
    showModal() {
      // shows the createFolder modal
      this.show()
    },
    createFolder() {
      // shows what was in the user's input for a Folder Name
      // console.log(this.$data.text)
      // hides the modal that the button is displayed on when pressed
      this.hide()
    },
    show() {
      
    },
    hide() {
      this.$store.commit('toggleModal', {name: 'newfolder', state: false}) 
    },
  },
})
</script>
<style scoped lang="less" src="./Topbar.less"></style>
