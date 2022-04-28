import Vue from 'vue'
import { Blocked, Friend, Friends, Requests } from '~/mock/friends'
import { Glyphs } from '~/mock/glyphs'
import { ExampleGroup, Groups } from '~/mock/groups'
import {
  marketCategories,
  marketFilters,
  marketGlyphs,
  marketGlyphShopFilter,
  marketProducts,
} from '~/mock/marketplace'
import { RecentTransactions, LinkedAccounts, Details } from '~/mock/wallet'
import { Messages, PinnedMessages } from '~/mock/messages'
import { ServerInfo, Servers, Unreads } from '~/mock/servers'
import { CallUsers, Users } from '~/mock/users'

const mock = {
  users: Users,
  user: Users[3],
  callUsers: CallUsers,
  groups: Groups,
  group: ExampleGroup,
  servers: Servers,
  wallet: {
    RecentTransactions,
    LinkedAccounts,
    Details,
  },
  server: {
    info: ServerInfo,
  },
  unreads: Unreads,
  messages: Messages,
  pinnedMessages: PinnedMessages,
  marketplace: {
    marketCategories,
    marketFilters,
    marketProducts,
    marketGlyphs,
    marketGlyphShopFilter,
  },
  friends: Friends,
  friend: Friend,
  requests: Requests,
  blocked: Blocked,
  glyphs: Glyphs,
}

declare module 'vue/types/vue' {
  interface Vue {
    $mock: any
  }
}

declare module '@nuxt/types' {
  interface Context {
    $mock: any
  }
}

Vue.prototype.$mock = mock
