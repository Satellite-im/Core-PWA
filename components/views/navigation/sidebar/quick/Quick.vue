<template>
  <div ref="quickChat" class="quick-chat" :class="{ mobile: $device.isMobile }">
    <InteractablesClose @click="emit('toggle')" />
    <TypographyText font="heading" size="sm" color="dark">
      {{ $t('pages.chat.new_chat') }}
    </TypographyText>
    <TypographyText size="sm" color="dark">
      {{ $t('pages.chat.new_chat_description') }}
    </TypographyText>
    <InteractablesUserPicker v-model="selected" height="220px" />
    <template v-if="selected.length > 1">
      <InteractablesInput
        v-model.trim="name"
        size="xs"
        :placeholder="$t('pages.chat.new_group_name')"
        :min-length="Config.chat.groupNameMinLength"
        :max-length="Config.chat.groupNameMaxLength"
        :invalid="isInvalidName && Boolean(error)"
        :error="error"
        @submit="confirm"
      />
    </template>
    <InteractablesButton
      :text="
        selected.length > 1
          ? $t('pages.chat.create_group')
          : $t('pages.chat.chat_now')
      "
      :loading="isLoading"
      :disabled="!selected.length"
      @click="confirm"
    />
  </div>
</template>

<script setup lang="ts">
import { useNuxtApp } from '@nuxt/bridge/dist/runtime/app'
import { computed, ComputedRef, ref, Ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { Config } from '~/config'
import iridium from '~/libraries/Iridium/IridiumManager'
import { User } from '~/libraries/Iridium/users/types'
import { handleEsc } from '~/components/compositions/events'

handleEsc(() => {
  emit('toggle')
})

const { $device, $router, $i18n } = useNuxtApp()

const emit = defineEmits(['toggle'])

const selected: Ref<User[]> = ref([])
const isLoading: Ref<boolean> = ref(false)
const error: Ref<string> = ref('')
const name: Ref<string> = ref('')

const quickChat = ref<HTMLElement>()

onClickOutside(quickChat, () => {
  emit('toggle')
})

const isInvalidName: ComputedRef<boolean> = computed(() => {
  return (
    !name.value ||
    name.value.length < Config.chat.groupNameMinLength ||
    name.value.length > Config.chat.groupNameMaxLength
  )
})

async function confirm() {
  error.value = ''
  // if only 1 friend, direct to DM instead
  if (selected.value.length === 1) {
    const id = iridium.chat.directConversationIdFromDid(selected.value[0].did)
    emit('toggle')
    $router.push(`${$device.isMobile ? '/mobile' : ''}/chat/${id}`)
    return
  }
  // validate group name
  if (isInvalidName.value) {
    error.value = $i18n.t('errors.chat.group_name', {
      min: Config.chat.groupNameMinLength,
      max: Config.chat.groupNameMaxLength,
    })
    return
  }

  // create group
  isLoading.value = true
  const participants = [
    iridium.id,
    ...selected.value.map((friend) => friend.did),
  ]
  try {
    const id = await iridium.chat.createGroupConversation({
      name: name.value,
      participants,
    })
    emit('toggle')
    $router.push(`${$device.isMobile ? '/mobile' : ''}/chat/${id}`)
  } catch (e: any) {
    error.value = $i18n.t(e.message)
  }
}
</script>

<style scoped lang="less" src="./Quick.less"></style>
