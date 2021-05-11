export const mobileSwipe = {
    created: function () {
    //can add functions here on start-up if needed
    },
    methods: {
        settingsSwipeHandler (direction) {
            if (this.$route.name?.includes('settings') && this.$device.isMobile) {

            if (direction === 'left') {
                this.sidebar = false
            }
            if (direction === 'right') {
                this.sidebar = true
            }
            }
        }  
    }
}