import { RawLocation } from 'vue-router'
interface Arguments {
  store: any
  redirect: (location: RawLocation) => void
}
export default function ({ store, redirect }: Arguments) {
  // If the user is not authenticated
  if (!store.state.accounts.active) {
    return redirect('/auth/unlock')
  }
}
