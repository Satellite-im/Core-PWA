<template>
  <ModalDialog
    :primary-button="primaryButton"
    :height="'600px'"
    class="update-modal"
    @primary-button-click="skipVersion"
  >
    <template #image>
      <img src="~/assets/svg/mascot/new_things.svg" />
    </template>

    <template v-if="releaseData?.tag_name" #title>
      {{ $t('modal.update_modal.title', { tagName: releaseData?.tag_name }) }}
    </template>

    <template #body>
      <div
        v-if="releaseData && releaseData.body"
        class="body"
        v-html="releaseData.body"
      />

      <div v-if="isLoading" class="update-modal-spinner">
        <UiLoadersSpinner spinning />
      </div>

      <TypographyText v-if="requiresUpdate">
        {{ $t('modal.update_modal.update_required') }}
      </TypographyText>
    </template>
  </ModalDialog>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { XIcon } from 'satellite-lucide-icons'
import { ReleaseNotes, ReleaseNotesType } from '~/libraries/ui/ReleaseNotes'
import { RootState } from '~~/types/store/store'

export default Vue.extend({
  data() {
    return {
      hasMinorUpdate: false,
      requiresUpdate: false,
      releaseData: {} as ReleaseNotesType | undefined,
      isLoading: false,
    }
  },
  computed: {
    ...mapState({
      ui: (state) => (state as RootState).ui,
    }),
    primaryButton(): { text: string; action: () => void; icon: any } {
      return {
        text: this.$t('modal.update_modal.got_it') as string,
        action: this.skipVersion,
        icon: XIcon,
      }
    },
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

<style scoped lang="less" src="./UpdateModal.less"></style>
