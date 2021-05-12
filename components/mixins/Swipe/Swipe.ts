export const mobileSwipe = {
    created: () => {
      // can add functions here on start-up if needed
    },
    methods: {
      // swipe handler for settings
      settingsSwipeHandler(sidebar: any, direction: string){
        // console.log(this)
        console.log(sidebar)
        // console.log(direction)
        // if (this.$route.name?.includes('settings') && this.$device.isMobile) {
          if (direction === 'left') {
            // console.log("left")
            sidebar = false
          }
          if (direction === 'right') {
            sidebar = true
            // console.log("right")
          }
        // }
      },
    },
  }
  