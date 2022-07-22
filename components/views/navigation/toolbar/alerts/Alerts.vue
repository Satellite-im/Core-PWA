<template src="./Alerts.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { FlaskConicalIcon } from 'satellite-lucide-icons'
import iridium from '~/libraries/Iridium/IridiumManager'
import { Notification } from '~/libraries/Iridium/notifications/types'
export default Vue.extend({
  components: {
    FlaskConicalIcon,
  },
  data() {
    return {
      messages: [],
    }
  },
  computed: {
    ...mapState({
      notifications: () =>
        Object.values(iridium.notifications?.state).sort(
          (a: Notification, b: Notification) => {
            return b.at - a.at
          },
        ),
    }),
  },
  methods: {
    clearNotifications() {
      this.$store.commit('ui/setNotifications', [])
    },
  },
})
</script>

<style scoped lang="less" src="./Alerts.less"></style>
