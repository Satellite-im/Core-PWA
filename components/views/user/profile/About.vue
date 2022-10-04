<template>
  <div class="about">
    <div>
      <TypographyTitle
        v-if="(!isMe && user.about.length) || isMe"
        :text="$t('modal.profile.about.me')"
        :size="6"
      />
      <TypographyText v-if="!isMe && user.about.length">{{
        user.about
      }}</TypographyText>

      <form v-else @submit="(e) => submitEdit(e, 'about')">
        <div class="row-wrapper">
          <InteractablesEditable
            v-model="inputs.about"
            :placeholder="$t('modal.profile.about.click_about')"
            :enabled="editing.has('about')"
          />
          <InteractablesButton type="submit">
            <edit-icon size="1x" />
          </InteractablesButton>
        </div>
      </form>
    </div>
    <div>
      <TypographyTitle
        v-if="(!isMe && user.location.length) || isMe"
        :text="$t('modal.profile.about.location')"
        :size="6"
      />
      <TypographyText v-if="!isMe && user.location.length">{{
        user.location
      }}</TypographyText>

      <form v-else @submit="(e) => submitEdit(e, 'location')">
        <div class="row-wrapper">
          <InteractablesEditable
            v-model="inputs.location"
            :placeholder="$t('modal.profile.about.click_location')"
            :enabled="editing.has('location')"
          />
          <InteractablesButton type="submit">
            <edit-icon size="1x" />
          </InteractablesButton>
        </div>
      </form>
    </div>
    <div v-if="!isMe">
      <TypographyTitle :text="$t('modal.profile.about.add_note')" :size="6" />

      <form @submit="(e) => submitEdit(e, 'note')">
        <div class="row-wrapper">
          <InteractablesEditable
            v-model="inputs.note"
            :placeholder="$t('modal.profile.about.click_note')"
            :enabled="editing.has('note')"
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

type Editables = 'about' | 'location' | 'note'

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
      loading: new Set() as Set<keyof User>,
      editing: new Set() as Set<Editables>,
      inputs: {
        about: this.user.about ?? '',
        location: this.user.location ?? '',
        note: this.user.note ?? '',
      } as Partial<User>,
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
     * @method updateUserDetail
     * @description Updates user details
     * @example this.updateUserDetail('name', 'John Doe')
     */
    async updateUserDetail(e: SubmitEvent, key: keyof User, value: string) {
      e.stopPropagation()
      e.preventDefault()

      try {
        this.loading.add(key)
        await iridium.profile.updateUser({
          [key]: value.trim(),
        })
        const inputs = this.inputs as { [key in keyof User]: string }
        inputs[key] = value.trim()
        this.$toast.show(
          this.$t('pages.settings.profile.detail_updated') as string,
        )
      } catch (e: any) {
        this.$toast.error(this.$t(e.message) as string)
      } finally {
        this.loading.delete(key)
        this.loading = new Set(...this.loading.entries())
      }
    },
    /**
     * @method toggleEditing
     * @description Toggles editing state of a field
     * @example this.toggleEditing('name')
     */
    toggleEditing(key: Editables) {
      if (this.editing.has(key)) {
        this.editing.delete(key)
        this.editing = new Set(...this.editing.entries())
      } else {
        this.editing.add(key)
        this.editing = new Set(...this.editing.entries())
      }
    },
    /**
     * @method submitEdit
     * @description Updates input value
     * @example this.submitEdit('name', 'John Doe')
     */
    submitEdit(e: SubmitEvent, key: Editables) {
      e.stopPropagation()
      e.preventDefault()
      const value = this.inputs[key] || ''
      const valueChanged = this.user?.[key] !== value
      if (this.editing.has(key) && valueChanged) {
        this.updateUserDetail(e, key, value)
      }
      this.toggleEditing(key)
    },
  },
})
</script>

<style scoped lang="less">
.about {
  display: flex;
  flex-direction: column;
  gap: 16px;

  .row-wrapper {
    display: flex;
    align-items: center;

    .button {
      margin-left: 16px;
    }
  }
}
</style>
