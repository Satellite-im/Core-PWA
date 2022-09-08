<template>
  <div
    ref="pip"
    class="pip-container"
    :style="{
      transform: transform,
      width: `${elWidth}px`,
      height: `${elHeight}px`,
    }"
    :class="{ dragging: isDragging }"
    @mousedown.stop="mouseDown"
    @dblclick="doubleClick"
  >
    <slot :dragging="isDragging" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { throttle } from 'lodash'
import { Config } from '~/config'
import { animate, easeOutBack, lerp } from '~/utilities/animation'

type ColumnType = typeof Config.pip.columns[number]
type RowType = typeof Config.pip.rows[number]

type QuarterType = {
  x: ColumnType
  y: RowType
}

const DRAG_INTERVAL_MS = 1000 / 60

function isLeftButton(e: MouseEvent) {
  const evt = e || window.event
  if ('buttons' in evt) {
    return evt.buttons === 1
  }
  const button = evt.which || evt.button
  return button === 1
}

export default Vue.extend({
  data() {
    return {
      x: Config.pip.windowMargin,
      y: Config.pip.windowMargin,
      offsetX: 0,
      offsetY: 0,
      elWidth: 320,
      elHeight: 180,
      quarter: { x: Config.pip.columns.length - 1, y: 0 } as QuarterType,
      isDragging: false,
      isEnlarged: false,
      dragInterval: null as NodeJS.Timer | null,
      mouseX: 0,
      mouseY: 0,
    }
  },
  computed: {
    transform(): string {
      return `translateX(${this.x}px) translateY(${this.y}px) translateZ(0px)`
    },
  },
  mounted() {
    this.moveToQuarter(this.quarter)
    window.addEventListener('resize', this.onResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize)
  },
  methods: {
    calcPosition() {
      const blockWidth = window.innerWidth / Config.pip.columns.length
      const blockHeight = window.innerHeight / Config.pip.rows.length

      const containerCenter = {
        x: this.x + this.elWidth / 2,
        y: this.y + this.elHeight / 2,
      }

      return {
        x: Math.floor(containerCenter.x / blockWidth),
        y: Math.floor(containerCenter.y / blockHeight),
      }
    },
    moveToQuarter(quarter: QuarterType) {
      const blockHeight = window.innerHeight / Config.pip.rows.length
      let x: number, y: number
      switch (quarter.x > Config.pip.columns.length / 2 - 1) {
        case false:
          x = Config.pip.windowMargin
          y =
            // take into account smaller window height
            blockHeight > this.elHeight
              ? blockHeight * quarter.y + blockHeight / 2 - this.elHeight / 2
              : quarter.y > Config.pip.rows.length / 2 - 1
              ? window.innerHeight - this.elHeight - Config.pip.windowMargin
              : Config.pip.windowMargin
          break
        case true:
          x = window.innerWidth - this.elWidth - Config.pip.windowMargin
          y =
            // take into account smaller window height
            blockHeight > this.elHeight
              ? blockHeight * quarter.y + blockHeight / 2 - this.elHeight / 2
              : quarter.y > Config.pip.rows.length / 2 - 1
              ? window.innerHeight - this.elHeight - Config.pip.windowMargin
              : Config.pip.windowMargin
          break
      }

      const oldX = this.x
      const oldY = this.y

      animate({
        timing: easeOutBack,
        draw: (v) => {
          this.x = lerp(oldX, x, v)
          this.y = lerp(oldY, y, v)
        },
        duration: 500,
      })
    },
    mouseDown(e: MouseEvent) {
      if (
        !isLeftButton(e) ||
        (e.target as HTMLElement).closest(Config.pip.preventDragClass)
      )
        return

      const winOffsetX = (this.$refs.pip as HTMLElement).getBoundingClientRect()
        .x
      const winOffsetY = (this.$refs.pip as HTMLElement).getBoundingClientRect()
        .y

      this.isDragging = true
      this.offsetX = e.clientX - winOffsetX
      this.offsetY = e.clientY - winOffsetY
      document.addEventListener('mouseup', this.mouseUp)
      document.addEventListener('mousemove', this.mouseMove)
      // TODO: document.body.style.pointerEvents = 'none'
      this.mouseX = e.clientX
      this.mouseY = e.clientY
      this.dragInterval = setInterval(this.dragUpdate, DRAG_INTERVAL_MS)
    },
    mouseUp() {
      clearInterval(this.dragInterval)
      this.isDragging = false
      document.removeEventListener('mouseup', this.mouseUp)
      document.removeEventListener('mousemove', this.mouseMove)
      this.quarter = this.calcPosition() as QuarterType
      this.moveToQuarter(this.quarter)
      // TODO: document.body.style.pointerEvents = 'auto'
    },
    mouseMove(e: MouseEvent) {
      this.mouseX = e.clientX
      this.mouseY = e.clientY
    },
    dragUpdate() {
      let finalX = this.mouseX - this.offsetX
      if (finalX < 0) {
        finalX = 0
      } else if (finalX + this.elWidth > window.innerWidth) {
        finalX = window.innerWidth - this.elWidth
      }

      let finalY = this.mouseY - this.offsetY
      if (finalY < 0) {
        finalY = 0
      } else if (finalY + this.elHeight > window.innerHeight) {
        finalY = window.innerHeight - this.elHeight
      }

      this.x = (this.x * 2 + finalX) / 3
      this.y = (this.y * 2 + finalY) / 3
    },
    onResize: throttle(function () {
      this.moveToQuarter(this.quarter)
    }, Config.pip.throttleTime),
    doubleClick(e: MouseEvent) {
      if ((e.target as HTMLElement).closest(Config.pip.preventDragClass)) return

      this.elWidth =
        this.elWidth *
        (!this.isEnlarged
          ? Config.pip.enlargeFactor
          : 1 / Config.pip.enlargeFactor)
      this.elHeight =
        this.elHeight *
        (!this.isEnlarged
          ? Config.pip.enlargeFactor
          : 1 / Config.pip.enlargeFactor)
      this.isEnlarged = !this.isEnlarged
      this.moveToQuarter(this.quarter)
    },
  },
})
</script>

<style scoped lang="less">
.pip-container {
  position: absolute;
  inset: 0;
  /* transition: transform 800ms ease-out; cubic-bezier(0.2, 0.57, 0.67, 1.53)*/
  /* transition: all 400ms cubic-bezier(0.2, 0.885, 0.32, 1.5); */
  transition-delay: 1ms;
  border-radius: 5px;
  box-sizing: border-box;
  cursor: move;
  cursor: grab;
  cursor: -moz-grab;
  cursor: -webkit-grab;
  overflow: hidden;
  box-shadow: @ui-shadow-large;
  &:extend(.no-select);
}

.dragging {
  cursor: grabbing;
  cursor: -moz-grabbing;
  cursor: -webkit-grabbing;
}
</style>
