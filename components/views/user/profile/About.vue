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
      <TypographyText v-if="!getInitialized" class="loading">
        {{ note }}
      </TypographyText>
      <InteractablesClickToEdit
        v-show="getInitialized"
        ref="noteRef"
        v-model="note"
        data-cy="profile-add-note"
        :placeholder="$t('modal.profile.about.click_note')"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'

export default Vue.extend({
  data() {
    return {
      observer: null as ResizeObserver | null,
    }
  },
  computed: {
    ...mapState(['friends', 'ui']),
    ...mapGetters('textile', ['getInitialized']),
    note: {
      get(): string {
        return (
          this.ui?.userProfile?.metadata?.note ??
          this.$t('modal.profile.about.click_note')
        )
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
  mounted() {
    const el = (this.$refs.noteRef as any).$el as HTMLDivElement
    this.$data.observer = new ResizeObserver(this.handleResize)
    this.$data.observer.observe(el)
  },
  beforeDestroy() {
    if (this.$data.observer) {
      const el = (this.$refs.noteRef as any).$el as HTMLDivElement
      this.$data.observer.unobserve(el)
    }
  },
  methods: {
    handleResize: (entries: ResizeObserverEntry[]) => {
      const [entry] = entries
      const { target } = entry

      const el = target as HTMLDivElement
      const scrollEl = el.closest('.scroll-area') as HTMLDivElement
      const aboutEl = el.closest('.about') as HTMLDivElement

      const scrollTop = aboutEl.clientHeight - scrollEl.clientHeight

      if (scrollEl.scrollTop > scrollTop) {
        scrollEl.scrollTop = scrollTop
      }

      if (scrollEl.clientHeight === aboutEl.clientHeight) {
        scrollEl.classList.remove('ps--active-y')
      }
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

.loading {
  cursor: progress;
}
</style>
