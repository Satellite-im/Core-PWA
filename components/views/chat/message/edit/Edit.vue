<template src="./Edit.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState } from 'vuex'
import { SmileIcon } from 'satellite-lucide-icons'
import { Config } from '~/config'
import { KeybindingEnum } from '~/libraries/Enums/enums'
import {
  Conversation,
  ConversationMessage,
} from '~/libraries/Iridium/chat/types'
import { EditableRef } from '~/components/interactables/Editable/Editable.vue'
import { AutocompleteRef } from '~/components/views/chat/chatbar/autocomplete/Autocomplete.vue'
import { RootState } from '~/types/store/store'

export default Vue.extend({
  components: {
    SmileIcon,
  },
  props: {
    message: {
      type: Object as PropType<ConversationMessage>,
      default: null,
      required: true,
    },
    maxChars: {
      type: Number,
      default: Config.chat.messageMaxChars,
    },
  },
  data() {
    return {
      content: '',
      showAutocomplete: false,
      autocompleteText: '',
      autocompleteSelection: '',
    }
  },
  computed: {
    ...mapState({
      ui: (state) => (state as RootState).ui,
    }),
    lengthCount(): number {
      return this.content.length
    },
    charlimit(): boolean {
      return this.lengthCount > this.maxChars
    },
    isError(): boolean {
      return this.charlimit || !this.content.length
    },
    conversationId(): Conversation['id'] {
      return this.$route.params.id
    },
  },
  mounted() {
    this.content = this.message.body ?? ''
  },
  methods: {
    saveMessage() {
      if (this.content.trim().length === 0) {
        this.$toast.error(this.$t('errors.chat.empty_message_error') as string)
        return
      }
      this.$emit('commitMessage', this.content.slice(0, this.maxChars))
    },
    cancelMessage() {
      this.$emit('cancelMessage')
    },
    /**
     * Called from chatbar's keydown event to process key events for typing in chatbar.
     */
    handleInputKeydown(event: KeyboardEvent) {
      switch (event.key) {
        case KeybindingEnum.ENTER:
          if (this.showAutocomplete && this.autocompleteSelection) {
            event.preventDefault()
            ;(this.$refs.editable as EditableRef).doAutocomplete(
              this.autocompleteSelection,
            )
            return
          }
          if (!event.shiftKey) {
            event.preventDefault()
            this.saveMessage()
          }
          break
        case KeybindingEnum.ESCAPE:
          this.cancelMessage()
          break
        case KeybindingEnum.ARROW_UP:
          if (this.showAutocomplete) {
            event.preventDefault()
            ;(this.$refs.autocomplete as AutocompleteRef).selectPrev()
          }
          break
        case KeybindingEnum.ARROW_DOWN:
          if (this.showAutocomplete) {
            event.preventDefault()
            ;(this.$refs.autocomplete as AutocompleteRef).selectNext()
          }
          break
        default:
          break
      }
    },
    handleAutocomplete(event: { show: boolean; text: string }) {
      this.showAutocomplete = event.show
      this.autocompleteText = event.text
    },
    handleAutocompleteSelection(val: string) {
      this.autocompleteSelection = val
    },
    handleAutocompleteClick(val: string) {
      ;(this.$refs.editable as EditableRef).doAutocomplete(val)
    },
  },
})
</script>

<style lang="less" src="./Edit.less"></style>
