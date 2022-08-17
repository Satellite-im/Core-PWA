<template src="./Message.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState, mapGetters } from 'vuex'
import { ArchiveIcon } from 'satellite-lucide-icons'
import { toHTML } from '~/libraries/ui/Markdown'
import { ContextMenuItem, EmojiUsage, ModalWindows } from '~/store/ui/types'
import { isMimeEmbeddableImage } from '~/utilities/FileType'
import { FILE_TYPE } from '~/libraries/Files/types/file'
import placeholderImage from '~/assets/svg/mascot/sad_curious.svg'
import { RootState } from '~/types/store/store'
import {
  Conversation,
  ConversationMessage,
} from '~/libraries/Iridium/chat/types'
import { User } from '~/libraries/Iridium/types'
import iridium from '~/libraries/Iridium/IridiumManager'

export default Vue.extend({
  components: {
    ArchiveIcon,
  },
  props: {
    message: {
      type: Object as PropType<ConversationMessage>,
      required: true,
    },
    replies: {
      type: Array as PropType<ConversationMessage[]>,
      default: [] as ConversationMessage[],
    },
    showHeader: {
      type: Boolean,
      default: false,
    },
    hideReplyAction: {
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
      chat: (state) => (state as RootState).chat,
      textile: (state) => (state as RootState).textile,
      accounts: (state) => (state as RootState).accounts,
    }),
    ...mapGetters({
      findFriendByAddress: 'friends/findFriendByAddress',
      getFiles: 'chat/getFiles',
      getTimestamp: 'settings/getTimestamp',
    }),
    conversationId(): Conversation['id'] {
      return this.$route.params.id
    },
    author(): User {
      // TODO: access User from iridium via did
      return {
        id: this.message.from,
        name: 'test',
      } as User
      // if (this.message.did === iridium.profile.state.
      // if (this.conversation.type === 'direct') {
      //   const friendDid = this.conversation.participants.find(
      //     (f) => f !== iridium.connector?.id,
      //   )
      //   return this.friends.find((f) => f.did === friendDid)
      // }
      // return this.groups[this.conversation.id]
    },
    isReplyingTo(): boolean {
      return (
        this.chat.replyChatbarMessages[this.conversationId]?.id ===
        this.message.id
      )
    },
    timestamp(): string {
      return this.getTimestamp({ time: this.message.at })
    },
    hasReactions(): boolean {
      return false // this.message.reactions && this.message.reactions.length
    },
    isEditing(): boolean {
      return this.ui.editMessage.id === this.message.id
    },
    contextMenuValues(): ContextMenuItem[] {
      const mainList = [
        { text: 'quickReaction', func: this.quickReaction },
        { text: this.$t('context.reaction'), func: this.emojiReaction },
        { text: this.$t('context.reply'), func: this.setReplyChatbarMessage },
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
    // this.cancelMessage()
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
     * @method showQuickProfile
     * @description Shows quickprofile component for user by setting quickProfile to true in state and setQuickProfilePosition
     * to the current group components click event data
     * @param e Event object from group component click
     * @example v-on:click="showQuickProfile"
     */
    showQuickProfile(e: MouseEvent) {
      const openQuickProfile = () => {
        this.$store.dispatch('ui/showQuickProfile', {
          textilePublicKey: this.group.from,
          position: { x: e.x, y: e.y },
        })
      }

      if (!this.ui.quickProfile) {
        openQuickProfile()
        return
      }
      setTimeout(() => {
        if (!this.ui.quickProfile) {
          openQuickProfile()
        }
      }, 0)
    },
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
      // TODO: Send pin encrypted message to local IPFS and share with sync node
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
    setReplyChatbarMessage() {
      this.$store.commit('chat/setReplyChatbarMessage', {
        conversationId: this.message.conversationId,
        message: this.message,
      })
      this.$nextTick(() => this.$store.dispatch('ui/setChatbarFocus'))
    },
    /**
     * @method emojiReaction DocsTODO
     * @description
     * @example
     */
    emojiReaction(e: MouseEvent) {
      this.$store.commit('ui/settingReaction', {
        status: true,
        conversationId: this.message.conversationId,
        messageId: this.message.id,
      })
      this.$store.commit('ui/toggleEnhancers', {
        show: !this.ui.enhancers.show,
        floating: true,
      })
    },
    quickReaction(emoji: EmojiUsage) {
      iridium.chat.toggleMessageReaction({
        conversationId: this.message.conversationId,
        messageId: this.message.id,
        reaction: emoji.content,
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
