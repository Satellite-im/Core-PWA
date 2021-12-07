<template src="./Nav.html" />
<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

import {
  UserIcon,
  UserCheckIcon,
  UserPlusIcon,
  UserXIcon,
} from 'satellite-lucide-icons'

export default Vue.extend({
  components: {
    UserIcon,
    UserCheckIcon,
    UserPlusIcon,
    UserXIcon,
  },
    computed: {
    ...mapState(['friends']),

  },
    mounted() {
  //   this.initElements(true)
    console.log(this.$store)
    console.log(this.friends.incomingRequests)
    console.log(friends.incomingRequests)


  },
  props: {
    setRoute: {
      type: Function,
      default: () => () => {},
    },
    route: {
      type: String,
      default: 'active',
    },
  },
})
</script>
<style scoped lang="less" src="./Nav.less"></style>
