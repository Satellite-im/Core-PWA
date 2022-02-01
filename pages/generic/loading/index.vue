<template src="./Loading.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

export default Vue.extend({
  name: 'LoadingScreen',
  data() {
    return {
      step: 'Preloading',
      totalSteps: 3,
      stepsCompleted: 0,
    }
  },
  computed: {
    ...mapState(['prerequisites']),
    // In the rare case our state isn't bound yet
    // (Can happen with persistedStates)
    // Go ahead and load it.
    loadedState(): Boolean {
      return (
        this.prerequisites &&
        this.prerequisites.stateLoaded
      )
    },
    // Ensure we're bound to the P2P servers
    peer2peerBound(): Boolean {
      return this.prerequisites.peer2PeerBound
    },
    // Ensure the blockchain is bound
    blockchainBound(): Boolean {
      return this.prerequisites.blockchainBound
    },
    // Helper method for prettier loading messages
    loadingStep(): String {
      return `${this.$data.stepsCompleted}/${this.$data.totalSteps} ${this.step}`
    },
  },
  watch: {
    peer2peerBound(val) {
      if (val) {
        this.completeP2P()
      }
    },
    blockchainBound(val) {
      if (val) {
        this.$data.step = 'Blockchain Bound'
        this.$data.stepsCompleted += 1
      }
    },
  },
  mounted() {
    // Check on mount, this prevents race conditions.
    if (this.loadedState) this.completeState()
    if (this.peer2peerBound) this.completeP2P()
    if (this.blockchainBound) this.completeBlockchain()
  },
  methods: {
    /**
     * @method completeP2P DocsTODO
     * @description
     * @example
     */
    completeP2P() {
      this.$data.step = 'Peer 2 Peer Bound'
      this.$data.stepsCompleted += 1
    },
    /**
     * @method completeBlockchain DocsTODO
     * @description
     * @example
     */
    completeBlockchain() {
      this.$data.step = 'Blockchain Bound'
      this.$data.stepsCompleted += 1
    },
    /**
     * @method completeState DocsTODO
     * @description
     * @example
     */
    completeState() {
      this.$data.step = 'State Initialized'
      this.$data.stepsCompleted += 1
    },
  },
})
</script>

<style lang="less" scoped src="./Loading.less"></style>
