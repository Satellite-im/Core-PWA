<template>
  <div class="accounts">
    <div class="columns is-desktop">
      <div class="column">
        <UserProfileSocialAccount
          :account-type="SocialAccountType.Facebook"
          username="Lady_Caliope"
          profile-url="https://facebook.com/users/Lady_Caliope"
          verified
        />
      </div>
      <div class="column">
        <UserProfileSocialAccount
          :account-type="SocialAccountType.Linkedin"
          username="Lady_Caliope"
          profile-url="https://linkedin.com/in/Lady_Caliope"
          verified
        />
      </div>
    </div>
    <div class="columns is-desktop">
      <div class="column">
        <UserProfileSocialAccount
          :account-type="SocialAccountType.Github"
          username="Lady_Caliope"
          profile-url="https://github.com/Lady_Caliope"
        />
      </div>
      <div class="column">
        <UserProfileSocialAccount
          :account-type="SocialAccountType.Twitter"
          username="Lady_Caliope"
          profile-url="https://twitter.com/Lady_Caliope"
          verified
        />
      </div>
    </div>
    <div class="columns is-desktop">
      <div class="column">
        <UserProfileSocialAccount
          :account-type="SocialAccountType.Youtube"
          username="Lady_Caliope"
        />
      </div>
      <div class="column"></div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { SocialAccountType } from '~/types/social/social'

export default Vue.extend({
  data() {
    return {
      SocialAccountType,
    }
  },
})
</script>
<style scoped lang="less">
.columns {
  margin-left: -0.4rem;
  margin-right: -0.4rem;
}
.column {
  padding: 0.4rem;
}
</style>
