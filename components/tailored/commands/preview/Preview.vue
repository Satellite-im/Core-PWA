<template src="./Preview.html"></template>

<script lang="ts">
import Vue from 'vue'
import { CurrentCommand } from '~/types/utils/commands'
import { mapState } from 'vuex'
import {
  commands,
  containsCommand,
  parseCommand,
} from '~/libraries/ui/Commands'

export default Vue.extend({
  props: {
    message: {
      type: String,
      default: '',
    },
  },
  computed: {
    ...mapState(['ui']),
    hasCommand() {
      return (
        containsCommand(this.ui.chatbarContent) &&
        commands.some((cmd) =>
          cmd.name.startsWith(
            parseCommand(this.ui.chatbarContent).name.toLowerCase()
          )
        )
      )
    },
    command() {
      return parseCommand(this.ui.chatbarContent)
    },
    commands() {
      return commands.filter((cmd) =>
        cmd.name.startsWith(
          parseCommand(this.ui.chatbarContent).name.toLowerCase()
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
