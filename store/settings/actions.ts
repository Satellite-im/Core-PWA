import Vue from 'vue'
import { TextileError } from '../textile/types'
import { db } from '~/libraries/SatelliteDB/SatelliteDB'
import TextileManager from '~/libraries/Textile/TextileManager'
import { UserInfoManager } from '~/libraries/Textile/UserManager'
import { SettingsError, SettingsState } from '~/store/settings/types'
import { ActionsArguments } from '~/types/store/store'

export default {
  async clearLocalStorage({ commit }: ActionsArguments<SettingsState>) {
    try {
      await db.delete()
      localStorage.clear()
      commit('removeAppState', true)
      location.reload()
    } catch (e) {
      throw new Error(SettingsError.DATABASE_NOT_CLEARED)
    }
  },
  async setConsentScan(
    { commit }: ActionsArguments<SettingsState>,
    consentScan: boolean,
  ) {
    try {
      commit('setConsentScan', consentScan)

      const $TextileManager: TextileManager = Vue.prototype.$TextileManager

      if (!$TextileManager.userInfoManager) {
        throw new Error(TextileError.METADATA_MANAGER_NOT_FOUND)
      }
      const $UserInfoManager: UserInfoManager = $TextileManager.userInfoManager
      $UserInfoManager.setConsent({
        consentScan,
        consentDate: Date.now(),
      })
    } catch (e) {}
  },
}
