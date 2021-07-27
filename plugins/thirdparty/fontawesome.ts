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
  faLock,
  faBars,
  faClipboard,
  faTimesCircle,
  faPlus,
  faSave,
  faUser,
  faGlobeAmericas,
  faUserFriends,
  faUsers,
  faUserPlus,
  faFolder,
  faFolderPlus,
  faCommentAltLines,
  faMicrophoneAlt,
  faHeadphonesAlt,
  faCog,
  faPhone,
  faVideo,
  faFilePlus,
  faFileAlt,
  faGrinTongueWink,
  faArchive,
  faSort,
  faEllipsisV,
  faSync,
  faImage,
  faHome,
  faFile,
  faLink,
  faTimes,
  faDownload,
  faFileDownload,
  faThumbtack,
  faCircleNotch,
  faCommentAltDots,
  faPeopleArrows,
  faUserTimes,
  faCheck,
  faDesktopAlt,
  faPhoneSlash,
  faExpand,
  faCompress,
  faVolumeDown,
  faVolume,
  faVolumeUp,
  faVolumeOff,
  faVolumeMute,
  faChevronRight,
  faTerminal,
  faCommentAltSmile,
  faSearch,
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
library.add(faFolderPlus)
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
library.add(faArchive)
library.add(faFileAlt)
library.add(faSort)
library.add(faEllipsisV)
library.add(faLock)
library.add(faSync)
library.add(faHome)
library.add(faImage)
library.add(faDownload)
library.add(faLink)
library.add(faTimes)
library.add(faThumbtack)
library.add(faFile)
library.add(faFileDownload)
library.add(faCircleNotch)
library.add(faCommentAltDots)
library.add(faUserPlus)
library.add(faPeopleArrows)
library.add(faUserTimes)
library.add(faCheck)
library.add(faDesktopAlt)
library.add(faPhoneSlash)
library.add(faExpand)
library.add(faVolumeOff)
library.add(faVolumeUp)
library.add(faVolume)
library.add(faVolumeMute)
library.add(faVolumeDown)
library.add(faChevronRight)
library.add(faTerminal)
library.add(faCompress)
library.add(faCommentAltSmile)
library.add(faSearch)
library.add(faTimes)

Vue.component('FontAwesomeIcon', FontAwesomeIcon)
