<template>
  <div class="user-picker">
    <div class="chips">
      <InteractablesChip
        v-for="friend in selected"
        :key="friend.did"
        :text="friend.name"
        :user="friend"
        size="xs"
        @delete="toggle(friend)"
      />
    </div>
    <InteractablesInput
      v-model="filter"
      size="xs"
      :placeholder="$t('friends.search_placeholder')"
    />
    <div class="users" :style="{ height: height }">
      <TypographyText
        v-if="!filteredFriends.length"
        class="empty-results-text"
        color="dark"
        size="sm"
      >
        {{ $t('ui.no_results') }}
      </TypographyText>
      <InteractablesUserPickerListItem
        v-for="friend in filteredFriends"
        v-else
        :key="friend.did"
        :friend="friend"
        :selected="isSelected(friend)"
        @click="toggle(friend)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, ComputedRef, Ref, watch } from 'vue'
import fuzzysort from 'fuzzysort'
import { User } from '~/libraries/Iridium/users/types'
import { friendsHooks } from '~/components/compositions/friends'

interface Props {
  height: string
  exclude?: User['did'][]
}
const props = withDefaults(defineProps<Props>(), {
  exclude: () => [],
})

interface Emits {
  (e: 'input', value: User[]): void
}
const emit = defineEmits<Emits>()

const { friends } = friendsHooks()
const selected: Ref<User[]> = ref([])
const filter: Ref<string> = ref('')

const friendsWithoutExcluded: ComputedRef<User[]> = computed(() => {
  return friends.value.filter((friend) => !props.exclude.includes(friend.did))
})

const filteredFriends: ComputedRef<User[]> = computed(() => {
  if (!filter.value) return friendsWithoutExcluded.value
  return fuzzysort
    .go(filter.value, friendsWithoutExcluded.value, {
      keys: ['name'],
    })
    .map((result) => result.obj)
})

const isSelected = (friend: User) => selected.value.includes(friend)

const toggle = (friend: User) => {
  if (isSelected(friend)) {
    selected.value = selected.value.filter((f) => f.did !== friend.did)
  } else {
    selected.value = [...selected.value, friend]
  }
  emit('input', selected.value)
}

watch(selected, (value: User[]) => emit('input', value))
</script>

<style scoped lang="less" src="./UserPicker.less"></style>
