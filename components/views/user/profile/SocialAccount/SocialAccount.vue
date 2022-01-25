<template src="./SocialAccount.html"></template>

<script lang="ts">
import {
  GithubIcon,
  FacebookIcon,
  LinkedinIcon,
  TwitterIcon,
  YoutubeIcon,
  VerifiedIcon,
  ExternalLinkIcon,
} from 'satellite-lucide-icons'
import Vue, { PropType } from 'vue'
import { SocialAccountTypesEnum } from '~/libraries/Enums/enums'

export default Vue.extend({
  components: {
    GithubIcon,
    FacebookIcon,
    LinkedinIcon,
    TwitterIcon,
    YoutubeIcon,
    VerifiedIcon,
    ExternalLinkIcon,
  },
  props: {
    fullName: {
      type: String,
      default: '',
    },
    accountType: {
      type: String as PropType<SocialAccountTypesEnum>,
      default: SocialAccountTypesEnum.FACEBOOK,
    },
    username: {
      type: String,
      default: '',
    },
    profileUrl: {
      type: String,
      default: '',
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      SocialAccountTypesEnum,
      socialIcons: {
        [SocialAccountTypesEnum.GITHUB]: GithubIcon,
        [SocialAccountTypesEnum.FACEBOOK]: FacebookIcon,
        [SocialAccountTypesEnum.LINKEDIN]: LinkedinIcon,
        [SocialAccountTypesEnum.TWITTER]: TwitterIcon,
        [SocialAccountTypesEnum.YOUTUBE]: YoutubeIcon,
      },
    }
  },
})
</script>

<style scoped lang="less" src="./SocialAccount.less"></style>
