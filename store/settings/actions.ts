import Vue from 'vue'
import { Dexie } from 'dexie'
import { TextileError } from '../textile/types'
import { db } from '~/libraries/SatelliteDB/SatelliteDB'
import { UserInfoManager } from '~/libraries/Textile/UserManager'
import { SettingsError, SettingsState } from '~/store/settings/types'
import { ActionsArguments } from '~/types/store/store'
import { Config } from '~/config'

export default {
  async clearLocalStorage() {
    try {
      if (await Dexie.exists(Config.indexedDbName)) {
        await db.delete()
      }
      localStorage.clear()
    } catch (e) {
      console.log(e)
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
}
