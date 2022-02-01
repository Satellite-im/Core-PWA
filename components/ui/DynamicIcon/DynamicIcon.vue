<template>
  <span class="dynamic-icon">
    <download-icon v-if="icon === 'download'" :size="size" />
    <clock-icon v-if="icon === 'clock'" :size="size" />
    <trash-icon v-if="icon === 'trash'" :size="size" />
    <heart-icon v-if="icon === 'heart'" :size="size" />
    <folder-icon v-if="icon === 'folder'" :size="size" />
    <link-icon v-if="icon === 'link'" :size="size" />
    <more-vertical-icon v-if="icon === 'more-vertical'" :size="size" />
    <phone-icon v-if="icon === 'phone'" :size="size" />
    <user-icon v-if="icon === 'user'" :size="size" />
    <search-icon v-if="icon === 'search'" :size="size" />
    <verified-icon v-if="icon === 'verified'" :size="size" />
    <check-icon v-if="icon === 'check'" :size="size" />
    <plus-icon v-if="icon === 'plus'" :size="size" />
    <x-icon v-if="icon === 'x'" :size="size" />
    <message-square-icon v-if="icon === 'message-square'" :size="size" />
    <layout-icon v-if="icon === 'layout'" :size="size" />
  </span>
</template>
<script lang="ts">
import Vue, { PropType } from 'vue'

import {
  DownloadIcon,
  ClockIcon,
  TrashIcon,
  HeartIcon,
  FolderIcon,
  LinkIcon,
  MoreVerticalIcon,
  PhoneIcon,
  UserIcon,
  SearchIcon,
  CheckIcon,
  VerifiedIcon,
  PlusIcon,
  XIcon,
  MessageSquareIcon,
  LayoutIcon,
} from 'satellite-lucide-icons'

type Icon =
  | 'download'
  | 'clock'
  | 'trash'
  | 'heart'
  | 'folder'
  | 'link'
  | 'more-vertical'
  | 'phone'
  | 'user'
  | 'search'
  | 'check'
  | 'verified'
  | 'plus'
  | 'x'
  | 'message-square'
  | 'layout'

export default Vue.extend({
  components: {
    DownloadIcon,
    ClockIcon,
    TrashIcon,
    HeartIcon,
    FolderIcon,
    LinkIcon,
    MoreVerticalIcon,
    PhoneIcon,
    UserIcon,
    SearchIcon,
    CheckIcon,
    VerifiedIcon,
    PlusIcon,
    XIcon,
    MessageSquareIcon,
    LayoutIcon,
  },
  props: {
    size: {
      type: String,
      default: '1x',
    },
    icon: {
      type: String as PropType<Icon>,
      default: 'download',
    },
  },
})
</script>
<style scoped lang="less">
.dynamic-icon {
  display: inline-flex;
  align-content: center;
}
</style>
