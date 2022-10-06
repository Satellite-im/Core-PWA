<template src="./Autocomplete.html"></template>

<script lang="ts">
import Vue from 'vue'
import fuzzysort from 'fuzzysort'
import iridium from '~/libraries/Iridium/IridiumManager'
import { Conversation } from '~/libraries/Iridium/chat/types'
import { User } from '~/libraries/Iridium/users/types'

export default Vue.extend({
  props: {
    text: {
      type: String,
      required: true,
    },
    conversationId: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    selectedIndex: 0,
  }),
  computed: {
    conversation(): Conversation | undefined {
      return iridium.chat.getConversation(this.conversationId)
    },
    users(): User[] {
      const collator = new Intl.Collator()
      return (
        this.conversation?.participants
          .map((did) => {
            return iridium.users.getUser(did)
          })
          .filter((u): u is User => Boolean(u))
          .sort((a, b) => collator.compare(a.name, b.name)) ?? []
      )
    },
    sortedUsers(): User[] {
      console.log('xxx', this.users)
      if (this.text === '') {
        return this.users
      }
      const results = fuzzysort
        .go(this.text, this.users, { key: 'name' })
        .map((result) => {
          return result.obj
        })
      this.$emit('sortedUsers', results)
      return results
    },
  },
  watch: {
    sortedUsers(oldValue: User[], newValue: User[]) {
      this.selectedIndex = 0
      this.updateSelection()
    },
    selectedIndex() {
      this.updateSelection()
    },
  },
  mounted() {
    this.updateSelection()
  },
  methods: {
    selectPrev() {
      this.moveSelection(-1)
    },
    selectNext() {
      this.moveSelection(1)
    },
    moveSelection(delta: number) {
      const len = this.sortedUsers.length
      this.selectedIndex = (this.selectedIndex + delta + len) % len
    },
    updateSelection() {
      if (!this.sortedUsers.length) {
        this.$emit('selection', null)
        return
      }
      this.$emit('selection', this.sortedUsers[this.selectedIndex].name)
    },
    handleClick(e: MouseEvent, index: number) {
      e.preventDefault()
      this.$emit('click', this.sortedUsers[index].name)
    },
    handleMouseDown(e: MouseEvent) {
      e.preventDefault()
    },
  },
})
</script>

<style scoped lang="less" src="./Autocomplete.less"></style>
