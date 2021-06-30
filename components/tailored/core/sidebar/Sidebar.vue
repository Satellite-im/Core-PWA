<template src="./Sidebar.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState } from 'vuex'

import { mobileSwipe } from '../../../../components/mixins/Swipe/Swipe'
import { User, Group } from '~/types/ui/core'

export default Vue.extend({
  mixins: [mobileSwipe],
  data() {
    return {
      sidebarOpen: false,
    }
  },
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

  methods: {
      handleFiles (){
      this.$router.push('/files/browse')
      if (this.$route.name?.includes('files-browse') && this.$device.isMobile) {
      this.$props.toggle()
      }
    }
  },

  mounted() {
    /**
     * Opens and closes the left hand sidebar upon clicking on 'direct-chat' or 'files-browse'
     * when user is on a mobile device
     */

    if (this.$route.name?.includes('chat-direct') && this.$device.isMobile) {
      this.$props.toggle()
    }
  },
})
</script>

<style scoped lang="less" src="./Sidebar.less"></style>
