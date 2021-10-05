<template src="./Sidebar.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

// @ts-ignore
import { MenuIcon } from 'vue-feather-icons'

import { mobileSwipe } from '~/components/mixins/Swipe/Swipe'

export default Vue.extend({
  components: {
    MenuIcon,
  },
  mixins: [mobileSwipe],
  props: {
    toggle: {
      type: Function,
      default: () => {},
    },
  },
  computed: {
    ...mapState(['ui']),
  },
  mounted() {
    /**
     * Opens and closes the left hand sidebar upon clicking on 'direct-chat' or 'files-browse'
     * when user is on a mobile device
     */
    if (this.$route.name?.includes('files-browse') && this.$device.isMobile) {
      this.$props.toggle()
    }
    if (this.$route.name?.includes('chat-direct') && this.$device.isMobile) {
      this.$props.toggle()
    }
  },
})
</script>

<style scoped lang="less" src="./Sidebar.less"></style>
