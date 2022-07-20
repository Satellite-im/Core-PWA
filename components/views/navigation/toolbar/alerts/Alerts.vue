<template src="./Alerts.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapState } from 'vuex'
import { FlaskConicalIcon } from 'satellite-lucide-icons'
import { AlertState } from '~/libraries/ui/Alerts'
import { RootState } from '~/types/store/store'
import iridium from '~/libraries/Iridium/IridiumManager'
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
      notifications: () => Object.values(iridium.notifications?.state),
    }),
    ...mapGetters('ui', ['allUnseenNotifications']),
    AlertState: () => AlertState,
  },
  mounted() {
    console.log(this.notifications, 'in alert')
  },
  methods: {
    clearNotifications() {
      this.$store.commit('ui/setNotifications', [])
    },
  },
})
</script>

<style scoped lang="less" src="./Alerts.less"></style>
