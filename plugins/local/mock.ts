import Vue from 'vue'

import { Users } from '~/mock/users'
import { Groups, Group } from '~/mock/groups'
import { Servers, Unreads } from '~/mock/servers'
import { Messages } from '~/mock/messages'
import { Files } from '~/mock/files'
import { Friends, Friend, Requests, Blocked } from '~/mock/friends'

const mock = {
  users: Users,
  user: Users[3],
  groups: Groups,
  group: Group,
  servers: Servers,
  unreads: Unreads,
  messages: Messages,
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
