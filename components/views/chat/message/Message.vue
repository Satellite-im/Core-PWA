<template src="./Message.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState, mapGetters } from 'vuex'

import { ArchiveIcon } from 'satellite-lucide-icons'
import ContextMenu from '~/components/mixins/UI/ContextMenu'
import { UIMessage, Group } from '~/types/messaging'

import { toHTML } from '~/libraries/ui/Markdown'
import { ContextMenuItem, EmojiUsage, ModalWindows } from '~/store/ui/types'
import { isMimeEmbeddableImage } from '~/utilities/FileType'
import { FILE_TYPE } from '~/libraries/Files/types/file'
import placeholderImage from '~/assets/svg/mascot/sad_curious.svg'
import { RootState } from '~/types/store/store'

export default Vue.extend({
  components: {
    ArchiveIcon,
  },
  mixins: [ContextMenu],
  props: {
    message: {
      type: Object as PropType<UIMessage>,
      default: () => ({
        id: '0',
        at: 1620515543000,
        type: 'text',
        payload: 'Invalid Message',
      }),
    },
    group: {
      type: Object as PropType<Group>,
      default: () => {},
    },
    from: {
      type: String,
      default: '',
    },
    index: {
      type: Number,
      default: -1,
    },
    hideActions: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      blob: undefined as Blob | undefined,
      pngBlob: undefined as Blob | undefined,
    }
  },
  computed: {
    ...mapState({
      ui: (state) => (state as RootState).ui,
      textile: (state) => (state as RootState).textile,
      accounts: (state) => (state as RootState).accounts,
    }),
    ...mapGetters({
      findFriendByAddress: 'friends/findFriendByAddress',
      getFiles: 'chat/getFiles',
      isGroup: 'conversation/isGroup',
    }),
    hasReactions(): boolean {
      return this.message.reactions && this.message.reactions.length
    },
    messageEdit(): boolean {
      return this.ui.editMessage.id === this.message.id
    },
    contextMenuValues(): ContextMenuItem[] {
      const mainList = [
        { text: 'quickReaction', func: this.quickReaction },
        { text: this.$t('context.reaction'), func: this.emojiReaction },
        { text: this.$t('context.reply'), func: this.setReplyChatbarContent },
        // AP-1120 copy link functionality
        // { text: this.$t('context.copy_link'), func: (this as any).testFunc },
      ]
      if (this.message.type === 'text') {
        // if your own text message
        if (this.accounts.details?.textilePubkey === this.message.from) {
          return [
            ...mainList,
            { text: this.$t('context.copy_msg'), func: this.copyMessage },
            // { text: this.$t('context.edit'), func: this.editMessage },
            // skipped due to edit message is now coming soon and this shouldn't appear on context menu
          ]
        }
        // another persons text message
        return [
          ...mainList,
          { text: this.$t('context.copy_msg'), func: this.copyMessage },
        ]
      }
      // if image message
      if (
        this.message.type === 'file' &&
        isMimeEmbeddableImage(this.message.payload.type)
      ) {
        // remove copy from GIF because it copies a still png version
        if (this.message.payload.type === FILE_TYPE.GIF) {
          return [
            ...mainList,
            { text: this.$t('context.save_img'), func: this.saveImage },
          ]
        }
        return [
          ...mainList,
          { text: this.$t('context.copy_img'), func: this.copyImage },
          { text: this.$t('context.save_img'), func: this.saveImage },
        ]
      }
      return mainList
    },
  },
  beforeDestroy() {
    this.cancelMessage()
  },
  async mounted() {
    if (!this.message.payload?.url) {
      return
    }
    try {
      this.blob = await this.getImageBlob(this.message.payload?.url)
    } catch (error: any) {
      this.blob = await this.getImageBlob(placeholderImage)
      this.$Logger.log('error', error.message)
    }
  },
  methods: {
    /**
     * @method markdownToHtml
     * @description convert text markdown to html
     * @param str String to convert
     */
    markdownToHtml(text: string) {
      return toHTML(text, { liveTyping: false })
    },
    /**
     * @method wrapEmoji
     * @description Wraps emojis in spans with the emoji class
     * @param str String to wrap emojis within
     */
    wrapEmoji(str: string): string {
      return str.replace(
        this.$Config.regex.emojiWrapper,
        (emoji) => `<span class="emoji">${emoji}</span>`,
      )
    },
    /**
     * @method containsOnlyEmoji
     * @description Check whether or not a string only contains an emoji
     * @param str String to check against
     */
    containsOnlyEmoji(str: string): boolean {
      return str.match(this.$Config.regex.isEmoji) !== null
    },
    /**
     * @method copyMessage
     * @description copy contents of message. Will only be called if text message
     */
    copyMessage() {
      navigator.clipboard.writeText(this.message.payload)
    },
    /**
     * @method copyImage
     * @description clipboard API only accepts png. if not png, convert via canvas
     */
    async copyImage() {
      if (this.blob?.type !== 'image/png') {
        this.pngBlob = await this.toPng()
      }
      await navigator.clipboard.write([
        new ClipboardItem({
          'image/png': this.pngBlob || this.blob,
        }),
      ])
      this.$toast.show(this.$t('ui.copied') as string)
    },
    saveImage() {
      this.$TextileManager.sharedBucket?.pullFile(
        this.message.payload.id,
        this.message.payload.name,
        this.message.payload.size,
      )
    },
    /**
     * @method toPng
     * @param {Blob} blob embeddable image blob
     * @description helper function - convert image blob to png for Clipboard API
     */
    toPng() {
      return new Promise<Blob>((resolve) => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const img = new Image()
        img.src = URL.createObjectURL(this.blob as Blob)
        img.onload = () => {
          canvas.width = img.naturalWidth
          canvas.height = img.naturalHeight
          ctx?.drawImage(img, 0, 0)
          canvas.toBlob((newBlob: Blob) => {
            resolve(newBlob)
          })
          URL.revokeObjectURL(img.src)
        }
      })
    },
    /**
     * @method setReplyChatbarContent DocsTODO
     * @description
     * @example
     */
    setReplyChatbarContent() {
      if (this.isGroup) {
        this.toggleModal(ModalWindows.CALL_TO_ACTION)
        return
      }
      const myTextilePublicKey = this.$TextileManager.getIdentityPublicKey()
      const { id, type, payload, to, from } = this.message
      let finalPayload = payload
      if (['image', 'video', 'audio', 'file'].includes(type)) {
        finalPayload = `*${this.$t('conversation.multimedia')}*`
      } else if (type === 'glyph') {
        finalPayload = `<img src=${payload} width='16px' height='16px' />`
      }
      this.$store.commit('ui/setReplyChatbarContent', {
        id,
        payload: finalPayload,
        from: this.from,
        messageID: this.message.id,
        to: to === myTextilePublicKey ? from : to,
      })
      this.$nextTick(() => this.$store.dispatch('ui/setChatbarFocus'))
    },
    /**
     * @method emojiReaction DocsTODO
     * @description
     * @example
     */
    emojiReaction(e: MouseEvent) {
      if (this.isGroup) {
        this.toggleModal(ModalWindows.CALL_TO_ACTION)
        return
      }
      const myTextilePublicKey = this.$TextileManager.getIdentityPublicKey()
      this.$store.commit('ui/settingReaction', {
        status: true,
        groupID: this.group.id,
        messageID: this.message.id,
        to:
          this.message.to === myTextilePublicKey
            ? this.message.from
            : this.message.to,
      })
      this.$store.commit('ui/toggleEnhancers', {
        show: !this.ui.enhancers.show,
        floating: true,
      })
    },
    quickReaction(emoji: EmojiUsage) {
      this.$store.dispatch('textile/sendReactionMessage', {
        to: this.message.to,
        emoji: emoji.content,
        reactTo: this.message.id,
      })
    },
    /**
     * Called when click the "Edit Message" on context menu
     * Commit store mutation in order to notify the edit status
     */
    editMessage() {
      const { id, payload, type, from } = this.message
      if (type === 'text' && from === this.accounts.details?.textilePubkey) {
        this.$store.commit('ui/setEditMessage', {
          id,
          payload,
          from: this.group.id,
        })
      }
    },
    /**
     * Called from MessageEdit component when complete to edit message
     * Called from MessageEdit component with changed message When save or cancel / Enter or Escape is pressed
     */
    saveMessage(message: string) {
      this.$store.commit('ui/setEditMessage', {
        id: '',
        payload: message,
        from: this.group.id,
      })
      this.$store.commit('ui/saveEditMessage', {
        id: this.message.id,
        payload: message,
        from: this.group.id,
      })

      if (message !== this.message.payload) {
        const { address } = this.$route.params
        const recipient = this.findFriendByAddress(address)

        if (!recipient) {
          this.$store.dispatch('textile/editTextMessage', {
            to: this.$store.state.friends.activeConversation.target
              .textilePubkey,
            original: this.message,
            text: message,
          })
        }
        this.$store.dispatch('textile/editTextMessage', {
          to: recipient?.textilePubkey,
          original: this.message,
          text: message,
        })
      }
    },
    cancelMessage() {
      this.$store.commit('ui/setEditMessage', {
        id: '',
        payload: '',
        from: this.group.id,
      })

      this.$store.commit('ui/saveEditMessage', {
        id: this.message.id,
        payload: 'message',
        from: this.group.id,
      })
    },
    async getImageBlob(imageSrc: string) {
      if (!imageSrc) {
        return
      }

      const response = await fetch(imageSrc)

      if (!response.ok) {
        throw new Error(this.$t('errors.chat.failed_load') as string)
      }

      return response.blob()
    },
    toggleModal(modalName: ModalWindows) {
      this.$store.commit('ui/toggleModal', {
        name: modalName,
        state: !this.ui.modals[modalName],
      })
    },
  },
})
</script>
<style lang="less" src="./Message.less"></style>
