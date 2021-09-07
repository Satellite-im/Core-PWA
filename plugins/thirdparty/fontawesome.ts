// In order to not load un-used icons and bloat the deployed application
// we only import the icons we plan to use in the application.
// Add any icons you need in this plugin file and they will be loaded into the icon libary.

// For implementation examples see components/ui/Spinner/Spinner.vue
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faCircle,
  faCrown,
  faEllipsisH,
  faHeart as faHeartFull,
  faShoppingBag as faShoppingBagFull,
  faShoppingCart,
} from '@fortawesome/free-solid-svg-icons'

import * as fal from '@fortawesome/pro-light-svg-icons'

import {
  faArchive,
  faArrowCircleRight,
  faBackspace,
  faBars,
  faCalendarDay,
  faCheck,
  faChevronDown,
  faChevronRight,
  faCircleNotch,
  faClipboard,
  faCog,
  faCommentAltDots,
  faCommentAltLines,
  faCommentAltSmile,
  faCompress,
  faCubes,
  faDesktopAlt,
  faDownload,
  faEllipsisV,
  faExpand,
  faFile,
  faFileAlt,
  faFileDownload,
  faFilePlus,
  faFolder,
  faFolderPlus,
  faGlobeAmericas,
  faGrinTongueWink,
  faHeadphonesAlt,
  faHeart,
  faHistory,
  faHome,
  faImage,
  faInfoCircle,
  faKeySkeleton,
  faLink,
  faLock,
  faLockOpen,
  faMicrophoneAlt,
  faPalette,
  faPeopleArrows,
  faPhone,
  faPhoneSlash,
  faPlus,
  faSave,
  faSearch,
  faShoppingBag,
  faSkull,
  faSort,
  faSpinnerThird,
  faSync,
  faTerminal,
  faTh,
  faThLarge,
  faThList,
  faThumbtack,
  faTimes,
  faTimesCircle,
  faTrash,
  faUser,
  faUserFriends,
  faUserPlus,
  faUsers,
  faUserTimes,
  faVideo,
  faVolume,
  faVolumeDown,
  faVolumeMute,
  faVolumeOff,
  faVolumeUp,
  faIdBadge,
  faClock,
} from '@fortawesome/pro-regular-svg-icons'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import Vue from 'vue'

library.add(fal.faFile)
library.add(fal.faFolder)

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
library.add(faChevronDown)
library.add(faTerminal)
library.add(faCompress)
library.add(faCommentAltSmile)
library.add(faSearch)
library.add(faTimes)
library.add(faKeySkeleton)
library.add(faCalendarDay)
library.add(faSkull)
library.add(faHistory)
library.add(faTrash)
library.add(faHeart)
library.add(faTh)
library.add(faThList)
library.add(faThLarge)
library.add(faBackspace)
library.add(faShoppingBag)
library.add(faShoppingBagFull)
library.add(faShoppingCart)
library.add(faHeartFull)
library.add(faCubes)
library.add(faPalette)
library.add(faCrown)
library.add(faEllipsisH)
library.add(faInfoCircle)
library.add(faIdBadge)
library.add(faClock)

Vue.component('FontAwesomeIcon', FontAwesomeIcon)
