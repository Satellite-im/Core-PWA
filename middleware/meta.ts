import { NuxtRouteConfig } from '@nuxt/types/config/router'
import { RootStore } from '~/types/store/store'

interface Arguments {
  store: RootStore
  route: NuxtRouteConfig
}

export default function ({ store, route }: Arguments) {
  store.commit('meta/setTitle', route.name)
}
