<template>
  <div class="voice-user">
    <UiCircle type="random" :seed="user.address" :size="25" />
    <TypographyText class="voice-user-name">
      {{ user.name }}
    </TypographyText>
  </div>
</template>

<script>
export default {
  name: 'VoiceUser',
  props: ['user'],
  data() {
    return {
      collapsed: false,
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.voice-user {
  margin-left: 1rem;
  padding: 0.25rem;
  display: inline-flex;
}
.circle-icon {
  width: 20px;
  height: 20px;
  float: left;
}
.voice-user-name {
  padding-left: 5px;
  font-size: 11pt;
}
</style>
