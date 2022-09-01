<template src="./Profile.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

import {
  EditIcon,
  UserIcon,
  AlignLeftIcon,
  LaptopIcon,
  InfoIcon,
} from 'satellite-lucide-icons'
import { sampleProfileInfo } from '~/mock/profile'
import { RootState } from '~/types/store/store'
import iridium from '~/libraries/Iridium/IridiumManager'
import { User } from '~/libraries/Iridium/users/types'

type Editables = 'about'

export default Vue.extend({
  components: {
    EditIcon,
    UserIcon,
    AlignLeftIcon,
    LaptopIcon,
    InfoIcon,
  },
  layout: 'settings',
  data() {
    return {
      image: '',
      croppedImage: '',
      showCropper: false,
      loading: new Set() as Set<keyof User>,
      editing: new Set() as Set<Editables>,
      inputs: {
        name: iridium.profile.state?.name ?? '',
        photoHash: iridium.profile.state?.photoHash ?? '',
        status: iridium.profile.state?.status ?? '',
        about: iridium.profile.state?.about ?? '',
        accountUrl: '',
      } as Partial<User>,
    }
  },
  computed: {
    ...mapState({
      accounts: (state) => (state as RootState).accounts,
      ui: (state) => (state as RootState).ui,
    }),
    sampleProfileInfo: () => sampleProfileInfo,
    isSmallScreen(): boolean {
      // @ts-ignore
      return this.$mq === 'sm' || (this.ui.settingsSideBar && this.$mq === 'md')
    },
    src(): string {
      if (this.croppedImage) {
        return this.croppedImage
      }
      const hash = iridium.profile.state?.photoHash
      return hash ? `${this.$Config.ipfs.gateway}${hash}` : ''
    },
    imageInputRef(): HTMLInputElement {
      return (this.$refs.imageInput as Vue).$refs.imageInput as HTMLInputElement
    },
    profile(): User | undefined {
      return iridium.profile.state
    },
    aboutChanged(): boolean {
      return this.inputs.about !== this.profile?.about
    },
  },
  beforeDestroy() {
    URL.revokeObjectURL(this.croppedImage)
    URL.revokeObjectURL(this.image)
  },
  methods: {
    /**
     * @method toggleCropper DocsTODO
     * @description
     * @example
     */
    toggleCropper() {
      this.showCropper = !this.showCropper
    },
    /**
     * @method openFileDialog DocsTODO
     * @description
     * @example
     */
    openFileDialog() {
      this.imageInputRef.click()
    },
    /**
     * @method setCroppedImage DocsTODO
     * @description
     * @param image
     * @example
     */
    setCroppedImage(image: Blob) {
      this.croppedImage = URL.createObjectURL(image)
      this.imageInputRef.value = ''
      const img = new Image()
      img.src = this.croppedImage
      // TODO: Save image with iridium
      // Note: This was used for Solana implementation
      // this.$store.dispatch('accounts/updateProfilePhoto', image)
    },
    /**
     * @method selectProfileImage DocsTODO
     * @description
     * @param e
     * @returns
     * @example
     */
    selectProfileImage(e: Event) {
      const target = e.target as HTMLInputElement
      const file = target.files?.[0]

      if (file) {
        this.image = URL.createObjectURL(file)
        this.toggleCropper()
      }
    },
    /**
     * @method updateUserDetail
     * @description Updates user details
     * @example this.updateUserDetail('name', 'John Doe')
     */
    async updateUserDetail(e: SubmitEvent, key: keyof User, value: string) {
      e.stopPropagation()
      e.preventDefault()

      try {
        this.loading.add(key)
        await iridium.profile.updateUser({
          [key]: value.trim(),
        })
        const inputs = this.inputs as { [key in keyof User]: string }
        inputs[key] = value.trim()
        this.$toast.show(
          this.$t('pages.settings.profile.detail_updated') as string,
        )
      } catch (e: any) {
        this.$toast.error(this.$t(e.message) as string)
      } finally {
        this.loading.delete(key)
        // Note: For Vue 2 reactivity
        this.loading = new Set(...this.loading.entries())
      }
    },
    /**
     * @method toggleEditing
     * @description Toggles editing state of a field
     * @example this.toggleEditing('name')
     */
    toggleEditing(key: Editables) {
      if (this.editing.has(key)) {
        this.editing.delete(key)
        // Note: For Vue 2 reactivity
        this.editing = new Set(...this.editing.entries())
      } else {
        this.editing.add(key)
        // Note: For Vue 2 reactivity
        this.editing = new Set(...this.editing.entries())
      }
    },
    /**
     * @method submitEdit
     * @description Updates input value
     * @example this.submitEdit('name', 'John Doe')
     */
    submitEdit(e: SubmitEvent) {
      e.stopPropagation()
      e.preventDefault()
      const about = this.inputs.about || ''
      if (this.editing.has('about') && this.aboutChanged) {
        this.updateUserDetail(e, 'about', about)
      }
      this.toggleEditing('about')
    },
    /**
     * @method getEditButtonText
     * @description Returns the label for the edit button
     * @example this.getEditLabel('about')
     */
    getEditButtonText(key: Editables) {
      if (this.editing.has(key)) {
        return this.$t('global.save') as string
      }
      return this.$t('global.edit') as string
    },
  },
})
</script>

<style scoped lang="less" src="./Profile.less"></style>
