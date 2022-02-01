<template src="./Settings.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

import { SettingsIcon, ChevronRightIcon } from 'satellite-lucide-icons'

import {
  Bitrates,
  SampleSizes,
} from '~/components/views/settings/pages/audio/options'

import {
  PermissionRequestOptions,
  UserPermissions,
} from '~/components/mixins/UserPermissions'

declare module 'vue/types/vue' {
  interface Vue {
    settings: any
    setupDefaults: () => void
    getUserPermissions: () => Promise<any>
    requestUserPermissions: (key: PermissionRequestOptions) => Promise<any>
  }
}
export default Vue.extend({
  components: {
    SettingsIcon,
    ChevronRightIcon,
  },
  data() {
    return {
      Bitrates,
      SampleSizes,
      menuOpen: false,
      audioInputs: [],
      audioOutputs: [],
      userHasGivenAudioAccess: false,
      userDeniedAudioAccess: false,
      browserAllowsAudioOut: true,
    }
  },
  computed: {
    ...mapState(['settings']),
    bitrate: {
      set(state) {
        this.$store.commit('settings/bitrate', state)
      },
      get() {
        return this.settings.bitrate
      },
    },
    sampleSize: {
      set(state) {
        this.$store.commit('settings/sampleSize', state)
      },
      get() {
        return this.settings.sampleSize
      },
    },
  },
  methods: {
    /**
     * @method toggleMenu DocsTODO
     * @description
     * @param event
     * @example
     */
    toggleMenu(event: Event): void {
      this.$data.menuOpen = !this.$data.menuOpen
      event.stopPropagation()
    },
    /**
     * @method hideMenu DocsTODO
     * @description
     * @param event
     * @example
     */
    hideMenu(event: Event): void {
      this.$data.menuOpen = !this.$data.menuOpen
      event.stopPropagation()
    },
    /**
     * @method switchMenuItem DocsTODO
     * @description
     * @param event
     * @example
     */
    switchMenuItem(event: Event): void {
      const menu = this.$refs.menu as HTMLElement
      const target = event.target as HTMLElement
      if (menu != null && menu.contains(target)) {
        const items = menu.querySelectorAll('.settings-item')
        let clickedHeader = null
        let clickedItem: any = null
        let clickedItemBody: any = null
        for (let i = 0, ni = items.length; i < ni; i++) {
          const item = items[i] as HTMLElement
          const itemHeader = item.querySelector('.item-header') as HTMLElement
          if (item.contains(target)) {
            clickedItem = item
            clickedItemBody = item.querySelector('.item-body') as HTMLElement
          }
          if (itemHeader.contains(target)) {
            clickedHeader = itemHeader
          }
        }
        if (
          clickedHeader != null &&
          clickedItem != null &&
          clickedItemBody != null
        ) {
          if (clickedItem.classList.contains('open')) {
            clickedItem.classList.remove('open')
            clickedItemBody.style.height = '0'
            clickedItemBody.style.overflow = 'hidden'
          } else {
            clickedItem.classList.add('open')
            clickedItemBody.style.height =
              (clickedItemBody.children[0] as HTMLElement).offsetHeight +
              2 +
              'px'
            clickedItemBody.addEventListener(
              'transitionend',
              (event: Event) => {
                const itemBody = event.target as HTMLElement
                if (
                  (itemBody.parentElement as HTMLElement).classList.contains(
                    'open',
                  )
                ) {
                  itemBody.style.overflow = 'visible'
                }
              },
              {
                once: true,
              },
            )
          }
          for (let i = 0, ni = items.length; i < ni; i++) {
            const item = items[i] as HTMLElement
            if (item !== clickedItem) {
              item.classList.remove('open')
              const itemBody = item.querySelector('.item-body') as HTMLElement
              itemBody.style.height = '0'
              itemBody.style.overflow = 'hidden'
            }
          }
        }
      }
    },
    ...UserPermissions.methods,
    /**
     * @method setupDefaults DocsTODO
     * @description
     * @example
     */
    async setupDefaults() {
      const permissionsObject: any = await this.getUserPermissions()
      // Toggles the show/hide on the button to request permissions
      this.$data.userHasGivenAudioAccess =
        permissionsObject.permissions.microphone

      if (permissionsObject.permissions.microphone) {
        // Get the arrays of devices formtted in the name/value format the select tool wants
        this.$data.audioInputs = permissionsObject.devices.audioIn
        this.$data.audioOutputs = permissionsObject.devices.audioOut

        // Setting defaults on mount if one isn't already present in local storage
        if (!this.settings.audioInput) {
          this.$store.commit(
            'audioInput',
            permissionsObject.devices.audioIn[0].value,
          )
        }
        if (!this.settings.audioOutput) {
          this.$store.commit(
            'audioOutput',
            permissionsObject.devices.audioOut[0].value,
          )
        }
      }

      if (permissionsObject.browser !== 'Chrome') {
        this.$data.browserAllowsAudioOut = false
      } else if (!this.settings.audioOutput) {
        this.$store.commit(
          'audioOutput',
          permissionsObject.devices.audioOut[0].value,
        )
      }
    },
    /**
     * @method enableAudio DocsTODO
     * @description
     * @example
     */
    async enableAudio() {
      // Check to see if the user has permission
      try {
        await this.requestUserPermissions({ audio: true })
        this.$data.userHasGivenAudioAccess = true
        this.setupDefaults()
      } catch (_: any) {
        // Error is returned if user selects Block/Deny
        this.$data.userDeniedAudioAccess = true
      }
    },
  },
})
</script>

<style lang="less" src="./Settings.less"></style>
