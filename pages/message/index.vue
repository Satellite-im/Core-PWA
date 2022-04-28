<template src="./NewMessage.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState } from 'vuex'
import { ArrowLeftIcon, PencilIcon } from 'satellite-lucide-icons'
import { DataStateType } from '~/store/dataState/types'
import { Friend } from '~/types/ui/friends'

declare module 'vue/types/vue' {
  interface Vue {
    selectedAddress: string
  }
}
export default Vue.extend({
  components: {
    ArrowLeftIcon,
    PencilIcon,
  },
  data() {
    return {
      selectedAddress: '',
      search: '',
      result: [],
    }
  },
  computed: {
    DataStateType: () => DataStateType,
    ...mapState(['ui', 'dataState', 'media', 'friends', 'textile']),

    /**
     * @method searchResult
     * @description filter friends list by search key
     */
    searchResult() {
      return this.friends.all.filter((user: Friend) =>
        user.name.toLowerCase().includes(this.search.toLowerCase()),
      )
    },
  },
  watch: {
    search(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.selectedAddress = ''
      }
    },
  },
  methods: {
    /**
     * @method selectUserAddress
     * @description Select user address that wants to start chat
     * @example ---
     */
    selectUserAddress(address: string) {
      this.selectedAddress = address
    },
    /**
     * @method navigateToChat
     * @description navigate to chat page with selected address
     */
    navigateToChat() {
      if (this.selectedAddress === '') {
        return
      }
      this.$store.commit('ui/setSwiperSlideIndex', 1)
      this.$store.commit('ui/showSidebar', false)

      this.$router.push(`/chat/direct/${this.selectedAddress}`)
    },
    /**
     * @method goBack
     * @description navigate back
     */
    goBack() {
      this.$router.back()
    },
  },
})
</script>

<style scoped lang="less" src="./NewMessage.less"></style>
