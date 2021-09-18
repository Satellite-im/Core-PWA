<template src="./Topbar.html"></template>
<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

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
  computed: {
    ...mapState(['ui']),
  },
  methods: {
    createFolder() {
      // shows what was in the user's input for a Folder Name
      // console.log(this.$data.text)
      // hides the modal that the button is displayed on when pressed
      this.hide('newfolder')
    },
    hide(modalName: String) {
      this.$store.commit('toggleModal', { name: modalName, state: false })
    },
  },
})
</script>
<style scoped lang="less" src="./Topbar.less"></style>
