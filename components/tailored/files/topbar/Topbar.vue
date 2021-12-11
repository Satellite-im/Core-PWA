<template src="./Topbar.html"></template>
<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

import { FolderPlusIcon } from 'satellite-lucide-icons'

export default Vue.extend({
  components: {
    FolderPlusIcon,
  },
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
    /**
     * @method createFolder DocsTODO
     * @description
     * @returns
     * @example
     */
    createFolder() {
      // shows what was in the user's input for a Folder Name
      // console.log(this.$data.text)
      // hides the modal that the button is displayed on when pressed
      this.hide('newfolder')
    },
    /**
     * @method hide DocsTODO
     * @description
     * @param modalName
     * @returns
     * @example
     */
    hide(modalName: String) {
      this.$store.commit('ui/toggleModal', { name: modalName, state: false })
    },
  },
})
</script>
<style scoped lang="less" src="./Topbar.less"></style>
