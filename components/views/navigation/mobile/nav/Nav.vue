<template>
  <nav class="nav" :class="{ hide: !isMobileNavVisible }">
    <button
      v-for="item in buttons"
      :key="item.id"
      :class="{ active: isActiveRoute(item.id) }"
      data-cy="`mobile-nav-${id}`"
      :aria-label="item.label"
      @click="item.func"
    >
      <UiDotBadge v-if="item.icon" :show="item.showBadge">
        <component :is="item.icon" v-if="item.icon" size="1.75x" />
      </UiDotBadge>
      <UiUserState v-else :user="profile" />
    </button>
  </nav>
</template>

<script lang="ts">
import Vue, { ComputedRef, computed, reactive } from 'vue'
import { mapState } from 'vuex'
import { HomeIcon, FolderIcon, UsersIcon } from 'satellite-lucide-icons'
import { SettingsRoutes } from '~/store/ui/types'
import { RootState } from '~/types/store/store'
import iridium from '~/libraries/Iridium/IridiumManager'
import { ButtonAttributes } from '~/types/ui'
import { friendsHooks } from '~/components/compositions/friends'
import { conversationHooks } from '~/components/compositions/conversations'

type NavButtonAttributes = ButtonAttributes & { id: string; showBadge: boolean }

export default Vue.extend({
  components: {
    HomeIcon,
    FolderIcon,
    UsersIcon,
  },
  setup() {
    // @ts-ignore
    const $nuxt = useNuxtApp()

    const { incomingRequests } = friendsHooks()
    const { totalUnreadMessages } = conversationHooks()

    // todo - fix type definition and assign default value
    const profile = reactive(iridium.profile.state)

    function isActiveRoute(route: string): boolean {
      return $nuxt.$route.path.includes(route)
    }

    const buttons: ComputedRef<NavButtonAttributes[]> = computed(() => {
      return [
        {
          id: 'chat',
          label: $nuxt.$t('global.chat'),
          icon: HomeIcon,
          func: () => $nuxt.$router.push('/mobile/chat'),
          showBadge: Boolean(totalUnreadMessages.value),
        },
        {
          id: 'files',
          label: $nuxt.$t('global.files'),
          icon: FolderIcon,
          func: () => $nuxt.$router.push('/files'),
          showBadge: false,
        },
        {
          id: 'friends',
          label: $nuxt.$t('global.friends'),
          icon: UsersIcon,
          func: () => $nuxt.$router.push('/mobile/friends'),
          showBadge: Boolean(incomingRequests.value.length),
        },
        {
          id: 'settings',
          label: $nuxt.$t('global.settings'),
          icon: undefined,
          func: () =>
            isActiveRoute('settings')
              ? $nuxt.$store.commit('ui/setSettingsRoute', SettingsRoutes.EMPTY)
              : $nuxt.$router.push('/mobile/settings'),
          showBadge: false,
        },
      ]
    })

    return { profile, isActiveRoute, buttons }
  },
  computed: {
    ...mapState({
      isMobileNavVisible: (state) => (state as RootState).ui.isMobileNavVisible,
    }),
  },
})
</script>

<style scoped lang="less" src="./Nav.less"></style>
