<template src="./NewMessage.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState } from 'vuex'
import { ArrowLeftIcon, PencilIcon } from 'satellite-lucide-icons'
import { DataStateType } from '~/store/dataState/types'

export default Vue.extend({
  components: {
    ArrowLeftIcon,
    PencilIcon,
  },
  layout: 'message',
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
     * @method searchResult DocsTODO
     * @description
     * @example
     */
    searchResult() {
      return this.friends.all.filter((user: User) =>
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
     * @description swipe back to home
     */
    goBack() {
      this.$store.commit('ui/setSwiperSlideIndex', 0)
    },
  },
})
</script>

<style scoped lang="less" src="./NewMessage.less"></style>
