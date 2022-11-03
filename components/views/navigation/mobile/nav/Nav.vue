<template>
  <nav class="nav" :class="{ hide: !isMobileNavVisible }">
    <div class="bar">
      <nuxt-link
        v-for="item in buttons"
        :key="item.id"
        :to="item.path"
        :data-cy="`mobile-nav-${item.id}`"
        @click.native="item.id === 'settings' && emptySettingsRoute()"
      >
        <UiDotBadge v-if="item.icon" :show="item.showBadge">
          <component
            :is="item.icon"
            v-if="item.icon"
            size="1.75x"
            :alt="item.label"
          />
        </UiDotBadge>
        <UiUserState v-else :user="profile" />
      </nuxt-link>
    </div>
  </nav>
</template>

<script lang="ts">
import Vue, { ComputedRef, computed, reactive } from 'vue'
import { TranslateResult } from 'vue-i18n'
import { mapState } from 'vuex'
import {
  MessageCircleIcon,
  FolderIcon,
  UsersIcon,
} from 'satellite-lucide-icons'
import { useNuxtApp } from '@nuxt/bridge/dist/runtime/app'
import { RootState } from '~/types/store/store'
import iridium from '~/libraries/Iridium/IridiumManager'
import { friendsHooks } from '~/components/compositions/friends'
import { conversationHooks } from '~/components/compositions/conversations'
import { SettingsRoutes } from '~/store/ui/types'
import { User } from '~~/libraries/Iridium/users/types'

interface NavButton {
  id: string
  label: TranslateResult
  icon: any
  path: string
  showBadge: boolean
}

export default Vue.extend({
  components: {
    MessageCircleIcon,
    FolderIcon,
    UsersIcon,
  },
  setup() {
    const $nuxt = useNuxtApp()

    const { incomingRequests } = friendsHooks()
    const { totalUnreadMessages } = conversationHooks()

    // todo - fix type definition and assign default value
    const profile = reactive(iridium.profile.state)

    const buttons: ComputedRef<NavButton[]> = computed(() => {
      return [
        {
          id: 'chat',
          label: $nuxt.$t('global.chat'),
          icon: MessageCircleIcon,
          path: '/mobile/chat',
          showBadge: Boolean(totalUnreadMessages.value),
        },
        // {
        //   id: 'files',
        //   label: $nuxt.$t('global.files'),
        //   icon: FolderIcon,
        //   path: '/files',
        //   showBadge: false,
        // },
        {
          id: 'friends',
          label: $nuxt.$t('global.friends'),
          icon: UsersIcon,
          path: '/mobile/friends',
          showBadge: Boolean(incomingRequests.value.length),
        },
        {
          id: 'settings',
          label: $nuxt.$t('global.settings'),
          icon: undefined,
          path: '/mobile/settings',
          showBadge: false,
        },
      ]
    })

    function emptySettingsRoute() {
      $nuxt.$store.commit('ui/setSettingsRoute', SettingsRoutes.EMPTY)
    }

    return { profile, buttons, emptySettingsRoute }
  },
  computed: {
    ...mapState({
      isMobileNavVisible: (state) => (state as RootState).ui.isMobileNavVisible,
    }),
  },
})
</script>

<style scoped lang="less" src="./Nav.less"></style>
