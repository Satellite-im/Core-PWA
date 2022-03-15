<template>
  <div id="friends-add" v-scroll-lock="true" class="hidden-scroll">
    <UiScroll vertical-scroll enable-wrap scrollbar-visibility="scroll">
      <!--<FriendsNav :setRoute="setRoute" :route="route" />-->
      <div class="columns">
        <div class="column top-bar">
          <arrow-left-icon
            size="1.2x"
            class="icon-button toggle-sidebar"
            full-width
            @click="showFriendList"
          />

          <TypographyTitle :text="$t('friends.add')" :size="5" />
        </div>
        <div class="column is-half-desktop">
          <!-- Friends Add -->
          <FriendsAdd />
        </div>
      </div>
    </UiScroll>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { cloneDeep } from 'lodash'
import { ArrowLeftIcon } from 'satellite-lucide-icons'
import { DataStateType } from '~/store/dataState/types'

import { getAlphaSorted } from '~/libraries/ui/Friends'
import { OutgoingRequest } from '~/types/ui/friends'

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
     * @method showFriendList
     * @description On mobile swipe to show 'Friend List' view
     */
    showFriendList() {
      this.$store.commit('ui/setSwiperSlideIndex', 1)
    },
  },
})
</script>

<style scoped lang="less">
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
  height: @full;
  min-height: @full;
}
.loading-container {
  text-align: center;
}

.padded_divider {
  padding: @light-spacing @normal-spacing;
}

#friends-add {
  margin-top: @normal-spacing;
  .top-bar {
    flex-flow: row;
    display: flex;
    padding: @large-spacing;
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
  }
}
</style>
