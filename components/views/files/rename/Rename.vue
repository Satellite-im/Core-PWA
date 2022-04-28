<template src="./Rename.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'
import { SaveIcon } from 'satellite-lucide-icons'

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
    }
  },
  computed: {
    ...mapState(['ui']),
    ...mapGetters('ui', ['isFilesIndexLoading']),
  },
  mounted() {
    this.text = this.ui.renameCurrentName
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
        this.$FileSystem.renameChild(this.ui.renameCurrentName, this.text)
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
