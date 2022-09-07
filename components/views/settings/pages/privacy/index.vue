<template src="./Privacy.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'
import { TranslateResult } from 'vue-i18n'
import { validURL } from '~/libraries/ui/Common'
import { RootState } from '~/types/store/store'
import iridium from '~/libraries/Iridium/IridiumManager'

type PermissionObject = { name: string; state: string }

export default Vue.extend({
  name: 'PrivacySettings',
  layout: 'settings',
  data() {
    return {
      formatError: false as boolean,
      lengthError: false as boolean,
      loading: [] as string[],
      privacySettings: iridium.settings.state.privacy,
      permissions: [] as PermissionObject[],
    }
  },
  computed: {
    ...mapState({
      ui: (state) => (state as RootState).ui,
      accounts: (state) => (state as RootState).accounts,
      settings: (state) => (state as RootState).settings,
      userThread: (state) => (state as RootState).textile.userThread,
    }),
    ...mapGetters('textile', ['getInitialized']),
    embeddedLinks: {
      set(state: boolean) {
        iridium.settings.set('/privacy/embeddedLinks', state)
      },
      get(): boolean {
        return this.privacySettings.embeddedLinks
      },
    },
    consentScan: {
      async set(consentToScan: boolean) {
        this.loading.push('consentScan')
        await iridium.settings.set('/privacy/consentToScan', consentToScan)
        this.loading.splice(this.loading.indexOf('consentScan'), 1)
      },
      get(): boolean {
        return this.privacySettings.consentToScan
      },
    },
    blockNsfw: {
      async set(blockNsfw: boolean) {
        this.loading.push('blockNsfw')
        await iridium.settings.set('/privacy/blockNsfw', blockNsfw)
        this.loading.splice(this.loading.indexOf('blockNsfw'), 1)
      },
      get(): boolean {
        return this.privacySettings.blockNsfw
      },
    },
    registry: {
      get(): boolean {
        return !this.accounts ? false : this.accounts.registry
      },
    },
    storePin: {
      set(state: boolean) {
        this.$store.commit('accounts/setStorePin', state)
      },
      get(): boolean {
        return !this.accounts ? false : this.accounts.storePin
      },
    },
    displayCurrentActivity: {
      set(state: boolean) {
        iridium.settings.set('/privacy/displayCurrentActivity', state)
      },
      get(): boolean {
        return this.privacySettings.displayCurrentActivity
      },
    },
    serverTypes(): { text: TranslateResult; value: string }[] {
      return [
        {
          text: this.$t('pages.privacy.ownInfo.satelliteServer'),
          value: 'satellite',
        },
        {
          text: this.$t('pages.privacy.ownInfo.publicServer'),
          value: 'public',
        },
      ]
    },
    serverType: {
      set(state) {
        this.$store.commit('settings/setServerType', state)
      },
      get(): string {
        return this.settings.serverType
      },
    },
    ownInfo: {
      set(state: string) {
        if (validURL(state) && state.length < this.$Config.chat.maxChars + 1) {
          this.formatError = false
          this.lengthError = false
          this.$store.commit('settings/setOwnInfo', state)
          return
        }
        if (state.length > this.$Config.chat.maxChars) {
          this.lengthError = true
        }
        if (!validURL(state)) {
          this.formatError = true
        }
      },
      get(): string {
        return this.settings.ownInfo
      },
    },
  },
  mounted() {
    this.checkBrowserPermissions()
  },
  methods: {
    checkBrowserPermissions() {
      const permissionCheck = ['notifications', 'microphone', 'camera']
      permissionCheck.forEach((permName) =>
        navigator.permissions.query({ name: permName }).then((result) => {
          result.onchange = (e) => {
            this.updatePermissionState(permName, e.currentTarget.state)
          }
          this.permissions.push({ name: permName, state: result.state })
        }),
      )
    },
    getPermissionState(name: string) {
      return (
        this.permissions.find((perm) => perm?.name === name)?.state || 'loading'
      )
    },
    updatePermissionState(permName: string, newState: string) {
      const targetElement = this.permissions.find(
        (perm) => perm.name === permName,
      )

      if (targetElement) {
        this.permissions.splice(this.permissions.indexOf(targetElement), 1, {
          name: permName,
          state: newState,
        })
        return
      }
      this.permissions.push({ name: permName, state: newState })
    },
    async handlePermission(permName: string) {
      this.loading.push(permName)
      navigator.permissions.query({ name: permName }).then(async (result) => {
        if (result.state === 'granted' || result.state === 'denied') {
          this.loading.splice(this.loading.indexOf(permName), 1)
          return
        }

        await this.askPermission(permName)
        this.loading.splice(this.loading.indexOf(permName), 1)
      })
    },
    async askPermission(permName: string) {
      if (permName === 'notifications') {
        await iridium.notifications.askPermissions()
        return
      }

      try {
        let stream
        /*  
       // delete the comment to toggle screensharing, 
       // NOTE: this permission doesn't exist on browsers
       if (permName === 'screen') {
          stream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
          })
        } */
        if (permName === 'microphone' || permName === 'camera') {
          stream = await navigator.mediaDevices.getUserMedia({
            [permName === 'microphone' ? 'audio' : 'video']: true,
          })
        }
        const tracks = stream?.getTracks()
        tracks?.forEach((track) => {
          track?.stop()
        })
      } catch (e) {
        console.log(e)
      }
    },
  },
})
</script>

<style lang="less" scoped src="./Privacy.less"></style>
