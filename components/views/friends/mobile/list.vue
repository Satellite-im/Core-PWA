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
        @click="navigateAddFriend"
      />
      <div class="user-check-container">
        <user-check-icon
          class="icon-button"
          size="1.2x"
          full-width
          @click="navigateIncomingFriend"
        >
        </user-check-icon>
        <span v-if="friends.incomingRequests.length" class="label">
          {{ friends.incomingRequests.length }}
        </span>
      </div>

      <more-vertical-icon
        v-if="featureReadyToShow"
        class="icon-button has-tooltip-bottom"
        size="1.2x"
        full-width
        @click="contextMenu"
      />
    </div>
    <InteractablesInput
      v-if="!isNoFriends"
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
        <div v-if="isNoFriends" class="no-friend">
          <TypographyTitle :text="$t('pages.chat.no_friends_yet')" :size="6" />
          <TypographyText :text="$t('pages.chat.no_friends_yet_text')" />
          <InteractablesButton
            :text="$t('friends.add') + 's'"
            size="small"
            type="primary"
            :action="navigateAddFriend"
          >
            <user-plus-icon size="1.2x" />
          </InteractablesButton>
        </div>
        <div v-else class="columns friends-list">
          <div class="column is-half-desktop">
            <!-- Friends List -->
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
          </div>
        </div>
      </UiScroll>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import {
  MenuIcon,
  UserPlusIcon,
  UserCheckIcon,
  MoreVerticalIcon,
} from 'satellite-lucide-icons'
import { DataStateType } from '~/store/dataState/types'

import { getAlphaSorted } from '~/libraries/ui/Friends'
import { Friend } from '~/types/ui/friends'
import ContextMenu from '~/components/mixins/UI/ContextMenu'

declare module 'vue/types/vue' {
  interface Vue {
    friends: any
    initRoute: () => void
    searchResult: () => Friend[]
    navigateToBlock: () => void
    swiperSlideIndex: number
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
  mixins: [ContextMenu],
  layout: 'friends',
  data() {
    return {
      route: 'active',
      featureReadyToShow: false,
      search: '',
      contextMenuValues: [
        {
          text: this.$t('friends.blocked_friends'),
          func: this.navigateToBlock,
        },
      ],
    }
  },
  computed: {
    DataStateType: () => DataStateType,
    ...mapState(['friends', 'dataState']),
    alphaSortedFriends() {
      return getAlphaSorted(this.searchResult())
    },

    isNoFriends() {
      return (
        this.dataState.friends !== this.DataStateType.Loading &&
        !this.friends.all.length
      )
    },
    swiperSlideIndex() {
      return this.$store.state.ui.swiperSlideIndex
    },
    showSidebar() {
      return this.$store.state.ui.showSidebar
    },
  },
  methods: {
    /**
     * @method searchResult
     * @description filter the friends list by search
     * @returns returns the filtered friends list by search keyword
     */
    searchResult(): Friend[] {
      return this.friends.all.filter((user: Friend) =>
        user.name.toLowerCase().includes(this.search.toLowerCase()),
      )
    },
    toggleMenu() {
      this.$store.commit('ui/showSidebar', !this.showSidebar)
      if (this.$device.isMobile) {
        this.$store.commit('ui/setSwiperSlideIndex', 1 - this.swiperSlideIndex)
      }
    },
    /**
     * @method navigateAddFriend
     * @description navigate to add friend page
     */
    navigateAddFriend() {
      this.$router.push('/friends/mobile/add')
    },
    /**
     * @method navigateIncomingFriend
     * @description navigate to incoming friends request page
     */
    navigateIncomingFriend() {
      this.$router.push('/friends/mobile/incoming')
    },
    /**
     * @method navigateToBlock
     * @description navigate to block list pages
     */
    navigateToBlock() {
      this.$router.push('/friends/mobile/block')
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

#friends-list {
  margin-top: @normal-spacing;
  height: calc(var(--app-height) - @sidebar-inner-offset);
  .top-bar {
    flex-flow: row;
    display: flex;
    padding: 0 @large-spacing;

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

    .user-check-container {
      position: relative;
      .label {
        position: absolute;
        top: 0.75rem;
        right: 0.95rem;
        font-size: @micro-text-size;
        &:extend(.background-primary);
        border-radius: 2px;
        line-height: 1.2;
        padding: 0.15rem 0.25rem;
        &:extend(.font-primary);
        font-family: @primary-font;
      }
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
