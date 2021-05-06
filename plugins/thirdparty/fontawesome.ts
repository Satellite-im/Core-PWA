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
} from '@fortawesome/pro-regular-svg-icons'
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

Vue.component('FontAwesomeIcon', FontAwesomeIcon)
