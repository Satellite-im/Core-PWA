export const mobileSwipe = {
  created: () => {
    // can add functions here on start-up if needed
  },
  methods: {
    // swipe handler for settings
    settingsSwipeHandler(direction) {
      if (this.$route.name?.includes('settings') && this.$device.isMobile) {
        if (direction === 'left') {
          this.sidebar = false
        }
        if (direction === 'right') {
          this.sidebar = true
        }
      }
    },
  },
}
