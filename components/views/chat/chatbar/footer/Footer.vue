<template src="./Footer.html" />

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { toArray } from 'lodash'
import { CircleIcon } from 'satellite-lucide-icons'
import { Config } from '~/config'

export default Vue.extend({
  components: {
    CircleIcon,
  },
  props: {
    charlimit: {
      type: Boolean,
    },
    usersTyping: {
      type: Array,
      default: () => [{ name: 'Phoenix' }, { name: 'Ariel' }],
      required: false,
    },
    typing: {
      type: Boolean,
      default: false,
      required: false,
    },
    isGroup: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapState(['ui']),
    lengthCount() {
      /* toArray(): https://lodash.com/docs/4.17.15#toArray */
      return `${toArray(this.ui.chatbarContent).length}/${
        this.$Config.chat.maxChars
      }`
    },
  },
})
</script>

<style scoped lang="less" src="./Footer.less"></style>
