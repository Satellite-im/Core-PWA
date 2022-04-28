<template src="./Friend.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import ContextMenu from '~/components/mixins/UI/ContextMenu'
import { User } from '~/types/ui/user'

declare module 'vue/types/vue' {
  interface Vue {
    selectUserAddress: (address: string) => void
  }
}

export default Vue.extend({
  mixins: [ContextMenu],
  props: {
    user: {
      type: Object as PropType<User>,
      required: true,
    },
    isTyping: {
      type: Boolean,
      default: false,
      required: false,
    },
    selectUserAddress: {
      type: Function,
      default: (address: string) => {},
    },
    selectedAddress: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      isLoading: false,
      address: '',
      checked: false,
    }
  },
  computed: {
    src(): string {
      const hash = this.user?.profilePicture
      return hash ? `${this.$Config.textile.browser}/ipfs/${hash}` : ''
    },
  },
  watch: {
    /**
     * Watch checked state
     * if false, set selected as ''
     * if true, set selected user address
     */
    checked(newValue, oldValue) {
      if (oldValue === newValue) return
      if (newValue === false) {
        this.selectUserAddress('')
        return
      }
      this.selectUserAddress(this.user.address)
    },
  },
  methods: {
    toggleSelect() {
      this.checked = !this.checked
    },
  },
})
</script>

<style scoped lang="less" src="./Friend.less"></style>
