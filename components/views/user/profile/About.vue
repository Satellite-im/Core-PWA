<template>
  <div class="about">
    <div>
      <TypographyTitle
        v-if="user.about.length"
        :text="$t('modal.profile.about.me')"
        :size="6"
      />
      <TypographyText v-if="user.about.length">
        {{ user.about }}</TypographyText
      >
    </div>
    <div>
      <TypographyTitle
        v-if="user.location.length"
        :text="$t('modal.profile.about.location')"
        :size="6"
      />
      <TypographyText v-if="user.location.length">{{
        user.location
      }}</TypographyText>
    </div>
    <div v-if="!isMe">
      <TypographyTitle :text="$t('modal.profile.about.add_note')" :size="6" />
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
  props: {
    user: {
      type: Object as Partial<User> | undefined,
      default: () => {
        return {
          name: iridium.profile.state?.name ?? '',
          did: iridium.profile.state?.did ?? '',
          status: iridium.profile.state?.status ?? '',
          about: iridium.profile.state?.about ?? '',
          location: iridium.profile.state?.location ?? '',
          note: iridium.profile.state?.note ?? '',
        }
      },
    },
  },
  data() {
    return {
      observer: null as ResizeObserver | null,
      editing: false as Boolean,
      note: this.user?.note ?? ('' as Partial<User>),
    }
  },
  computed: {
    ...mapState(['friends', 'ui']),
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
