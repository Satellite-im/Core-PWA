<template src="./Alert.html" />

<script lang="ts">
import Vue, { PropType } from 'vue'

import { mapState } from 'vuex'
import VueI18n from 'vue-i18n'
import { Alert, AlertType } from '~/libraries/ui/Alerts'
import { RootState } from '~/types/store/store'

export default Vue.extend({
  props: {
    alert: {
      type: Object as PropType<Alert>,
      required: false,
      default: () => {},
    },
  },
  data() {
    return {
      hidden: false,
    }
  },
  computed: {
    ...mapState({ ui: (state) => (state as RootState).ui }),
    setTranslateText(): VueI18n.TranslateResult | undefined {
      switch (this.alert?.type) {
        case AlertType.DIRECT_MESSAGE: {
          return this.$t('messaging.user_sent.user', {
            user: this.alert.from,
            msgType: this.alert.type,
          })
        }
      }
      return this.$t('user_sent_something.user')
    },
  },
  methods: {
    dismiss() {
      this.$store.dispatch('ui/removeSeenNotification', this.alert.id)
      this.$data.hidden = true
    },
  },
})
</script>

<style scoped lang="less" src="./Alert.less"></style>
