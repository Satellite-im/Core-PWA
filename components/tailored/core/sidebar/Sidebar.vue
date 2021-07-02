<template src="./Sidebar.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState } from 'vuex'
import { Route } from 'vue-router'

import { mobileSwipe } from '../../../../components/mixins/Swipe/Swipe'
import { User, Group } from '~/types/ui/core'

export default Vue.extend({
  mixins: [mobileSwipe],
  props: {
    toggle: {
      type: Function,
      default: () => {},
    },
    users: {
      type: Array as PropType<Array<User>>,
      default: () => [],
    },
    groups: {
      type: Array as PropType<Array<Group>>,
      default: () => [],
    },
  },
  computed: {
    ...mapState(['ui']),
  },
  mounted() {
    /**
     * Opens and closes the left hand sidebar upon clicking on 'direct-chat'
     * when user is on a mobile device
     */

    if (this.$route.name?.includes('chat-direct') && this.$device.isMobile) {
      this.$props.toggle()
    }
  },
  methods: {
    handleFiles() {
      /**
       * Opens and closes the left hand sidebar upon clicking on 'files-browse'
       * when user is on a mobile device
       */
      // console.log("============================")
      // console.log("inital route location  : " + this.$route.name)
      this.$router.push('/files/browse')
      // console.log("current route location after pushing on router  : " + this.$route.name)
      if (this.$route.name?.includes('files-browse') && this.$device.isMobile) {
        this.$props.toggle()
      }
    },
  },
})
</script>

<style scoped lang="less" src="./Sidebar.less"></style>
