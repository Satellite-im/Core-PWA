<template>
  <div id="friends-blocked" v-scroll-lock="true" class="hidden-scroll">
    <UiScroll vertical-scroll enable-wrap scrollbar-visibility="scroll">
      <!--<FriendsNav :setRoute="setRoute" :route="route" />-->
      <div class="columns">
        <div class="column top-bar">
          <arrow-left-icon
            size="1.2x"
            class="icon-button toggle-sidebar"
            full-width
            @click="goBack"
          />

          <TypographyTitle :text="$t('friends.blocked')" :size="5" />
        </div>
        <div class="column is-half-desktop">
          <div class="typography-container">
            <TypographyText
              size="6"
              plaintext
              :text="$t('friends.no_blocked')"
            />
          </div>
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
  methods: {
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
  },
})
</script>

<style scoped lang="less">
#friends-blocked {
  margin-top: @normal-spacing;
  .top-bar {
    flex-flow: row;
    display: flex;
    padding: @large-spacing;

    .icon-button {
      margin-right: @large-spacing;
    }
  }

  .typography-container {
    padding: @light-spacing @normal-spacing;
  }
}
</style>
