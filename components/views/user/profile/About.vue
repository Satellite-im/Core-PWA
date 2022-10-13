<template>
  <div class="about">
    <TypographyText v-if="user?.about"> {{ user.about }}</TypographyText>
    <div v-if="user?.location">
      <TypographyText as="h4">
        {{ $t('modal.profile.about.location') }}
      </TypographyText>
      <TypographyText>{{ user.location }}</TypographyText>
    </div>
    <div v-if="!isMe">
      <TypographyText as="h4">
        {{ $t('modal.profile.about.add_note') }}
      </TypographyText>
      <InteractablesEditable
        v-model="note"
        :placeholder="$t('modal.profile.about.click_note')"
        :enabled="editing"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import iridium from '~/libraries/Iridium/IridiumManager'
import { User } from '~/libraries/Iridium/users/types'
import { RootState } from '~/types/store/store'

export default Vue.extend({
  data() {
    return {
      note: '' as User['note'],
      editing: false,
    }
  },
  computed: {
    ...mapState({
      user: (state) => (state as RootState).ui.fullProfile,
    }),
    isMe(): boolean {
      return !!this.user?.did && iridium.profile.state?.did === this.user.did
    },
  },
  methods: {
    setNote() {
      // TODO update note
      this.editing = false
    },
  },
})
</script>

<style scoped lang="less">
.about {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  word-break: break-word;
}
</style>
