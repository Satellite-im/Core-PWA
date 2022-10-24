<template>
  <ModalDialog
    :primary-button="primaryButton"
    height="600px"
    class="update-modal"
  >
    <template #image>
      <img src="~/assets/svg/mascot/new_things.svg" />
    </template>

    <template v-if="releaseData.tag_name" #title>
      {{ $t('modal.update_modal.title', { tagName: releaseData.tag_name }) }}
    </template>

    <template #body>
      <div v-if="releaseData.body" class="body" v-html="releaseData.body" />

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
import { ReleaseNotes } from '~/libraries/ui/ReleaseNotes'
import { ModalDialogButton } from '~/components/views/ModalDialog/ModalDialog.vue'

export default Vue.extend({
  data() {
    return {
      hasMinorUpdate: false,
      requiresUpdate: false,
      releaseData: {
        body: '',
        tag_name: '',
      },
      isLoading: false,
    }
  },
  computed: {
    ...mapState(['ui']),
    primaryButton(): ModalDialogButton {
      return {
        text: this.$t('modal.update_modal.got_it'),
        action: () => this.$emit('close'),
        icon: XIcon,
      }
    },
  },
  async mounted() {
    await this.getReleaseBody()
  },
  methods: {
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
  },
})
</script>

<style scoped lang="less" src="./UpdateModal.less"></style>
