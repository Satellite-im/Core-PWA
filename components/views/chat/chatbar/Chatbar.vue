<template src="./Chatbar.html"></template>
<script lang="ts">
import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'
import { throttle } from 'lodash'
import { TerminalIcon } from 'satellite-lucide-icons'
import { parseCommand, commands } from '~/libraries/ui/Commands'
import { Friend } from '~/types/ui/friends'
import {
  KeybindingEnum,
  MessagingTypesEnum,
  PropCommonEnum,
} from '~/libraries/Enums/enums'
import { Config } from '~/config'
import { Group } from '~/types/messaging'
import { RootState } from '~/types/store/store'
import { ChatText } from '~/store/chat/types'

export default Vue.extend({
  components: {
    TerminalIcon,
  },
  computed: {
    ...mapGetters({
      recipient: 'conversation/recipient',
      getFiles: 'chat/getFiles',
      isGroup: 'conversation/isGroup',
    }),
    ...mapState({
      ui: (state) => (state as RootState).ui,
      friends: (state) => (state as RootState).friends,
      webrtc: (state) => (state as RootState).webrtc,
      chat: (state) => (state as RootState).chat,
      textile: (state) => (state as RootState).textile,
      conversation: (state) => (state as RootState).conversation,
    }),
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
        Boolean(this.getFiles?.length) ||
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
          userId: this.recipient?.address,
        })
      },
    },
    placeholder(): string {
      return !this.hasCommand && this.text === ''
        ? (this.$t('ui.talk') as string)
        : ''
    },
  },
  watch: {
    'recipient.address': {
      handler(value) {
        const findItem = this.chat.chatTexts.find(
          (item: ChatText) => item.userId === value,
        )
        const message = findItem ? findItem.value : ''
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
      this.$store.dispatch('ui/toggleChatbarFocus', false)
      if (!this.recipient) {
        return
      }
      // keep recipient in case user changes chats quickly after send
      const recipient = this.recipient
      // if there are any files attached to this chat, send
      await this.sendFiles()
      // return if input is empty or over max length
      if (
        this.text.length > this.$Config.chat.maxChars ||
        !this.text.trim().length
      ) {
        return
      }
      const value = this.text
      this.text = ''
      if (
        this.ui.replyChatbarContent.from &&
        !RegExp(this.$Config.regex.uuidv4).test((recipient as Group)?.id)
      ) {
        this.$store.dispatch('textile/sendReplyMessage', {
          to: (recipient as Friend).textilePubkey,
          text: value,
          replyTo: this.ui.replyChatbarContent.messageID,
          replyType: MessagingTypesEnum.TEXT,
        })
        return
      }

      if (
        RegExp(this.$Config.regex.uuidv4).test(
          (recipient as Group)?.id?.split('|')[1],
        )
      ) {
        if (this.ui.replyChatbarContent.from) {
          this.$store.dispatch('textile/sendGroupReplyMessage', {
            to: (recipient as Group).id,
            text: value,
            replyTo: this.ui.replyChatbarContent.messageID,
            replyType: MessagingTypesEnum.TEXT,
          })
          this.text = ''
          return
        }
        this.$store.dispatch('textile/sendGroupMessage', {
          groupId: (recipient as Group).id,
          message: value,
        })
      } else {
        this.$store.dispatch('textile/sendTextMessage', {
          to: (recipient as Friend).textilePubkey,
          text: value,
        })
      }
    },
    /**
     * @method handlePaste
     * @description Allows the pasting of files into the chatbar
     * @param e Paste event data object
     * @example v-on:paste="handlePaste"
     */
    handlePaste(e: ClipboardEvent) {
      /* Don't use event.preventDefault(). It prevent original text copy-paste */
      e.stopPropagation()
      /* Upload if image, if not then no action */
      this.handleUpload(e?.clipboardData?.items, e)
    },
    /**
     * @method handleUpload
     * @description Takes in an array of event items and uploads the file objects
     * @param items Array of objects
     * @example this.handleUpload(someEvent.itsData.items)
     */
    handleUpload(items: Array<object>, e: Event) {
      const files: File[] = [...items]
        .filter((f: any) => {
          return f.kind !== MessagingTypesEnum.STRING
        })
        .map((f: any) => f.getAsFile())
      if (files.length) {
        e.preventDefault()
        const handleFileExpectEvent = { target: { files } }
        // @ts-ignore
        this.$refs.upload?.handleFile(handleFileExpectEvent)
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
      // keep recipient in case user changes chats
      const recipient = this.recipient
      for (const [index, file] of this.getFiles.entries()) {
        if (this.isGroup) {
          await this.$store
            .dispatch('textile/sendGroupFileMessage', {
              groupID: (recipient as Group)?.id,
              file,
              address: recipient.address,
              index,
            })
            .catch((error) => {
              if (error) {
                this.$Logger.log('file send error', error)
                document.body.style.cursor = PropCommonEnum.DEFAULT
              }
            })
        } else {
          await this.$store
            .dispatch('textile/sendFileMessage', {
              to: (recipient as Friend)?.textilePubkey,
              file,
              address: recipient.address,
              index,
            })
            .catch((error) => {
              if (error) {
                this.$Logger.log('file send error', error)
                document.body.style.cursor = PropCommonEnum.DEFAULT
              }
            })
        }
      }
      document.body.style.cursor = PropCommonEnum.DEFAULT
      this.$store.commit('chat/deleteFiles', recipient.address)
    },
  },
})
</script>
<style scoped lang="less" src="./Chatbar.less"></style>
<style lang="less">
.messageuser {
  &.editable-container {
    > div {
      padding: 14px 0;
    }
  }
  blockquote {
    border-left: 4px solid @text-muted;
    padding-left: @light-spacing;
  }
  p {
    font-size: @text-size !important;
    .chatbar-tag {
      &:extend(.round-corners);
      background: @midground;
      padding: @xlight-spacing;
    }
  }
}
</style>
