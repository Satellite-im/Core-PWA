// In order to not load un-used icons and bloat the deployed application
// we only import the icons we plan to use in the application.
// Add any icons you need in this plugin file and they will be loaded into the icon libary.

// For implementation examples see components/ui/Spinner/Spinner.vue
import Vue from 'vue'

import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faSpinnerThird,
  faArrowCircleRight,
  faLockOpen,
  faBars,
  faClipboard,
  faTimesCircle,
  faPlus,
  faSave,
  faUser,
  faGlobeAmericas,
  faUserFriends,
  faUsers,
  faFolder,
  faCommentAltLines,
  faMicrophoneAlt,
  faHeadphonesAlt,
  faCog,
  faPhone,
  faVideo,
  faFilePlus,
  faGrinTongueWink,
} from '@fortawesome/pro-regular-svg-icons'

import { faCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faSpinnerThird)
library.add(faArrowCircleRight)
library.add(faLockOpen)
library.add(faBars)
library.add(faClipboard)
library.add(faTimesCircle)
library.add(faPlus)
library.add(faSave)
library.add(faUser)
library.add(faGlobeAmericas)
library.add(faUsers)
library.add(faFolder)
library.add(faUserFriends)
library.add(faCommentAltLines)
library.add(faMicrophoneAlt)
library.add(faHeadphonesAlt)
library.add(faCog)
library.add(faCircle)
library.add(faPhone)
library.add(faVideo)
library.add(faFilePlus)
library.add(faGrinTongueWink)

Vue.component('FontAwesomeIcon', FontAwesomeIcon)
