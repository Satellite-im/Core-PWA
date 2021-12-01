<template src="./Chatbar.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState } from 'vuex'

import { TerminalIcon } from 'satellite-lucide-icons'

import FileUpload from '../fileupload/FileUpload.vue'
import {
  // commandPrefix,
  // containsCommand,
  parseCommand,
  commands,
  isArgsValid,
} from '~/libraries/ui/Commands'
import { Friend } from '~/types/ui/friends'

declare module 'vue/types/vue' {
  interface Vue {
    sendMessage: Function
    handleInputChange: Function
    value: string
    updateText: Function
    handleUpload: Function
  }
}

export default Vue.extend({
  components: {
    FileUpload,
    TerminalIcon,
  },
  data() {
    return {
      text: '',
      showEmojiPicker: false,
      maxChars: 256,
    }
  },
  props: {
    recipient: {
      type: Object as PropType<Friend>,
    },
  },
  computed: {
    ...mapState(['ui']),
    /**
     * Computes the amount of characters left
     */
    /**
     * @method charlimit DocsTODO
     * @description Checks if current text is longer than the max character limit
     * @returns Boolean based on if the current text length is longer than the max character limit
     * @example
     */
    charlimit() {
      return this.$data.text.length > this.$data.maxChars
    },
    /**
     * @method hasCommand DocsTODO
     * @description
     * @returns
     * @example
     */
    hasCommand() {
      const parsedCommand = parseCommand(this.ui.chatbarContent)
      const currentCommand = commands.find(
        (cmd) => cmd.name === parsedCommand.name.toLowerCase()
      )
      return currentCommand != null
    },
    /**
     * @method isValidCommand DocsTODO
     * @description
     * @returns
     * @example
     */
    isValidCommand() {
      const currentText = parseCommand(
        this.ui.chatbarContent
      ).name.toLowerCase()
      const currentArgs = parseCommand(this.ui.chatbarContent).args
      const currentCommand = commands.find((c) => c.name === currentText)
      return currentCommand && isArgsValid(currentCommand, currentArgs)
    },
    value: {
      /**
       * @method get
       * @description Gets chatbars current text
       * @returns String of chatbars current text
       * @example const currText = this.get()
       */
      get() {
        return this.ui.chatbarContent
      },
      /**
       * @method set
       * @description Sets current chatbar text to new value
       * @param val Value to set the chatbar content to
       * @example set('This is the new chatbar content')
       */
      set(val: string) {
        this.$store.commit('ui/chatbarContent', val)
        this.$data.text = val
      },
    },
    placeholder() {
      if (!this.hasCommand && this.$data.text === '') {
        return this.$t('global.talk')
      } else {
        return ''
      }
    },
  },
  methods: {
    /**
     * @method handleInputChange DocsTODO
     * @description Called from handleInputKeydown function when normal key events are fired for typing in chatbar.
     * Decodes current HTML content of chatbar to plain text and Encodes plain text to Markdown HTML expression.
     * Once replaced current HTML content, move the caret to proper position.
     * @example
     */
    handleInputChange() {
      const messageBox = this.$refs.messageuser as HTMLElement
      const wrap = this.$refs.wrap as HTMLElement
      // Delete extra character when it exceeds the charlimit
      if (
        messageBox.innerHTML &&
        messageBox.innerHTML.length > this.$data.maxChars + 1
      ) {
        messageBox.innerHTML = messageBox.innerHTML.slice(0, -1)
        this.updateText()
      }
      if (wrap.offsetHeight > 50) wrap.style.borderRadius = '4px'
      if (wrap.offsetHeight < 50) wrap.style.borderRadius = '41px'
      this.value = messageBox.innerHTML
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
        case 'Enter':
          if (!event.shiftKey) {
            event.preventDefault()
            if (this.$data.text !== '' && !this.hasCommand) {
              this.sendMessage()
              break
            }
            if (this.hasCommand && !this.isValidCommand) {
              console.log('dispatch command')
              break
            }
          }
          break
        default:
          break
      }
      this.handleInputChange()
    },
    handleInputKeyup(event: KeyboardEvent) {
      this.$nextTick(() => {
        this.handleInputChange()
      })
    },
    /**
     * @method updateText
     * @description Helper function to update the text inside the chatbox and send the cursor to the end.
     */
    updateText() {
      const messageBox = this.$refs.messageuser as HTMLElement
      messageBox.innerHTML = this.value
      let sel = window.getSelection()
      sel?.selectAllChildren(messageBox)
      sel?.collapseToEnd()
    },
    /**
     * @method sendMessage
     * @description Sends message by calling the sendMessage action with current data and
     * then setting all related feilds to their default (empty)
     * @example v-on:click="sendMessage"
     */
    sendMessage() {
      const isEmpty = !this.value.replace(/\s/g, '').replace(/&nbsp;/g, '').length
      if (!this.recipient || isEmpty) {
        return
      }

      if (this.ui.replyChatbarContent.from) {
        this.$store.dispatch('textile/sendReplyMessage', {
          to: this.recipient.textilePubkey,
          text: this.value,
          replyTo: this.ui.replyChatbarContent.messageID,
        })
      } else {
        this.$store.dispatch('textile/sendTextMessage', {
          to: this.recipient.textilePubkey,
          text: this.value,
        })
      }

      const messageBox = this.$refs.messageuser as HTMLElement
      // Clear Chatbar
      messageBox.innerHTML = ''
      this.value = ''
    },
    /**
     * @method handleDrop
     * @description Allows the drag and drop of files into the chatbar
     * @param e Drop event data object
     * @example v-on:drop="handleDrop" 
     */
    handleDrop(e: any) {
      e.preventDefault()
      this.handleUpload(e.dataTransfer.items)
    },
    /**
     * @method handlePaste
     * @description Allows the pasting of files into the chatbar
     * @param e Paste event data object
     * @example v-on:paste="handlePaste"
     */
    handlePaste(e: any) {
      e.stopPropagation()
      const clipboardItems = e.clipboardData.items
      if(clipboardItems && clipboardItems.length) {
        this.handleUpload(clipboardItems)
      }
    },
    /**
     * @method handleUpload
     * @description Takes in an array of event items and uploads the file objects
     * @param items Array of objects
     * @example this.handleUpload(someEvent.itsData.items)
     */
    handleUpload(items: Array<object>) {
      /* check if type is image */
      const arrOfFiles: File[] = [...items]
        .filter((f: any) => f.type.includes('image'))
        .map((f: any) => f.getAsFile())

      if (arrOfFiles.length) {
        const handleFileExpectEvent = { target: { files: [...arrOfFiles] } }
        // @ts-ignore
        this.$refs['file-upload']?.handleFile(handleFileExpectEvent)
      }
    }
  },
  watch: {
    '$store.state.ui.chatbarContent': function () {
      this.updateText()
    },
  },
})
</script>

<style scoped lang="less" src="./Chatbar.less"></style>

<style lang="less">
.messageuser {
  blockquote {
    border-left: 4px solid @text-muted;
    padding-left: @light-spacing;
  }
  p {
    font-size: @text-size !important;
    .chatbar-tag {
      border-radius: @corner-rounding;
      background-color: @dark-gray;
      padding: @xlight-spacing;
    }
  }
}
</style>
