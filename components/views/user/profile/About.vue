<template>
  <div class="about">
    <div v-if="profile.about">
      <TypographyTitle :text="$t('modal.profile.about.me')" :size="6" />
      <TypographyText>{{ profile.about }}</TypographyText>
    </div>
    <div v-if="profile.location">
      <TypographyTitle :text="$t('modal.profile.about.location')" :size="6" />
      <TypographyText>{{ profile.location }}</TypographyText>
    </div>
    <div>
      <TypographyTitle :text="$t('modal.profile.about.add_note')" :size="6" />
      <div class="row-wrapper">
        <InteractablesEditable
          v-model="profile.note"
          :placeholder="$t('modal.profile.about.click_note')"
          :enabled="editing"
        />
        <InteractablesButton @click="action()">
          <edit-icon size="1x" />
        </InteractablesButton>
      </div>
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
      editing: false as boolean,
      profile: {
        about: iridium.profile.state?.about ?? '',
        location: iridium.profile.state?.location ?? '',
        note: iridium.profile.state?.note ?? '',
      } as Partial<User>,
    }
  },
  computed: {
    ...mapState(['friends', 'ui']),
  },
  methods: {
    action() {
      if (this.editing) {
        // TODO: save note
        this.editing = false
        return
      }

      this.editing = true
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
  }
}
</style>
