<template>
  <div>
    <button class="info-icon-button" @click="toggleShowModal">
      <info-icon size="1.5x" />
    </button>

    <transition name="modal">
      <UiModal v-if="showModal" @close="() => toggleShowModal()">
        <div class="modal-content">
          <div class="modal-main">
            <TypographyText color="flair" class="icon-container">
              <info-icon size="1.5x" />
            </TypographyText>
            <div class="body">
              <div class="heading">
                <TypographyText class="info-icon-mobile" color="flair">
                  <info-icon size="1.5x" />
                </TypographyText>

                <TypographyText as="h2" color="light" font="heading">
                  <slot name="title" />
                </TypographyText>
              </div>

              <TypographyText color="light" class="subtitle">
                <slot name="subtitle" />
              </TypographyText>
            </div>
          </div>

          <InteractablesButton
            color="light"
            class="close-button"
            @click="() => toggleShowModal()"
          >
            <TypographyText color="light" font="heading">
              {{ $t('ui.close') }}
            </TypographyText>
          </InteractablesButton>
        </div>
      </UiModal>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { InfoIcon } from 'satellite-lucide-icons'

export default Vue.extend({
  components: {
    InfoIcon,
  },
  data() {
    return {
      showModal: false,
    }
  },
  methods: {
    toggleShowModal() {
      this.showModal = !this.showModal
    },
  },
})
</script>

<style lang="less" scoped>
.info-icon-button {
  cursor: pointer;
  transition: @animation-speed-long ease-in-out;

  &:hover {
    color: @satellite-color;
  }
}

.modal-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  height: 100%;
  max-width: 500px;
  padding: 16px;
  user-select: none;

  .modal-main {
    display: flex;
    gap: 16px;

    .icon-container {
      color: 'blue';
      padding: 3px 0;
    }

    .body {
      display: flex;
      flex-direction: column;
      gap: 8px;

      .heading {
        display: flex;
        align-items: center;
        gap: 8px;

        .info-icon-mobile {
          display: none;
        }
      }

      .subtitle {
        white-space: pre-line;
      }
    }
  }
}

@media only screen and (max-width: @mobile-breakpoint) {
  .modal-content {
    max-width: @full;

    .icon-container {
      display: none;
    }

    .modal-main {
      .body {
        align-items: center;

        .heading {
          .info-icon-mobile {
            display: inherit;
          }
        }

        .subtitle {
          text-align: center;
        }
      }
    }
  }
}
</style>
