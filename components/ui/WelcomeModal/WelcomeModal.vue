<template src="./WelcomeModal.html" />

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { RefreshCwIcon, XIcon } from 'satellite-lucide-icons'
import VueMarkdown from 'vue-markdown'
import { ReleaseNotes } from '~/libraries/ui/ReleaseNotes'

export default Vue.extend({
  components: {
    RefreshCwIcon,
    XIcon,
    VueMarkdown,
  },
  data() {
    return {
      hasMinorUpdate: false,
      requiresUpdate: false,
      releaseData: {},
      isLoading: false,
    }
  },
  computed: {
    ...mapState(['ui']),
  },
  async mounted() {
    await this.getReleaseBody()
  },
  methods: {
    /* clearAndReload() {
     commented out until we can test this - we probably won't want to clean all of local storage'
       localStorage.removeItem('local-version')
       window.location.reload()
     }, */
    skipVersion() {
      localStorage.setItem('local-version', this.$config.clientVersion)
      this.$data.requiresUpdate = false
      this.$data.hasMinorUpdate = false
      this.toggleVisibility()
    },
    async getReleaseBody() {
      this.isLoading = true
      try {
        await ReleaseNotes().then((releaseData) => {
          this.releaseData = releaseData
        })
      } finally {
        this.isLoading = false
      }
    },
    toggleVisibility() {
      this.$store.commit('ui/toggleModal', {
        name: 'changelog',
        state: !this.ui.modals.changelog,
      })
    },
  },
})
</script>

<style scoped lang="less" src="./WelcomeModal.less"></style>
