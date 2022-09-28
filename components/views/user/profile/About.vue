<template>
  <div class="about">
    <div>
      <TypographyTitle :text="$t('modal.profile.about.me')" :size="6" />
      <TypographyText>Lorem ipsum dolor</TypographyText>
    </div>
    <div>
      <TypographyTitle :text="$t('modal.profile.about.location')" :size="6" />
      <TypographyText>Lorem ipsum dolor</TypographyText>
    </div>
    <div>
      <TypographyTitle :text="$t('modal.profile.about.add_note')" :size="6" />
      <TypographyText class="loading">
        {{ note }}
      </TypographyText>
      <div class="row-wrapper">
        <InteractablesEditable
          v-model="note"
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

export default Vue.extend({
  components: {
    EditIcon,
  },
  data() {
    return {
      observer: null as ResizeObserver | null,
      note: '' as string,
      editing: false as boolean,
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
.accounts {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(256px, 1fr));
  gap: @normal-spacing;
}

.row-wrapper {
  display: flex;
  align-items: center;
}

.loading {
  cursor: progress;
}
</style>
