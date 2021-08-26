import Vue from 'vue'
import { Files } from '~/mock/files'
import { Blocked, Friend, Friends, Requests } from '~/mock/friends'
import { Group, Groups } from '~/mock/groups'
import { Messages } from '~/mock/messages'
import { Servers, Unreads } from '~/mock/servers'
import { CallUsers, Users } from '~/mock/users'
import {
  marketCategories,
  marketFilters,
  marketProducts,
} from '~/mock/marketplace'

const mock = {
  users: Users,
  user: Users[3],
  callUsers: CallUsers,
  groups: Groups,
  group: Group,
  servers: Servers,
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
