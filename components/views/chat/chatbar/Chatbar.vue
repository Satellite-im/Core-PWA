<template src="./Chatbar.html"></template>
<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { throttle } from 'lodash'
import { TerminalIcon } from 'satellite-lucide-icons'
import { parseCommand, commands } from '~/libraries/ui/Commands'
import {
  KeybindingEnum,
  MessagingTypesEnum,
  PropCommonEnum,
} from '~/libraries/Enums/enums'
import { Config } from '~/config'
import { ChatState, ChatText } from '~/store/chat/types'
import { RootState } from '~/types/store/store'
import iridium from '~/libraries/Iridium/IridiumManager'
import { SettingsRoutes } from '~/store/ui/types'
import { ChatbarUploadRef } from '~/components/views/chat/chatbar/upload/Upload.vue'
import { Conversation } from '~/libraries/Iridium/chat/types'

const Chatbar = Vue.extend({
  components: {
    TerminalIcon,
  },
  computed: {
    ...mapState({
      ui: (state: RootState) => state.ui,
      chat: (state: RootState) => state.chat as ChatState,
      files(state: RootState) {
        return state.chat.files?.[this.$route.params.id] ?? []
      },
    }),
    consentToScan(): boolean {
      return iridium.settings.state.privacy.consentToScan
    },
    /**
     * @method charlimit DocsTODO
     * @description Checks if current text is longer than the max character limit
     * @returns Boolean based on if the current text length is longer than the max character limit
     * @example
     */
    charlimit(): boolean {
      return this.text.length > this.$Config.chat.maxChars
    },
    /**
     * @method hasCommand DocsTODO
     * @description
     * @returns
     * @example
     */
    hasCommand(): boolean {
      const parsedCommand = parseCommand(this.ui.chatbarContent)
      const currentCommand = commands.find(
        (cmd) => cmd.name === parsedCommand.name.toLowerCase(),
      )
      // Hide commands for early access
      // return currentCommand != null
      return false
    },
    /**
     * @method hasCommandPreview DocsTODO
     * @description
     * @returns
     * @example
     */
    commandPreview(): boolean {
      // Hide commands for early access
      // return hasCommandPreview(this.ui.chatbarContent)
      return false
    },
    /**
     * @method isValidCommand DocsTODO
     * @description
     * @returns
     * @example
     */
    isValidCommand(): boolean {
      const currentText = parseCommand(
        this.ui.chatbarContent,
      ).name.toLowerCase()
      const currentArgs = parseCommand(this.ui.chatbarContent).args
      const currentCommand = commands.find((c) => c.name === currentText)
      // Hide commands for early access
      // return currentCommand && isArgsValid(currentCommand, currentArgs)
      return false
    },
    isSharpCorners(): boolean {
      return (
        Boolean(this.files.length) ||
        Boolean(this.ui.replyChatbarContent.id) ||
        this.commandPreview ||
        this.chat.countError
      )
    },
    text: {
      /**
       * @method get
       * @description Gets chatbars current text
       * @returns String of chatbars current text
       * @example const currText = this.get()
       */
      get(): string {
        return this.ui.chatbarContent
      },
      /**
       * @method set
       * @description Sets current chatbar text to new value
       * @param val Value to set the chatbar content to
       * @example set('This is the new chatbar content')
       */
      set(value: string) {
        this.$store.dispatch('ui/setChatbarContent', {
          content: value,
          // userId: this.recipient?.did,
        })
        this.$store.commit('chat/setDraftMessage', {
          conversationId: this.conversationId,
          message: value,
        })
      },
    },
    conversationId(): Conversation['id'] {
      return this.$route.params.id
    },
    placeholder(): string {
      return !this.hasCommand && this.text === ''
        ? (this.$t('ui.talk') as string)
        : ''
    },
  },
  watch: {
    conversationId: {
      handler(value) {
        const message = this.chat.draftMessages[this.conversationId]
        this.$refs.editable?.resetHistory()
        this.$store.commit('ui/setReplyChatbarContent', {
          id: '',
          payload: '',
          from: '',
        })
        this.$store.dispatch('ui/setChatbarContent', { content: message })
        // in desktop, stay chatbar focused when switching recipient
        if (this.$device.isDesktop) {
          this.$store.dispatch('ui/setChatbarFocus')
        }
      },
    },
  },
  methods: {
    /**
     * @method blurChatbar
     * @description blur chatbar
     */
    blurChatbar() {
      document.activeElement?.blur()
    },
    /**
     * @method throttleTyping
     * @description Throttles the typing event so that we only send the typing once every two seconds
     */
    throttleTyping: throttle(function (ctx) {
      ctx.$store.dispatch('webrtc/sendTyping')
    }, Config.chat.typingInputThrottle),
    /**
     * @method smartTypingStart
     * @description Let's us send out events when a user starts typing without spam.
     */
    smartTypingStart() {
      this.throttleTyping(this)
    },
    /**
     * @method handleInputKeydown DocsTODO
     * @description Called from chatbar's keydown event to process all key events for typing in chatbar.
     * This interacts with handleInputChange in order to convert typed input to markdown expression.
     * This controls the caret position when Backspace, Spacebar is pressed.
     * @param event Keydown event object
     * @returns Boolean
     * @example
     */
    handleInputKeydown(event: KeyboardEvent) {
      switch (event.key) {
        case KeybindingEnum.ENTER:
          if (!event.shiftKey) {
            event.preventDefault()
            if (!this.hasCommand) {
              return this.sendMessage()
            }
            if (this.hasCommand && !this.isValidCommand) {
              this.$Logger.log('Commands', 'dispatch command')
              return
            }
            return
          }
          // If there is a command disable shift + enter
          if (this.hasCommand) {
            event.preventDefault()
          }
          break
        default:
          break
      }
      this.smartTypingStart()
    },
    /**
     * @method sendMessage
     * @description Sends message by calling the sendMessage action with current data and
     * then setting all related fields to their default (empty)
     * @example v-on:click="sendMessage"
     */
    async sendMessage() {
      // set id in case recipient changes during send
      const conversationId = this.$route.params.id
      // if there are any files attached to this chat, send
      // await this.sendFiles()
      // return if input is empty or over max length
      if (
        this.text.length > this.$Config.chat.maxChars ||
        !this.text.trim().length
      ) {
        return
      }
      const value = this.text
      this.text = ''
      // we should be looking into conversation instead of passing a recipient
      await iridium.chat?.sendMessage({
        conversationId,
        type: 'text',
        body: value,
        at: Date.now(),
        attachments: [],
      })
      // if (
      //   this.ui.replyChatbarContent.from &&
      //   !RegExp(this.$Config.regex.uuidv4).test((this.recipient as Group)?.did)
      // ) {
      //   this.$store.dispatch('textile/sendReplyMessage', {
      //     to: (recipient as Friend).textilePubkey,
      //     text: value,
      //     replyTo: this.ui.replyChatbarContent.messageID,
      //     replyType: MessagingTypesEnum.TEXT,
      //   })
      //   return
      // }

      // if (
      //   RegExp(this.$Config.regex.uuidv4).test(
      //     (this.recipient as Group)?.did?.split('|')[1],
      //   )
      // ) {
      //   if (this.ui.replyChatbarContent.from) {
      //     this.$store.dispatch('textile/sendGroupReplyMessage', {
      //       to: (recipient as Group).id,
      //       text: value,
      //       replyTo: this.ui.replyChatbarContent.messageID,
      //       replyType: MessagingTypesEnum.TEXT,
      //     })
      //     this.text = ''
      //     return
      //   }
      //   this.$store.dispatch('textile/sendGroupMessage', {
      //     groupId: (recipient as Group).id,
      //     message: value,
      //   })
      // } else {
      //   // this.$store.dispatch('textile/sendTextMessage', {
      //   //   to: (this.recipient as Friend).textilePubkey,
      //   //   text: value,
      //   // })
      // }
    },
    /**
     * @method handlePaste
     * @description Allows the pasting of files into the chatbar
     * @param e Paste event data object
     * @example v-on:paste="handlePaste"
     */
    handlePaste(e: ClipboardEvent) {
      e.stopPropagation()
      if (!e.clipboardData?.items) {
        return
      }

      this.handleUpload([...e.clipboardData.items])
    },
    /**
     * @method handleUpload
     * @description if event has files attached
     * @param items Array of objects
     * @example this.handleUpload(someEvent.itsData.items)
     */
    handleUpload(items: DataTransferItem[]) {
      const files = items
        .filter((f) => {
          return f.kind !== MessagingTypesEnum.STRING
        })
        .map((f) => f.getAsFile())

      if (files.length && this.$refs.upload) {
        ;(this.$refs.upload as ChatbarUploadRef).handleFile({
          target: { files },
        })
      }
    },
    handleChatTextFromOutside(text: string) {
      this.$refs.editable?.handleTextFromOutside(text)
    },
    /**
     * @method sendFiles
     * @description Sends action to Upload the file to textile.
     */
    async sendFiles() {
      // set id in case recipient changes during send
      const conversationId = this.$route.params.id
      // send files logic
      document.body.style.cursor = PropCommonEnum.DEFAULT
      this.$store.commit('chat/deleteFiles', conversationId)
    },
  },
})
export type ChatbarRef = InstanceType<typeof Chatbar>
export default Chatbar
</script>
<style scoped lang="less" src="./Chatbar.less"></style>
