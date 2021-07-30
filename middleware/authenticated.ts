import { NuxtRouteConfig } from '@nuxt/types/config/router'
import { RawLocation } from 'vue-router'
interface Arguments {
  store: any
  redirect: (location: RawLocation) => void
  route: NuxtRouteConfig
}
export default function ({ store, route, redirect }: Arguments) {
  // If the user is not authenticated
  if (store.state.accounts.locked && route.path !== '/auth/unlock') {
    return redirect('/auth/unlock')
  }
}
