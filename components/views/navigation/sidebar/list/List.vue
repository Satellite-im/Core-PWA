<template>
  <div class="list hover-scroll">
    <SidebarListItem
      v-for="conversation in filteredConversations"
      :key="conversation.id"
      :conversation-id="conversation.id"
    />
    <div v-if="!filteredConversations.length" class="empty-friends-wrapper">
      <TypographyText v-if="filter" color="dark">
        {{ $t('ui.no_results') }}
      </TypographyText>
      <FriendsEmptyMessage v-else display-image />
    </div>
  </div>
</template>

<script setup lang="ts">
import fuzzysort from 'fuzzysort'
import { computed, ComputedRef } from 'vue'
import { conversationHooks } from '~/components/compositions/conversations'
import { Conversation } from '~/libraries/Iridium/chat/types'

const props = defineProps({
  filter: {
    type: String,
    required: true,
  },
})

const { sortedConversations } = conversationHooks()

const filteredConversations: ComputedRef<Conversation[]> = computed(() => {
  if (!props.filter) {
    return sortedConversations.value
  }
  return fuzzysort
    .go(props.filter, sortedConversations.value, { key: 'name' })
    .map((result) => result.obj)
})
</script>

<style scoped lang="less">
.list {
  overflow-y: auto;
  padding-bottom: 16px;
  flex-grow: 1;

  .empty-friends-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 16px 16px;

    @media (max-width: @mobile-breakpoint) {
      height: 100%;
      padding-bottom: 0;
    }
  }
}
</style>
