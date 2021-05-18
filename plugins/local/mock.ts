import Vue from 'vue'

import { Users } from '~/mock/users'
import { Servers, Unreads } from '~/mock/servers'
import { Messages } from '~/mock/messages'
import { Files } from '~/mock/files'

const mock = {
  users: Users,
  user: Users[3],
  servers: Servers,
  unreads: Unreads,
  messages: Messages,
  files: Files,
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
