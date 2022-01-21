<template src="./Card.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState } from 'vuex'

import { ProfileInfo } from '~/types/profile/profile'
import { timezones } from '~/mock/profile'

export default Vue.extend({
  props: {
    info: {
      type: Object as PropType<ProfileInfo>,
      default: null,
    },
  },
  data() {
    return {
      languages: [],
      timezones,
    }
  },
  computed: {
    ...mapState(['settings']),
    timezone: {
      set(value: string) {
        this.$store.commit('settings/setTimezone', value)
      },
      get() {
        return this.settings.timezone
      },
    },
  },
})
</script>

<style scoped lang="less" src="./Card.less"></style>
