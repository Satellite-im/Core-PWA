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
      // showModal: false,
    }
  },
    mounted() {
    // Updates time ago
    console.log("mounted")
  },
  methods: {
    testAction() {
      console.log("meow")
      // console.log(this.showModal)
      // this.showModal = !this.showModal
      this.show()

    },
    show () {
      this.$modal.show('my-first-modal');
      },
    hide () {
        this.$modal.hide('my-first-modal');
      }
  }

})
</script>
<style scoped lang="less" src="./Controls.less"></style>
