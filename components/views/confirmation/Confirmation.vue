<template>
  <div class="confirmation">
    <div class="confirmation-main">
      <TypographyText color="flair" class="icon-container">
        <info-icon size="2x" />
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

        <TypographyText color="light" class="body">
          <slot name="body" />
        </TypographyText>
      </div>
    </div>

    <div class="buttons">
      <InteractablesButton
        :color="showConfirmButton ? 'light' : 'primary'"
        class="close-button"
        @click="close"
      >
        {{ $t('ui.close') }}
      </InteractablesButton>

      <InteractablesButton
        v-if="showConfirmButton"
        color="primary"
        class="confirm-button"
        @click="confirm"
      >
        {{ $t('ui.confirm') }}
      </InteractablesButton>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { InfoIcon } from 'satellite-lucide-icons'

export default Vue.extend({
  components: {
    InfoIcon,
  },
  props: {
    showConfirmButton: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    close() {
      this.$emit('close')
    },
    confirm() {
      this.$emit('confirm')
    },
  },
})
</script>

<style lang="less" scoped>
.confirmation {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  gap: 16px;
  height: 100%;
  max-width: 500px;
  padding: 24px;
  user-select: none;
  background: @modal-gradient;
  &:extend(.round-corners);

  .confirmation-main {
    display: flex;
    gap: 16px;
    margin-right: 24px;

    .icon-container {
      color: @dark;
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

  .buttons {
    display: flex;
    gap: 8px;
    width: 100%;
    justify-content: flex-end;
  }
}

@media only screen and (max-width: @mobile-breakpoint) {
  .confirmation {
    max-width: @full;

    .icon-container {
      display: none;
    }

    .confirmation-main {
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

    .buttons {
      justify-content: center;
    }
  }
}
</style>
