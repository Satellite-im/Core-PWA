<template src="./Nav.html"></template>

<script lang="ts">
import Vue from 'vue'

import {
  HomeIcon,
  MessageSquareIcon,
  FolderIcon,
  UsersIcon,
  SettingsIcon,
  // @ts-ignore
} from 'vue-feather-icons'

export default Vue.extend({
  components: {
    HomeIcon,
    MessageSquareIcon,
    FolderIcon,
    UsersIcon,
    SettingsIcon,
  },
})
</script>

<style scoped lang="less" src="./Nav.less"></style>
