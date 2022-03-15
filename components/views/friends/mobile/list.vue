<template>
  <div id="friends-list" v-scroll-lock="true">
    <div class="top-bar">
      <menu-icon
        size="1.2x"
        class="icon-button toggle-sidebar"
        full-width
        @click="toggleMenu"
      />

      <TypographyTitle :text="$t('friends.friends')" :size="5" />
      <div class="filler" />
      <user-plus-icon
        class="icon-button"
        size="1.2x"
        full-width
        @click="showAddFriend"
      />
      <user-check-icon
        class="icon-button"
        size="1.2x"
        full-width
        @click="toggleMenu"
      />
      <more-vertical-icon
        class="icon-button"
        size="1.2x"
        full-width
        @click="toggleMenu"
      />
    </div>
    <InteractablesInput
      :placeholder="`${$t('ui.search')}...`"
      input-kind="text"
      :delete-icon="true"
      type="dark"
      full-width
      class="search-input"
    />
    <div class="scrolling hidden-scroll friends">
      <UiScroll vertical-scroll enable-wrap scrollbar-visibility="scroll">
        <div v-if="isNoFriends" class="no-friend">
          <TypographyTitle :text="$t('pages.chat.no_friends_yet')" :size="6" />
          <TypographyText :text="$t('pages.chat.no_friends_yet_text')" />
          <img
            v-if="isShowMascot"
            src="~/assets/svg/mascot/sad_curious.svg"
            class="mascot"
          />
          <InteractablesButton
            :text="$t('friends.add') + 's'"
            size="small"
            type="primary"
            :action="gotoAddFriends"
          >
            <user-plus-icon size="1.2x" />
          </InteractablesButton>
        </div>
        <div v-else class="columns friends-list">
          <div class="column is-half-desktop">
            <!-- Friend Requests -->
            <template v-if="friends.incomingRequests.length">
              <div class="padded_divider">
                <TypographyHorizontalRuleText
                  plaintext
                  :value="$t('friends.requests')"
                />
              </div>
              <FriendsFriend
                v-for="friend in friends.incomingRequests"
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
            <!-- Outgoing Requests -->
            <template v-if="friends.outgoingRequests.length">
              <div class="padded_divider">
                <TypographyHorizontalRuleText
                  plaintext
                  :value="$t('friends.outgoing')"
                />
              </div>
              <FriendsFriend
                v-for="friend in alphaSortedOutgoing"
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
          <div class="column is-half-desktop">
            <!-- Friends List -->
            <div
              v-if="
                Object.entries(alphaSortedFriends).length && $device.isMobile
              "
              class="padded_divider"
            >
              <TypographyHorizontalRuleText
                plaintext
                :value="$t('friends.all')"
              />
            </div>
            <div v-if="dataState.friends !== DataStateType.Loading">
              <div
                v-for="entry in Object.entries(alphaSortedFriends)"
                :key="entry[0].toUpperCase()"
              >
                <span class="alpha-divider">{{ entry[0].toUpperCase() }}</span>
                <FriendsFriend
                  v-for="friend in entry[1]"
                  :key="friend.address"
                  :friend="friend"
                />
              </div>
              <div
                v-if="dataState.friends === DataStateType.Updating"
                class="loading-container"
              >
                <UiLoadersUpdating />
              </div>
            </div>
            <div v-else>
              <UiLoadersFriend :count="5" />
            </div>
            <div
              v-if="Object.entries($mock.blocked).length && featureReadyToShow"
              class="padded_divider"
            >
              <TypographyHorizontalRuleText
                plaintext
                :value="$t('friends.blocked')"
              />
            </div>
            <div v-if="featureReadyToShow">
              <FriendsFriend
                v-for="friend in $mock.blocked"
                :key="friend.address"
                :friend="friend"
                blocked
              />
            </div>
          </div>
        </div>
      </UiScroll>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { cloneDeep } from 'lodash'
import {
  MenuIcon,
  UserPlusIcon,
  UserCheckIcon,
  MoreVerticalIcon,
} from 'satellite-lucide-icons'
import { DataStateType } from '~/store/dataState/types'

import { getAlphaSorted } from '~/libraries/ui/Friends'
import { OutgoingRequest } from '~/types/ui/friends'
import { User } from '~/types/ui/user'

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
    MenuIcon,
    UserPlusIcon,
    UserCheckIcon,
    MoreVerticalIcon,
  },
  layout: 'friends',
  data() {
    return {
      route: 'active',
      featureReadyToShow: false,
    }
  },
  computed: {
    DataStateType: () => DataStateType,
    ...mapState(['friends', 'dataState']),
    alphaSortedFriends() {
      return getAlphaSorted(this.friends.all)
    },
    alphaSortedOutgoing() {
      return cloneDeep(this.friends.outgoingRequests).sort(
        (a: OutgoingRequest, b: OutgoingRequest) =>
          a.userInfo.name.localeCompare(b.userInfo.name),
      )
    },
    isNoFriends() {
      return (
        this.dataState.friends !== this.DataStateType.Loading &&
        !this.friends.all.length
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
    toggleMenu() {
      this.$store.commit('ui/showSidebar', true)
      if (this.$device.isMobile) {
        this.$store.commit('ui/setSwiperSlideIndex', 0) // goto initial slide
      }
    },

    /**
     * @method showAddFriend
     * @description On mobile swipe to show 'Add Friend' view
     */
    showAddFriend() {
      this.$store.commit('ui/setSwiperSlideIndex', 2)
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

#friends {
  padding: @normal-spacing 0 0 0;
  margin-top: 2.5rem;
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

#friends-list {
  margin-top: @normal-spacing;
  height: calc(var(--app-height) - @sidebar-inner-offset);
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
    padding-bottom: @sidebar-inner-offset;
  }
}
</style>
