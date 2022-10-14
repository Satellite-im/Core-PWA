<template>
  <nav class="nav" :class="{ hide: !isMobileNavVisible }">
    <button
      v-for="(item, i) in buttons"
      :key="i"
      :class="{ active: isActiveRoute(item.id) }"
      data-cy="`mobile-nav-${id}`"
      :aria-label="item.label"
      @click="item.func"
    >
      <component :is="item.icon" v-if="item.icon" size="1.75x" />
      <UiUserState v-else :user="profile" />
    </button>
  </nav>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { HomeIcon, FolderIcon, UsersIcon } from 'satellite-lucide-icons'
import { SettingsRoutes } from '~/store/ui/types'
import { RootState } from '~/types/store/store'
import iridium from '~/libraries/Iridium/IridiumManager'
import { ButtonAttributes } from '~/types/ui'
import { friendsHooks } from '~/components/compositions/friends'

export default Vue.extend({
  components: {
    HomeIcon,
    FolderIcon,
    UsersIcon,
  },
  setup() {
    const { incomingRequests } = friendsHooks()

    return { incomingRequests }
  },
  data() {
    return {
      friends: iridium.friends.state,
      profile: iridium.profile.state,
    }
  },
  computed: {
    ...mapState({
      isMobileNavVisible: (state) => (state as RootState).ui.isMobileNavVisible,
    }),
    buttons(): (ButtonAttributes & { id: string })[] {
      return [
        {
          id: 'chat',
          label: this.$t('global.chat'),
          icon: HomeIcon,
          func: () => this.$router.push('/mobile/chat'),
        },
        {
          id: 'files',
          label: this.$t('global.files'),
          icon: FolderIcon,
          func: () => this.$router.push('/files'),
        },
        {
          id: 'friends',
          label: this.$t('global.friends'),
          icon: UsersIcon,
          func: () => this.$router.push('/mobile/friends'),
        },
        {
          id: 'settings',
          label: this.$t('global.settings'),
          icon: undefined,
          func: () =>
            this.isActiveRoute('settings')
              ? this.$store.commit('ui/setSettingsRoute', SettingsRoutes.EMPTY)
              : this.$router.push('/mobile/settings'),
        },
      ]
    },
  },
  methods: {
    isActiveRoute(route: string): boolean {
      return this.$route.path.includes(route)
    },
  },
})
</script>

<style scoped lang="less" src="./Nav.less"></style>
