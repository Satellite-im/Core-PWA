<template>
  <div class="test">
    <div
      ref="pip"
      class="container"
      :style="{
        transform: transform,
        width: `${elWidth}px`,
        height: `${elHeight}px`,
      }"
      :class="{ pointer: isDragging }"
      @mousedown="mouseDown"
    >
      <!-- <div class="content-container">
        <div class="content-item"></div>
        <div class="content-item"></div>
        <div class="content-item"></div>
        <div class="content-item"></div>
      </div> -->
    </div>
    <!-- <div class="grid-container">
      <div class="grid-item">1</div>
      <div class="grid-item">2</div>
      <div class="grid-item">3</div>
      <div class="grid-item">4</div>
      <div class="grid-item">5</div>
      <div class="grid-item">6</div>
      <div class="grid-item">7</div>
      <div class="grid-item">8</div>
    </div> -->
  </div>
</template>

<script lang="ts">
import { throttle } from 'lodash'
import Vue, { PropType } from 'vue'

type QuarterType = {
  x: 0 | 1
  y: 0 | 1 | 2 | 3
}

const MARGIN = 80

export default Vue.extend({
  data() {
    return {
      isDragging: false,
      x: MARGIN,
      y: MARGIN,
      offsetX: 0,
      offsetY: 0,
      elWidth: 320,
      elHeight: 180,
      quarter: { x: 0, y: 0 } as QuarterType,
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
      const blockWidth = window.innerWidth / 2
      const blockHeight = window.innerHeight / 4

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
      const blockHeight = window.innerHeight / 4
      const refHeight = Math.max(blockHeight, this.elHeight)
      switch (quarter.x) {
        case 0:
          this.x = MARGIN
          this.y =
            // take into account smaller window height
            blockHeight > this.elHeight
              ? blockHeight * quarter.y + blockHeight / 2 - this.elHeight / 2
              : quarter.y > 1
              ? window.innerHeight - this.elHeight - MARGIN
              : MARGIN
          break
        case 1:
          this.x = window.innerWidth - this.elWidth - MARGIN
          this.y =
            // take into account smaller window height
            blockHeight > this.elHeight
              ? blockHeight * quarter.y + blockHeight / 2 - this.elHeight / 2
              : quarter.y > 1
              ? window.innerHeight - this.elHeight - MARGIN
              : MARGIN
          break
        default:
          this.x = MARGIN
          this.y = MARGIN
          break
      }
    },
    mouseDown(e: MouseEvent) {
      this.isDragging = true
      this.offsetX = e.offsetX
      this.offsetY = e.offsetY
      document.addEventListener('mouseup', this.mouseUp)
      document.addEventListener('mousemove', this.mouseMove)
    },
    mouseUp() {
      this.isDragging = false
      document.removeEventListener('mouseup', this.mouseUp)
      document.removeEventListener('mousemove', this.mouseMove)
      this.quarter = this.calcPosition() as QuarterType
      this.moveToQuarter(this.quarter)
    },
    mouseMove: throttle(
      function (e) {
        let finalX = e.clientX - this.offsetX
        if (finalX < 0) {
          finalX = 0
        } else if (finalX + this.elWidth > window.innerWidth) {
          finalX = window.innerWidth - this.elWidth
        }

        let finalY = e.clientY - this.offsetY
        if (finalY < 0) {
          finalY = 0
        } else if (finalY + this.elHeight > window.innerHeight) {
          finalY = window.innerHeight - this.elHeight
        }

        this.x = finalX
        this.y = finalY
      },
      100,
      { trailing: false },
    ),
    onResize: throttle(function () {
      this.moveToQuarter(this.quarter)
    }, 100),
  },
})
</script>

<style scoped lang="less">
.test {
  position: absolute;
  height: 100%;
  width: 100%;
}
.container {
  position: absolute;
  /* transition: transform 800ms ease-out; cubic-bezier(0.2, 0.57, 0.67, 1.53)*/
  transition: transform 500ms cubic-bezier(0.2, 0.885, 0.32, 1.5);
  transition-delay: 1ms;
  border-radius: 5px;
  border: 1px solid;
  box-sizing: border-box;
  cursor: pointer;
  z-index: 1000;
}

.pointer {
  pointer-events: none;
}

.grid-container {
  user-select: none;
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-columns: auto auto;

  .grid-item {
    box-sizing: border-box;
    border: 1px dashed red;

    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.content-container {
  user-select: none;
  pointer-events: none;
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-columns: auto auto;

  .content-item {
    box-sizing: border-box;
    border: 1px dashed orange;
  }
}
</style>
