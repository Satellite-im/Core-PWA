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
      <form @submit.prevent="submitEdit">
        <div v-click-outside="toggleEditingOff" class="row-wrapper">
          <InteractablesEditable
            v-model="note"
            :placeholder="$t('modal.profile.about.click_note')"
            :enabled="editing"
          />
          <InteractablesButton type="submit">
            <edit-icon size="1x" />
          </InteractablesButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { EditIcon } from 'satellite-lucide-icons'
import iridium from '~/libraries/Iridium/IridiumManager'
import { User } from '~/libraries/Iridium/users/types'
import { RootState } from '~/types/store/store'

export default Vue.extend({
  components: {
    EditIcon,
  },
  data() {
    return {
      observer: null as ResizeObserver | null,
      note: '' as Partial<User>,
      editing: false as Boolean,
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
    /**
     * @method toggleEditingOff
     * @description Toggles editing state off
     */
    toggleEditingOff() {
      this.editing = false
    },
    /**
     * @method submitEdit
     * @description Updates input value
     */
    submitEdit() {
      const value = this.note || ''
      const valueChanged = this.user?.note !== value
      if (this.editing && valueChanged) {
        // TODO update note
      }
      this.editing = !this.editing
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

  .row-wrapper {
    display: flex;
    align-items: center;

    .button {
      margin-left: 16px;
    }
  }
}
</style>
