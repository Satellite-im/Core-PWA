<template src="./Nav.html" />

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

import {
  HomeIcon,
  MessageSquareIcon,
  FolderIcon,
  UsersIcon,
  SettingsIcon,
  ShoppingBagIcon,
} from 'satellite-lucide-icons'

export default Vue.extend({
  components: {
    HomeIcon,
    MessageSquareIcon,
    FolderIcon,
    UsersIcon,
    SettingsIcon,
    ShoppingBagIcon,
  },
  computed: {
    ...mapState(['accounts']),
  },
})
</script>

<style scoped lang="less" src="./Nav.less"></style>
