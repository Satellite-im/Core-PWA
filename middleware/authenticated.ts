import { NuxtRouteConfig } from '@nuxt/types/config/router'
// TODO: verify why we got the import/named error for RawLocation import
// eslint-disable-next-line import/named
import { RawLocation } from 'vue-router'
import { RootStore } from '~/types/store/store'
interface Arguments {
  store: RootStore
  redirect: (location: RawLocation) => void
  route: NuxtRouteConfig
}

/**
 * @method
 * @description
 * @param
 * @returns
 * @example
 */
export default function ({ store, route, redirect }: Arguments) {
  const { locked, phrase } = store.state.accounts

  // If the user is not authenticated
  if (locked && route.path !== '/auth/unlock') {
    return redirect('/auth/unlock')
  }

  // If the wallet has not been created yet
  if (!locked && phrase === '' && route.path !== '/setup/disclaimer') {
    return redirect('/setup/disclaimer')
  }
}
