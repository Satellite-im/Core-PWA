import Vue from 'vue'
import { Files } from '~/mock/files'
import { Blocked, Friend, Friends, Requests } from '~/mock/friends'
import { Glyphs } from '~/mock/glyphs'
import { ExampleGroup, Groups } from '~/mock/groups'
import {
  marketCategories,
  marketFilters,
  marketProducts,
} from '~/mock/marketplace'
import { Messages } from '~/mock/messages'
import { Servers, Unreads, ServerInfo } from '~/mock/servers'
import { CallUsers, Users } from '~/mock/users'

const mock = {
  users: Users,
  user: Users[3],
  callUsers: CallUsers,
  groups: Groups,
  group: ExampleGroup,
  servers: Servers,
  server: {
    info: ServerInfo
  },
  unreads: Unreads,
  messages: Messages,
  marketplace: {
    marketCategories,
    marketFilters,
    marketProducts,
  },
  files: Files,
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
