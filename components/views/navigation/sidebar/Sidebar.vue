<template>
  <div class="sidebar">
    <div class="sidebar-inner">
      <div class="sidebar-search">
        <InteractablesInput
          v-model="filter"
          type="search"
          size="sm"
          :placeholder="$t('ui.search')"
        />
        <InteractablesSidebarToggle />
      </div>
      <div class="sidebar-nav">
        <!-- <nuxt-link class="sidebar-button" to="/files" data-cy="sidebar-files">
          <folder-icon size="20" />
          <TypographyText size="sm"> {{ $t('files.files') }} </TypographyText>
        </nuxt-link> -->

        <nuxt-link
          class="sidebar-button"
          to="/friends"
          data-cy="sidebar-friends"
        >
          <users-icon size="20" />
          <TypographyText size="sm">
            {{ $t('friends.friends') }}
          </TypographyText>
          <TypographyTag v-if="incomingRequests.length" class="tag" small>
            {{ incomingRequests.length }}
          </TypographyTag>
        </nuxt-link>
      </div>

      <div class="banner-wrapper">
        <UiEarlyAccessBanner />
      </div>
      <div class="toggle-container">
        <TypographyText as="label" color="dark">
          {{ $t('messaging.messages') }}
        </TypographyText>
        <div class="quick-toggle">
          <button
            v-tooltip.left="$t('pages.chat.new_chat')"
            title="$t('pages.chat.new_chat')"
            @click="toggleQuickchat"
          >
            <plus-icon size="20" />
          </button>
        </div>
        <SidebarQuick v-if="isQuickchatVisible" @toggle="toggleQuickchat" />
      </div>
      <SidebarList :filter="filter" />
    </div>
    <div class="controls">
      <SidebarControls />
      <SidebarStatus />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, Ref } from 'vue'
import { UsersIcon, PlusIcon, FolderIcon } from 'satellite-lucide-icons'
import { friendsHooks } from '~/components/compositions/friends'

const isQuickchatVisible: Ref<boolean> = ref(false)
const filter: Ref<string> = ref('')

const { incomingRequests } = friendsHooks()

function toggleQuickchat() {
  isQuickchatVisible.value = !isQuickchatVisible.value
}
</script>

<style scoped lang="less" src="./Sidebar.less"></style>
