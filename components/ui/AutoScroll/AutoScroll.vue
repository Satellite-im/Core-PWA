<template src="./AutoScroll.html"></template>

<script>
import Vue from 'vue'

export default Vue.extend({
  name: 'AutoScroll',
  components: {
  },
  props: {
    height: {
      type: String,
      default: '400px'
    },
    speed: {
      type: Number,
      default: 3
    },
    mouseOverStart: {
      type: Boolean,
      default: true,
      required: false
    }
  },
  beforeDestroy() {
    this.stopScroll();
  },
  mounted() {
    this.$nextTick(()=> {
      if(!this.mouseOverStart) this.startScroll();
    })
  },
  methods: {
    scroll() {
      if(this.$refs.autoScroll && this.isScrolling) {
        this.$refs.autoScroll.scrollTop += this.speed;
      } 
    },
    stopScroll() {
      if(this.scrollFn) {
        clearInterval(this.scroll)
        this.isScrolling = false
      }
    },
    startScroll() {
      this.scrollFn = setInterval(this.scroll, 100)
      this.isScrolling = true;
    },
    mouseOver() {
      if(this.mouseOverStart && !this.isScrolling) this.startScroll();
    },
    mouseClick() {
      if(this.isScrolling) {
        this.stopScroll();
      }else {
        this.startScroll();
      }
    }
  },
  data() {
    return {
      scrollFn: null,
      isScrolling: false
    }
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./AutoScroll.less"></style>
