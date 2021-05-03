import { SettingsMutations } from './settings'

export const state = () => ({
  counter: 0,
})

export const mutations = {
  ...SettingsMutations,
}
