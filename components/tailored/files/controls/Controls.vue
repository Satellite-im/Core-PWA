<template src="./Controls.html"></template>
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
      // @ts-ignore
      this.$modal.show('new-folder-modal')
    },
    hide() {
      // @ts-ignore
      this.$modal.hide('new-folder-modal')
    },
  },
})
</script>
<style scoped lang="less" src="./Controls.less"></style>
