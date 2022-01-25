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
import { SocialAccountType } from '~/types/social/social'

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
      type: String as PropType<SocialAccountType>,
      default: SocialAccountType.Facebook,
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
      SocialAccountType,
      socialIcons: {
        [SocialAccountType.Github]: GithubIcon,
        [SocialAccountType.Facebook]: FacebookIcon,
        [SocialAccountType.Linkedin]: LinkedinIcon,
        [SocialAccountType.Twitter]: TwitterIcon,
        [SocialAccountType.Youtube]: YoutubeIcon,
      },
    }
  },
})
</script>

<style scoped lang="less" src="./SocialAccount.less"></style>
