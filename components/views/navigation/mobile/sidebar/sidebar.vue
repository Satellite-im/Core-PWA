<template>
  <div id="chat-mobile-sidebar" class="collapsed">
    <div
      :class="
        media.streaming
          ? 'sidebar-inner sidebar-inner-streaming'
          : 'sidebar-inner'
      "
    >
      <div
        :class="
          isNoFriends && isChatPage
            ? 'sidebar-search full-width'
            : 'sidebar-search'
        "
      >
        <UiComingSoon
          :tooltip-text="$t('coming_soon.sidebar_search')"
          :tooltip-position="'bottom'"
          disabled
        >
          <InteractablesInput
            :placeholder="`${$t('ui.search')}...`"
            size="small"
            input-kind="text"
            :delete-icon="true"
            type="dark"
            full-width
            disabled
          />
        </UiComingSoon>
        <menu-icon
          v-if="!(isNoFriends && isChatPage)"
          class="toggle-sidebar"
          size="1.2x"
          full-width
          @click="showMenu"
        />
      </div>
      <div v-if="!$device.isMobile" class="sidebar-nav">
        <div style="position: relative">
          <InteractablesButton
            :inactive="$route.path.includes('/friends/list') ? false : true"
            class="sidebar-full-btn"
            :type="$route.path.includes('/friends/list') ? 'primary' : 'dark'"
            size="small"
            :action="
              () => {
                friends.incomingRequests.length
                  ? $router.push('/friends/list?tab=requests')
                  : $router.push('/friends/list')
              }
            "
            :text="$t('friends.friends')"
          >
            <users-icon size="1.2x" />
          </InteractablesButton>
          <span
            v-if="
              friends.incomingRequests.length &&
              dataState.friends === DataStateType.Ready
            "
            :class="
              $route.path.includes('/friends/list')
                ? 'label tag-inverted'
                : 'label'
            "
          >
            {{ friends.incomingRequests.length }}
          </span>
        </div>
        <InteractablesButton
          :inactive="$route.path.includes('/files') ? false : true"
          class="sidebar-full-btn"
          :type="$route.path.includes('/files') ? 'primary' : 'dark'"
          size="small"
          :action="() => $router.push('/files/browse')"
          :text="$t('files.files')"
        >
          <folder-icon size="1.2x" />
        </InteractablesButton>
      </div>

      <Slimbar
        v-if="$device.isMobile && featureReadyToShow"
        :servers="$mock.servers"
        :unreads="$mock.unreads"
        :open-modal="toggleModal"
        horizontal
      />

      <FriendsQuick v-if="ui.modals.quickchat" v-click-outside="toggleModal" />
      <div
        v-if="ui.showSidebarUsers"
        v-scroll-lock="true"
        class="scrolling hidden-scroll users"
      >
        <UiSimpleScroll
          scroll-mode="vertical"
          scroll-show="scroll"
          :container-class="isNoFriends ? 'no-friends-scrollbar' : ''"
        >
          <UiLoadersAddress
            v-if="dataState.friends === DataStateType.Loading"
            :count="4"
            inverted
          />
          <div v-else-if="users && users.length">
            <UiInlineNotification
              v-if="ui.unreadMessage.length"
              :text="$t('messaging.new_messages')"
            />
            <User
              v-for="(user, i) in users"
              :key="i"
              :user="user"
              :is-typing="ui.isTyping.address === user.address"
            />
          </div>
          <div v-else-if="isNoFriends" class="no-friends">
            <TypographyTitle
              :text="$t('pages.chat.no_friends_yet')"
              :size="6"
            />
            <TypographyText :text="$t('pages.chat.no_friends_yet_text')" />
            <img src="~/assets/svg/mascot/sad_curious.svg" class="mascot" />
            <InteractablesButton
              :text="$t('friends.add') + 's'"
              size="small"
              type="primary"
              :action="gotoAddFriends"
            >
              <user-plus-icon size="1.2x" />
            </InteractablesButton>
          </div>
        </UiSimpleScroll>
      </div>
      <div v-else v-scroll-lock="true" class="scrolling hidden-scroll">
        <UiSimpleScroll scroll-mode="vertical" scroll-show="scroll">
          <UiLoadersAddress
            v-if="dataState.friends === DataStateType.Loading"
            :count="4"
            inverted
          />
          <div v-else-if="groups && groups.length">
            <GroupAside
              v-for="group in groups"
              :key="group.address"
              :selected-group="group"
            />
          </div>
        </UiSimpleScroll>
      </div>
      <div class="new-chat-container">
        <InteractablesButton
          v-if="!isNoFriends"
          class="new-chat"
          type="primary"
          :action="gotoNewMessage"
        >
          <plus-icon size="1x" />
        </InteractablesButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapGetters, mapState } from 'vuex'

import {
  UsersIcon,
  UserPlusIcon,
  PlusIcon,
  FolderIcon,
  MenuIcon,
} from 'satellite-lucide-icons'

import { DataStateType } from '~/store/dataState/types'
import { Group } from '~/types/ui/core'
import { User } from '~/types/ui/user'
import { Conversation } from '~/store/textile/types'

declare module 'vue/types/vue' {
  interface Vue {
    sortUserList: Function
  }
}

export default Vue.extend({
  components: {
    UsersIcon,
    UserPlusIcon,
    PlusIcon,
    FolderIcon,
    MenuIcon,
  },
  props: {
    toggle: {
      type: Function,
      default: () => {},
    },
    users: {
      type: Array as PropType<Array<User>>,
      default: () => [],
    },
    groups: {
      type: Array as PropType<Array<Group>>,
      default: () => [],
    },
    showMenu: {
      type: Function,
      default: () => {},
    },
    sidebar: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      featureReadyToShow: false,
    }
  },
  computed: {
    DataStateType: () => DataStateType,
    ...mapState(['ui', 'dataState', 'media', 'friends', 'textile']),
    ...mapGetters('textile', ['getSortedFriendsAndGroups']),
    toggleView: {
      get() {
        return this.ui.showSidebarUsers
      },
      set(value: Boolean) {
        this.$store.commit('ui/showSidebarUsers', value)
      },
    },
    isNoFriends() {
      return (
        this.dataState.friends !== this.DataStateType.Loading &&
        !this.users.length
      )
    },
    isChatPage() {
      return this.$route.name?.includes('chat-direct')
    },
  },
  methods: {
    toggleModal() {
      this.$store.commit('ui/toggleModal', {
        name: 'quickchat',
        state: !this.ui.modals.quickchat,
      })
    },
    /**
     * @name gotoAddFriends
     * @description go to 'friends/list'
     */
    gotoAddFriends() {
      this.$router.push({ path: '/friends/mobile/add' })
    },
    /**
     * @name gotoNewMessage
     * @description go to 'friends/list'
     */
    gotoNewMessage() {
      if (this.$device.isMobile) {
        this.$store.commit('ui/setSwiperSlideIndex', 1) // New message slide index is 2
      }
      this.$router.push({ path: '/message' })
    },
    navigateToGroup(groupId: string) {
      this.$router.push(`/chat/groups/${groupId}`)
    },
  },
})
</script>

<style scoped lang="less">
@sidebar-inner-offset: 75px;
@mobile-sidebar-inner-offset: 245px;

@sidebar-inner-streaming-pad: 2rem;
@mobile-sidebar-inner-streaming-pad: 6rem;

#chat-mobile-sidebar {
  width: 100%;
  min-width: 100%;
  position: relative;
  height: @full;
  display: flex;
  flex-direction: column;
  padding-bottom: @normal-spacing;

  &:extend(.first-layer);
  background: transparent;

  .sidebar-inner {
    &:extend(.round-corners);
    margin-top: @normal-spacing;
    max-height: calc(var(--app-height) - @sidebar-inner-offset);
    display: flex;
    flex: 1;
    flex-direction: column;
    padding-bottom: @normal-spacing;

    .toggle-sidebar {
      cursor: pointer;
      position: absolute;
      &:extend(.first-layer);
      top: 2.5rem;
      right: 1rem;
    }

    #simple-scrollbar.no-friend-scrollbar {
      display: flex;
      align-items: center;
    }

    .no-friends {
      &:extend(.full-width);
      display: inline-flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      height: @full;
      padding-bottom: @xlarge-spacing;

      .button {
        margin-top: @normal-spacing;
        width: 75%;
      }

      .is-text {
        text-align: center;
      }

      .mascot {
        max-width: @half;
        padding-top: @normal-spacing;
        pointer-events: none;
      }
    }
    .users {
      flex: 1;
      position: relative;
      overflow: hidden;
      .inline-notification {
        width: @sidebar-size - (@normal-spacing * 2);
      }
    }
    .sidebar-search {
      &:extend(.full-width);
      padding: 1rem 3rem 1rem 1rem;

      &.full-width {
        padding-right: 1rem;
      }
    }

    .toggle-sidebar {
      cursor: pointer;
      position: absolute;

      &:extend(.first-layer);
      top: @normal-spacing * 2.5;
      right: @normal-spacing;
      &:extend(.filter-glow);
    }
  }

  .sidebar-inner-streaming {
    max-height: calc(
      var(--app-height) - @sidebar-inner-offset - @sidebar-inner-streaming-pad
    );
  }

  .controls {
    &:extend(.background-semitransparent-light);
    &:extend(.round-corners);
    padding: @light-spacing @normal-spacing @normal-spacing @normal-spacing;
    box-shadow: @ui-shadow;
  }

  .padded {
    padding: @normal-spacing @normal-spacing 0 @normal-spacing;
  }

  .no-top-pad {
    padding: 0 @normal-spacing;
  }

  .tabs {
    margin-bottom: @normal-spacing;
    overflow: unset;
  }

  .label {
    position: absolute;
    top: 0.25rem;
    right: 0.25rem;
    font-size: @micro-text-size;
    border-radius: 2px;
    line-height: 1.2;
    padding: 0.15rem 0.25rem;
    &:extend(.font-primary);
    font-family: @primary-font;
  }

  .sidebar-selector {
    .button:nth-child(1) {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
    .button:nth-child(2) {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
  }

  .scrolling {
    padding: 0 @normal-spacing;
    .ps {
      padding-right: @normal-spacing * 1.5;
      right: -@normal-spacing;
      left: 0;
      width: calc(@full + @normal-spacing);
    }
  }

  .loading-container {
    display: inline-flex;
    justify-content: center;
    &:extend(.full-width);
  }
}

.flexy {
  display: inline-flex;

  .quick-chat {
    padding-left: @light-spacing;
    display: inline-flex;
    justify-items: center;
    align-items: center;
    cursor: pointer;
    width: auto;

    &:extend(.first-layer);
    &::before {
      &:extend(.first-layer);
    }
  }
}

.sidebar-full-btn {
  &:extend(.full-width);
  margin-bottom: @light-spacing;
  justify-content: flex-start;
}

.sidebar-nav {
  padding: 0 @normal-spacing;
  margin-bottom: @light-spacing;
}

@media only screen and (max-width: @mobile-breakpoint) {
  #sidebar {
    &:extend(.first-layer);
    width: @sidebar-size-mobile;
    min-width: @sidebar-size-mobile;
    padding-bottom: @mobile-nav-size;
    .sidebar-inner {
      max-height: calc(var(--app-height) - @mobile-sidebar-inner-offset);
      box-shadow: none;
      background: none;
    }
    .sidebar-inner-streaming {
      max-height: calc(
        var(--app-height) - @sidebar-inner-offset -
          @mobile-sidebar-inner-streaming-pad
      );
    }
  }

  .desktop #sidebar {
    width: calc(@sidebar-size-mobile - @slimbar-size);
    min-width: calc(@sidebar-size-mobile - @slimbar-size);
  }

  .quick-mobile-chat {
    position: absolute;
    width: 45px;
    height: 45px;
    bottom: 88px;
    right: 16px;
    box-shadow: 0px 1px 2px rgba(26, 26, 36, 0.65),
      -2px 0px 20px rgba(39, 97, 253, 0.35),
      -2px 5px 14px rgba(39, 97, 253, 0.4);
  }

  .new-chat-container {
    display: inline-flex;
    position: absolute;
    right: 0;
    bottom: @sidebar-inner-offset;
    .new-chat {
      position: absolute;
      right: 0;
      bottom: 0;
      text-align: right;
      margin-right: 1rem;
      margin-bottom: 1rem;
    }
  }
}

@media only screen and (max-width: @mobile-candybar-breakpoint) {
  #sidebar {
    max-width: @sidebar-size;
    min-width: @sidebar-size-mobile;
    sidebar-inner {
      max-height: calc(var(--app-height) - @mobile-sidebar-inner-offset);
      .users {
        .inline-notification {
          width: 100vw - 32rem !important;
        }
      }
    }
  }
}
</style>
