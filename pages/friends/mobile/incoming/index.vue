<template>
  <div id="friends-incoming-list" v-scroll-lock="true">
    <div class="top-bar">
      <arrow-left-icon
        size="1.2x"
        class="icon-button toggle-sidebar"
        full-width
        @click="goBack"
      />

      <TypographyTitle :text="$t('friends.incoming')" :size="5" />
    </div>
    <InteractablesInput
      v-model="search"
      :placeholder="`${$t('ui.search')}...`"
      input-kind="text"
      :delete-icon="true"
      type="dark"
      full-width
      class="search-input"
    />
    <div class="scrolling hidden-scroll friends">
      <UiScroll vertical-scroll enable-wrap scrollbar-visibility="scroll">
        <div class="columns friends-list">
          <div class="column is-half-desktop">
            <!-- Friend Requests -->
            <div class="typography-container">
              <TypographyText
                size="6"
                plaintext
                :text="$t('friends.received')"
              />
            </div>
            <UiLoadersFriend
              v-if="dataState.friends === DataStateType.Loading"
              :count="1"
            />
            <template v-else-if="searchIncomingFriends.length">
              <FriendsFriend
                v-for="friend in searchIncomingFriends"
                :key="friend.from"
                :friend="{
                  name: friend.userInfo.name,
                  address: friend.from,
                  state: 'offline',
                  status: friend.userInfo.status,
                  request: friend,
                }"
                request
              />
            </template>
            <div v-else>
              <TypographyText
                size="6"
                plaintext
                :text="$t('friends.no_friend_request')"
              />
            </div>
            <!-- Outgoing Requests -->
            <UiLoadersFriend
              v-if="dataState.friends === DataStateType.Loading"
              :count="1"
            />
            <template v-else-if="searchOutgoingFriends.length">
              <div class="typography-container">
                <TypographyText size="6" plaintext :text="$t('friends.sent')" />
              </div>
              <FriendsFriend
                v-for="friend in searchOutgoingFriends"
                :key="friend.to"
                :friend="{
                  name: friend.userInfo.name,
                  address: friend.to,
                  state: 'offline',
                  status: friend.userInfo.status,
                  request: friend,
                }"
                outgoing
              />
            </template>
          </div>
        </div>
      </UiScroll>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { ArrowLeftIcon } from 'satellite-lucide-icons'

import { DataStateType } from '~/store/dataState/types'

import { FriendRequest } from '~/types/ui/friends'

type Route = 'active' | 'requests' | 'blocked' | 'add'
declare module 'vue/types/vue' {
  interface Vue {
    friends: any
    initRoute: () => void
  }
}
export default Vue.extend({
  name: 'FriendsList',
  components: {
    ArrowLeftIcon,
  },
  data() {
    return {
      route: 'active',
      search: '',
      featureReadyToShow: false,
    }
  },
  computed: {
    DataStateType: () => DataStateType,
    ...mapState(['friends', 'dataState']),
    /**
     * @method searchOutgoingFriends
     * @description returns the outgoing friends filtered by search keyword
     */
    searchOutgoingFriends(): FriendRequest[] {
      return this.friends.outgoingRequests.filter((friend: FriendRequest) =>
        friend.userInfo.name.toLowerCase().includes(this.search.toLowerCase()),
      )
    },
    /**
     * @method searchIncomingFriends
     * @description returns the incoming friends filtered by search keyword
     */
    searchIncomingFriends(): FriendRequest[] {
      return this.friends.incomingRequests.filter((friend: FriendRequest) =>
        friend.userInfo.name.toLowerCase().includes(this.search.toLowerCase()),
      )
    },
  },
  watch: {
    '$route.query'() {
      this.initRoute()
    },
  },
  mounted() {
    this.initRoute()
  },
  methods: {
    /**
     * @method setRoute DocsTODO
     * @description
     * @param route
     * @example
     */
    setRoute(route: Route) {
      this.$router.replace({ path: this.$route.path, query: { tab: route } })
    },
    /**
     * @method initRoute DocsTODO
     * @description
     * @param
     * @example
     */
    initRoute() {
      const query = this.$route.query
      if (query && query.tab) {
        this.$data.route = query.tab
        return
      }
      this.$data.route = 'active'
    },
    /**
     * @method goBack
     * @description go back to last route
     */
    goBack() {
      this.$router.back()
    },

    /**
     * @method navigateAddFriend
     * @description navigate to add friend page
     */
    navigateAddFriend() {
      this.$router.push('/friends/mobile/add')
    },
    /**
     * @method showIncomingFriend
     * @description navigate to incoming friends request page
     */
    navigateIncomingFriend() {
      this.$router.push('/friends/mobile/incoming')
    },
  },
})
</script>

<style scoped lang="less">
@sidebar-inner-offset: 75px;

.alpha-divider {
  &:extend(.full-width);
  display: inline-block;
  padding-left: @normal-spacing;
  font-size: @mini-text-size;
  &:extend(.font-accent);
  font-family: @primary-font;
}

.scrolling {
  height: calc(100% - @sidebar-inner-offset);
  min-height: calc(100% - @sidebar-inner-offset);
}
.loading-container {
  text-align: center;
}

.padded_divider {
  padding: @light-spacing @normal-spacing;
}

#friends-incoming-list {
  margin-top: @normal-spacing;
  height: calc(var(--app-height) - @sidebar-inner-offset);
  width: 100%;
  .top-bar {
    flex-flow: row;
    display: flex;
    padding: @large-spacing @large-spacing 0;

    .toggle-sidebar {
      position: relative;
      display: flex;
      margin-right: @light-spacing;
    }

    .toggle-sidebar {
      color: @primary-color;
    }

    .icon-button {
      margin-right: @large-spacing;
    }

    .filler {
      flex: 1;
    }
  }

  .typography-container {
    padding: @light-spacing 0;
  }
  .no-friend {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-flow: column;
    height: calc(100% - @sidebar-inner-offset);

    .button {
      margin-top: @normal-spacing;
      width: 75%;
    }
  }

  .search-input {
    padding: @normal-spacing;
  }

  .friends-list {
    padding-left: @normal-spacing;
  }
}
</style>
