<template>
  <div>
    <info-icon size="1.5x" class="info-icon" @click="toggleShowModal" />

    <div v-if="showModal" class="modal-overlay" @click="toggleShowModal">
      <div class="modal">
        <div class="modal-content">
          <div class="icon-container">
            <info-icon size="1.5x" />
          </div>
          <div class="body">
            <div class="heading">
              <info-icon size="1.5x" class="info-icon-mobile" />

              <TypographyText as="h2" color="light" font="heading">
                <slot name="title" />
              </TypographyText>
            </div>

            <TypographyText color="light" class="subtitle">
              <slot name="subtitle" />
            </TypographyText>
          </div>
        </div>
      </div>
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
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
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
.info-icon {
  cursor: pointer;

  &:hover {
    color: @satellite-color;
  }
}

.modal-overlay {
  &:extend(.background-semitransparent-light);
  &:extend(.blur);
  &:extend(.flex-justify-content-centered);
  &:extend(.absolute-coverage);
  flex-direction: column;
  align-items: center;
  padding: 16px;
  margin: auto;
  width: 100%;
  height: 100%;
  animation: zoom-in-zoom-out @animation-speed ease-out;
  &:extend(.third-layer);

  .modal {
    margin-bottom: @normal-spacing;
    padding: 16px;
    &:extend(.background-semitransparent-dark);
    &:extend(.round-corners);
    &:extend(.bordered);

    .modal-content {
      display: flex;
      gap: 16px;

      .icon-container {
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
}

@media only screen and (max-width: @mobile-breakpoint) {
  .modal-overlay {
    .modal {
      .modal-content {
        .icon-container {
          display: none;
        }

        .body {
          align-items: center;
          gap: 16px;

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
}
</style>
