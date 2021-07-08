<template src="./Preview.html"></template>

<script lang="ts">
import Vue from 'vue'
import { CurrentCommand } from '~/types/utils/commands'
import { commands, containsCommand, parseCommand } from '~/utilities/commands'

export default Vue.extend({
  props: {
    message: {
      type: String,
      default: '',
    },
  },
  computed: {
    hasCommand() {
      return (
        containsCommand(this.$store.state.ui.chatbarContent) &&
        commands.some((cmd) =>
          cmd.name.startsWith(
            parseCommand(this.$store.state.ui.chatbarContent).name.toLowerCase()
          )
        )
      )
    },
    command() {
      return parseCommand(this.$store.state.ui.chatbarContent)
    },
    commands() {
      return commands.filter((cmd) =>
        cmd.name.startsWith(
          parseCommand(this.$store.state.ui.chatbarContent).name.toLowerCase()
        )
      )
    },
  },
  methods: {
    completeCommand(command: CurrentCommand) {
      this.$store.commit('chatbarContent', `/${command.name}`)
    },
  },
})
</script>

<style scoped lang="less" src="./Preview.less"></style>
