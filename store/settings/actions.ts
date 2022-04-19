import Vue from 'vue'
import { TextileError } from '../textile/types'
import { db } from '~/libraries/SatelliteDB/SatelliteDB'
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
      const $UserInfoManager: UserInfoManager =
        Vue.prototype.$TextileManager.userInfoManager

      if (!$UserInfoManager) {
        throw new Error(TextileError.USERINFO_MANAGER_NOT_FOUND)
      }

      $UserInfoManager.setConsent({
        consentScan,
        consentDate: Date.now(),
      })
      commit('setConsentScan', consentScan)
    } catch (e) {
      console.log(e)
    }
  },

  async setBlockNsfw(
    { commit }: ActionsArguments<SettingsState>,
    blockNsfw: boolean,
  ) {
    try {
      const $UserInfoManager: UserInfoManager =
        Vue.prototype.$TextileManager.userInfoManager

      if (!$UserInfoManager) {
        throw new Error(TextileError.USERINFO_MANAGER_NOT_FOUND)
      }

      $UserInfoManager.setBlockNsfw(blockNsfw)
      commit('setBlockNsfw', blockNsfw)
    } catch (e) {
      console.log(e)
    }
  },

  async setBlockNsfw(
    { commit }: ActionsArguments<SettingsState>,
    blockNsfw: boolean,
  ) {
    try {
      const $UserInfoManager: UserInfoManager =
        Vue.prototype.$TextileManager.userInfoManager

      if (!$UserInfoManager) {
        throw new Error(TextileError.USERINFO_MANAGER_NOT_FOUND)
      }

      $UserInfoManager.setBlockNsfw(blockNsfw)

      commit('setBlockNsfw', blockNsfw)
    } catch (e) {}
  },
}
