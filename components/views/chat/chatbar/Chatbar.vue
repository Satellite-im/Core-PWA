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
import { ChatbarUploadRef } from '~/components/views/chat/chatbar/upload/Upload.vue'
import { User } from '~/libraries/Iridium/friends/types'
import Group from '~/libraries/Iridium/groups/Group'
import {
  Conversation,
  ConversationMessagePayload,
} from '~/libraries/Iridium/chat/types'

const Chatbar = Vue.extend({
  components: {
    TerminalIcon,
  },
  data() {
    return {
      friends: iridium.friends,
      groups: iridium.groups.state,
      webrtc: iridium.webRTC,
    }
  },
  computed: {
    ...mapState({
      ui: (state: RootState) => state.ui,
      chat: (state: RootState) => state.chat,
      files(state: RootState) {
        return state.chat.files?.[this.$route.params.id] ?? []
      },
    }),
    conversation(): Conversation {
      return iridium.chat.state.conversations[this.$route.params.id]
    },
    isGroup(): boolean {
      return this.conversation.type === 'group'
    },
    recipient(): User | Group | undefined {
      if (this.isGroup) {
        return this.groups[this.conversation.id]
      }
      const participant = this.conversation.participants.find(
        (f) => f.did !== iridium.connector?.id,
      )
      if (!participant) {
        return
      }
      return Object.values(this.friends.state.details).find(
        (f) => f.did === participant.did,
      )
    },
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
        Boolean(this.chat.replyChatbarMessages[this.conversationId]) ||
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
  mounted() {
    const message = this.chat.draftMessages[this.conversationId] ?? ''
    this.$store.commit('chat/clearReplyChatbarMessage', {
      conversationId: this.conversationId,
    })
    this.$store.dispatch('ui/setChatbarContent', { content: message })
    if (this.$device.isDesktop) {
      this.$store.dispatch('ui/setChatbarFocus')
    }
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
      this.webrtc.sendTyping({ did: this.recipient.did })
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

      const payload: ConversationMessagePayload = {
        conversationId,
        type: 'text',
        body: value,
        at: Date.now(),
      }

      if (this.chat.replyChatbarMessages[conversationId]) {
        payload.replyToId = this.chat.replyChatbarMessages[conversationId].id

        this.$store.commit('chat/clearReplyChatbarMessage', { conversationId })
      }

      await iridium.chat?.sendMessage(payload)
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
