<template>
  <div class="accounts">
    <UserProfileSocialAccount
      :account-type="SocialAccountTypesEnum.FACEBOOK"
      username="Lady_Caliope"
      profile-url="https://facebook.com/users/Lady_Caliope"
      verified
    />
    <UserProfileSocialAccount
      :account-type="SocialAccountTypesEnum.LINKEDIN"
      username="Lady_Caliope"
      profile-url="https://linkedin.com/in/Lady_Caliope"
      verified
    />
    <UserProfileSocialAccount
      :account-type="SocialAccountTypesEnum.GITHUB"
      username="Lady_Caliope"
      profile-url="https://github.com/Lady_Caliope"
    />
    <UserProfileSocialAccount
      :account-type="SocialAccountTypesEnum.TWITTER"
      username="Lady_Caliope"
      profile-url="https://twitter.com/Lady_Caliope"
      verified
    />
    <UserProfileSocialAccount
      :account-type="SocialAccountTypesEnum.YOUTUBE"
      username="Lady_Caliope"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { SocialAccountTypesEnum } from '~/libraries/Enums/enums'

export default Vue.extend({
  data() {
    return {
      SocialAccountTypesEnum,
    }
  },
})
</script>

<style scoped lang="less">
.accounts {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(256px, 1fr));
  gap: @normal-spacing;
}
</style>
