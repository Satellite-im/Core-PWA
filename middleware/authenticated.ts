// @ts-ignore
export default function ({ store, redirect }) {
  // If the user is not authenticated
  if (!store.state.accounts.active) {
    return redirect('/auth/unlock')
  }
}
