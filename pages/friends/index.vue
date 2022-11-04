<template>
  <div class="friends">
    <div class="tab-container">
      <InteractablesSidebarToggle v-if="!showSidebar" />
      <InteractablesTabs :tabs="tabs" :route="activeTab" @setRoute="setRoute" />
    </div>
    <div class="main-content">
      <div v-if="!activeTab && !friends.length" class="empty-friends-container">
        <FriendsEmptyMessage class="empty-friends" />
      </div>
      <FriendsItem
        v-for="user in friends"
        v-show="!activeTab"
        :key="user?.did"
        :user="user"
        type="friend"
      />
      <FriendsAdd v-show="activeTab === FriendsTabs.ADD" />
      <FriendsRequests v-show="activeTab === FriendsTabs.REQUESTS" />
    </div>
  </div>
</template>

<script lang="ts">
import { useNuxtApp } from '@nuxt/bridge/dist/runtime/app'
import { computed } from 'vue'
import { Tab } from '~/types/ui/tab'
import { FriendsTabs } from '~/libraries/Enums/enums'
import { friendsHooks } from '~~/components/compositions/friends'
export default {
  name: 'Friends',
  layout: 'desktop',
}
</script>

<script setup lang="ts">
const { $i18n, $store } = useNuxtApp()

const { friends, incomingRequests } = friendsHooks()

// @ts-ignore
const $route = useRoute()
// @ts-ignore
const $router = useRouter()

const showSidebar = computed<boolean>(() => {
  return $store.state.ui.showSidebar
})

const activeTab = computed<FriendsTabs>(() => {
  return $route.query.route as FriendsTabs
})

const tabs: Tab[] = [
  {
    text: $i18n.t('friends.friends'),
    route: FriendsTabs.DEFAULT,
  },
  {
    text: $i18n.t('friends.add'),
    route: FriendsTabs.ADD,
  },
  {
    text: $i18n.t('friends.requests'),
    route: FriendsTabs.REQUESTS,
    badge: incomingRequests.value.length,
  },
]
function setRoute(route: FriendsTabs) {
  $router.push({
    query: route ? { route } : {},
  })
}
</script>

<style scoped lang="less" src="./Friends.less"></style>
