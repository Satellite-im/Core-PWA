<template src="./Controls.html"></template>
<script lang="ts">
import Vue from 'vue'
import vmodal from 'vue-js-modal'

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
      // shows what was in the user's input for a Folder Name
      // console.log(this.$data.text)
    },
    createFolder() {
      //hides the modal that the button is displayed on when pressed
      console.log(this.$data.text)
      this.hide()
    },
    show () {
      this.$modal.show('new-folder-modal')
    },
    hide () {
        this.$modal.hide('new-folder-modal');
    },
  }

})
</script>
<style scoped lang="less" src="./Controls.less"></style>
