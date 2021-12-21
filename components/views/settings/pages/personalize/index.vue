<template src="./Personalize.html" />

<script lang="ts">
import Vue from 'vue'

import { Themes } from '~/store/ui/types.ts'

export default Vue.extend({
  name: 'PersonalizeSettings',
  layout: 'settings',
  data() {
    return {
      themes: Themes,
    }
  },
})
</script>
