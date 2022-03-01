import { NuxtRouteConfig } from '@nuxt/types/config/router'
// TODO: verify why we got the import/named error for RawLocation import AP-394
// eslint-disable-next-line import/named
import { RawLocation } from 'vue-router'
import memoize from 'lodash/memoize'
import { Config } from '~/config'
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

  const eventuallyRedirect = memoize(
    (path: string) => {
      if (route.path === path) return
      redirect(path)
    },
    () => redirect,
  )

  // If the user is not authenticated
  if (locked) {
    return eventuallyRedirect('/auth/unlock')
  }

  // If the wallet has not been created yet
  if (!locked && phrase === '' && !route.path.includes('setup')) {
    return eventuallyRedirect('/setup/disclaimer')
  }

  const [_, domain] = route.path.split('/')

  if (Config.routingMiddleware.prerequisitesCheckBypass.includes(domain)) {
    return
  }

  store.commit('accounts/setLastVisited', route.path)
}
