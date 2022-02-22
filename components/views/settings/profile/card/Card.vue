<template src="./Card.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import { mapState } from 'vuex'
import { ProfileInfo } from '~/types/profile/profile'
import { recommendLocations } from '~/mock/profile'
import { getTimezoneDropdowns } from '~/utilities/Timezone'

export default Vue.extend({
  props: {
    info: {
      type: Object as PropType<ProfileInfo>,
      default: null,
    },
  },
  data() {
    return {
      timezones: getTimezoneDropdowns(),
      languages: [],
      recommendLocations,
      featureReadyToShow: false,
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

<style lang="less" src="./Card.less"></style>
