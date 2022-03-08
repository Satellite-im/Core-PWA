<template>
  <div class="about">
    <div>
      <TypographyTitle :text="$t('modal.profile.about.me')" :size="6" />
      <TypographyText text="Lorem ipsum dolor" />
    </div>
    <div>
      <TypographyTitle :text="$t('modal.profile.about.location')" :size="6" />
      <TypographyText text="Lorem ipsum dolor" />
    </div>
    <div>
      <TypographyTitle :text="$t('modal.profile.about.add_note')" :size="6" />
      <InteractablesClickToEdit
        v-model="note"
        :placeholder="$t('modal.profile.about.click_note')"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

export default Vue.extend({
  computed: {
    ...mapState(['friends', 'ui']),
    note: {
      get(): string {
        if (
          this.ui.userProfile &&
          this.ui.userProfile.metadata &&
          this.ui.userProfile.metadata.note
        )
          return this.ui.userProfile.metadata.note
        return ''
      },
      set(note: string) {
        const { userProfile } = this.ui
        let { metadata } = userProfile
        metadata = {
          ...(metadata ?? null),
          note,
        }
        this.$store.dispatch('friends/updateFriendMetadata', {
          to: userProfile.address,
          metadata,
        })
      },
    },
  },
})
</script>

<style scoped lang="less">
.accounts {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(256px, 1fr));
  gap: @normal-spacing;
}
</style>
