<template>
  <div class="about">
    <template v-if="user.about.length">
      <div>
        <TypographyText weight="bold" size="lg">
          {{ $t('modal.profile.about.me') }}</TypographyText
        >
        <TypographyText> {{ user.about }}</TypographyText>
      </div>
    </template>
    <template v-if="user.location.length">
      <div>
        <TypographyText weight="bold" size="lg">{{
          $t('modal.profile.about.location')
        }}</TypographyText>
        <TypographyText>{{ user.location }}</TypographyText>
      </div>
    </template>
    <div v-if="!isMe">
      <TypographyText weight="bold" size="lg">{{
        $t('modal.profile.about.add_note')
      }}</TypographyText>
      <form @submit="(e) => submitEdit(e)">
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
    ...mapState(['friends', 'ui']),
    isMe(): boolean {
      return !!this.user?.did && iridium.profile.state?.did === this.user.did
    },

    user(): User | undefined {
      // TODO load here profile info of
      return iridium.profile.state
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
    submitEdit(e: SubmitEvent) {
      e.stopPropagation()
      e.preventDefault()
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
  gap: 16px;
  word-break: break-all;

  .row-wrapper {
    display: flex;
    align-items: center;

    .button {
      margin-left: 16px;
    }
  }
}
</style>
