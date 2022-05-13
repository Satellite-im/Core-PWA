<template src="./Rename.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'
import { SaveIcon } from 'satellite-lucide-icons'
import { RootState } from '~/types/store/store'
import { Directory } from '~/libraries/Files/Directory'

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
      currentName: '' as string,
      parent: null as Directory | null,
      error: '' as string,
    }
  },
  computed: {
    ...mapState({
      renameItem: (state) => (state as RootState).ui.renameItem,
    }),
    ...mapGetters('ui', ['isFilesIndexLoading']),
  },
  mounted() {
    if (!this.renameItem) {
      this.error = this.$t('pages.files.errors.lost') as string
      return
    }
    // extract data we need from store and then clear to avoid vuex outside mutation error
    this.text = this.renameItem.name
    this.currentName = this.renameItem.name
    this.parent = this.renameItem.parent
    this.$store.commit('ui/setRenameItem', undefined)
    this.$nextTick(() => {
      // extension string including .
      const extString = this.text.slice(
        ((this.text.lastIndexOf('.') - 1) >>> 0) + 1,
      )
      const input = this.$refs.inputGroup.$refs.input as HTMLInputElement
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
     * @method rename
     * @description attempt to rename child. Update textile files index if successful
     */
    async rename() {
      try {
        this.$FileSystem.renameChild(this.currentName, this.text, this.parent)
      } catch (e: any) {
        this.error = this.$t(e?.message) as string
        return
      }
      this.closeModal()
      this.$store.commit(
        'ui/setFilesUploadStatus',
        this.$t('pages.files.status.index'),
      )
      await this.$TextileManager.bucket?.updateIndex(this.$FileSystem.export)
      this.$store.commit('ui/setFilesUploadStatus', '')
    },
  },
})
</script>

<style scoped lang="less" src="./Rename.less"></style>
