<template src="./Preview.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { CurrentCommand } from '~/types/utils/commands'
import {
  commands,
  hasCommandPreview,
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
    /**
     * @method hasCommand DocsTODO
     * @description
     * @returns
     * @example
     */
    hasCommand() {
      return hasCommandPreview(this.ui.chatbarContent)
    },
    /**
     * @method command DocsTODO
     * @description
     * @returns
     * @example
     */
    command() {
      return parseCommand(this.ui.chatbarContent)
    },
    /**
     * @method commands DocsTODO
     * @description
     * @returns
     * @example
     */
    commands() {
      return commands.filter((cmd) =>
        cmd.name.startsWith(
          parseCommand(this.ui.chatbarContent).name.toLowerCase(),
        ),
      )
    },
  },
  methods: {
    /**
     * @method completeCommand DocsTODO
     * @description
     * @param command
     * @example
     */
    completeCommand(command: CurrentCommand) {
      this.$store.commit('ui/chatbarContent', `/${command.name}`)
    },
  },
})
</script>

<style scoped lang="less" src="./Preview.less"></style>
