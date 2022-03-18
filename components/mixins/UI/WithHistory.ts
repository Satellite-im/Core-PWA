import { Dayjs } from 'dayjs'
import Vue from 'vue'
import { Config } from '~/config'
import Cursor from '~/libraries/ui/Cursor'

export type Operation = {
  type: 'insert_text' | 'remove_text'
  position: number
  text: string
  insertedText: string
  timestamp: Dayjs
  fn?: Function
}

declare module 'vue/types/vue' {
  interface Vue {
    currentPosition: number
  }
}

export default Vue.extend({
  data() {
    return {
      undos: [] as Operation[],
      redos: [] as Operation[],
    }
  },
  methods: {
    resetHistory() {
      this.undos = []
      this.redos = []
    },
    buildOp(
      op: Operation,
      opt?: { text: string; position: number },
    ): Operation {
      const finalText = opt?.text ?? op.text
      const finalPosition = opt?.position ?? op.position

      return {
        ...op,
        text: finalText,
        position: finalPosition,
        fn: () => {
          // Update chatbar value
          this.$emit('input', finalText)
          // Update cursor position (must be done after the repaint triggered by the input event)
          this.$nextTick(() => {
            const messageBox = this.$refs?.editable as HTMLElement
            Cursor.setCurrentCursorPosition(finalPosition, messageBox)
          })
        },
      }
    },
    inverse(op: Operation): Operation {
      switch (op.type) {
        case 'insert_text': {
          return {
            ...op,
            type: 'remove_text',
          }
        }

        case 'remove_text': {
          return {
            ...op,
            type: 'insert_text',
          }
        }
        default: {
          throw new Error(`Unknown operation type: ${op.type}`)
        }
      }
    },
    redo() {
      const redos = this.redos
      if (redos.length > 0) {
        const op = redos[redos.length - 1]
        op.fn && op.fn()

        redos.pop()
        this.undos.push(
          this.buildOp(op, {
            text: this.$props.value,
            position: this.currentPosition,
          }),
        )
      }
    },
    undo() {
      const undos = this.undos
      if (undos.length > 0) {
        const op = undos[undos.length - 1]
        const inverseOps = this.inverse(op)
        inverseOps.fn && inverseOps.fn()

        this.redos.push(
          this.buildOp(op, {
            text: this.$props.value,
            position: this.currentPosition,
          }),
        )
        this.undos.pop()
      }
    },
    apply(op: Operation) {
      const lastOp = this.undos[this.undos.length - 1]
      const merge = Boolean(lastOp) && shouldMerge(op, lastOp)
      if (!lastOp || !merge) {
        this.undos.push(this.buildOp(op))
      }

      if (this.undos.length > Config.chat.maxUndoStack) {
        this.undos = this.undos.slice(-100)
      }

      this.redos = []
    },
  },
})

const shouldMerge = (op: Operation, prev: Operation | undefined): boolean => {
  if (prev && op.type !== prev.type) {
    return false
  }

  if (
    prev &&
    op &&
    op.timestamp.diff(prev.timestamp, 'seconds') >= Config.chat.batchUndoSeconds
  ) {
    return false
  }

  if (prev && op.type === 'insert_text') {
    return !op.insertedText.endsWith(' ')
  }

  return true
}
