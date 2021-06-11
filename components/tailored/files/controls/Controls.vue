<template src="./Controls.html"></template>
<script lang="ts">
import Vue from 'vue'
import vmodal from 'vue-js-modal'
// import '@/plugins/thirdparty/vue-js-modal-style.css';

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
      this.show()

    },
    show () {
      this.$modal.show('new-folder-modal')
      console.log(this.$modal)

    },
    hide () {
        this.$modal.hide('new-folder-modal');
    }
  }

})
</script>
<style scoped lang="less" src="./Controls.less"></style>
