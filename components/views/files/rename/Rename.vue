<template src="./Rename.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { SaveIcon } from 'satellite-lucide-icons'
import { RootState } from '~/types/store/store'
import iridium from '~/libraries/Iridium/IridiumManager'
import { IridiumItem } from '~/libraries/Iridium/files/types'

export default Vue.extend({
  components: {
    SaveIcon,
  },
  props: {
    closeModal: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      text: '' as string,
      error: '' as string,
      item: undefined as IridiumItem | undefined,
    }
  },
  computed: {
    ...mapState({
      rename: (state) => (state as RootState).files.rename,
    }),
  },
  mounted() {
    if (!this.rename) {
      this.error = this.$t('pages.files.errors.lost') as string
      return
    }
    // extract data we need from store and then clear to avoid vuex outside mutation error
    this.item = this.rename
    this.$store.commit('files/setRename', undefined)

    this.text = this.item.name
    this.$nextTick(() => {
      // extension string including .
      const extString = this.text.slice(
        ((this.text.lastIndexOf('.') - 1) >>> 0) + 1,
      )
      const input = (this.$refs.inputGroup as Vue).$refs
        .input as HTMLInputElement
      // if file extension is found, highlight everything except the [.ext]
      if (extString) {
        input.focus()
        input.setSelectionRange(0, this.text.length - extString.length)
        return
      }
      input.select()
    })
  },
  methods: {
    /**
     * @description attempt to rename item, catch name errors
     */
    renameItem() {
      if (!this.item) {
        return
      }
      try {
        iridium.files?.updateItem({
          item: this.item,
          name: this.text,
        })
      } catch (e: any) {
        this.error = this.$t(e?.message) as string
        return
      }
      this.closeModal()
    },
  },
})
</script>

<style scoped lang="less" src="./Rename.less"></style>
