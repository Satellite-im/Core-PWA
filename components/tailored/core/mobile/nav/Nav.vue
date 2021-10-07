<template src="./Nav.html"></template>

<script lang="ts">
import Vue from 'vue'

import {
  HomeIcon,
  MessageSquareIcon,
  FolderIcon,
  UsersIcon,
  SettingsIcon,
} from 'satellite-lucide-icons'

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
