<template>
  <div class="result-item">
    <UiCircle
      class="avatar"
      type="random"
      :seed="data.user.address"
      :size="38"
      :source="data.user.avatar"
    />
    <div class="content">
      <div class="username">{{ data.user.name }}</div>
      <div class="message">{{ data.payload }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { SearchResultItem } from '~/types/search/search'

declare module 'vue/types/vue' {
  interface Vue {}
}
export default Vue.extend({
  props: {
    data: {
      type: Object as PropType<SearchResultItem>,
      default: {} as SearchResultItem,
    },
  },
})
</script>
<style scoped lang="less">
.result-item {
  padding: 10px;
  border: 2px solid @light-gray;
  background-color: #101010;
  margin: 8px 0;
  border-radius: 8px;
  display: flex;
  width: 100%;
  .avatar {
    margin-right: 10px;
  }
  .username {
    font-size: @title-text;
    font-weight: bold;
  }
  .message {
    font-size: @text-size;
    background-color: transparent;
    text-overflow: inherit;
    white-space: pre-wrap;
  }
}
</style>
