<template>
  <table class="table">
    <thead>
      <th>
        {{ $t('pages.files.browse.name') }}
        <filter-icon class="sort" size="1x" />
      </th>
      <th v-if="!$device.isMobile">
        {{ $t('pages.files.browse.modified') }}
        <filter-icon class="sort" size="1x" />
      </th>
      <th v-if="!$device.isMobile">
        {{ $t('pages.files.browse.type') }}
        <filter-icon class="sort" size="1x" />
      </th>
      <th v-if="!$device.isMobile">
        {{ $t('pages.files.browse.encrypted') }}
        <filter-icon class="sort" size="1x" />
      </th>
      <th>
        {{ $t('pages.files.browse.size') }}
        <filter-icon class="sort" size="1x" />
      </th>
      <th />
    </thead>
    <tbody>
      <tr v-for="i in rows" :key="i">
        <td class="filename">
          <div class="filename-item">
            <div class="placeholder-item icon" />
            <div class="placeholder-item" />
          </div>
        </td>
        <td v-if="!$device.isMobile" class="modified">
          <div class="placeholder-item" />
        </td>
        <td v-if="!$device.isMobile" class="type">
          <div class="placeholder-item" />
        </td>
        <td v-if="!$device.isMobile" class="encrypted">
          <div class="placeholder-item" />
        </td>
        <td class="size">
          <div class="placeholder-item" />
        </td>
        <td class="options">
          <div class="placeholder-item" />
        </td>
      </tr>
    </tbody>
  </table>
</template>
<script lang="ts">
import Vue from 'vue'

// @ts-ignore
import { FilterIcon } from 'satellite-lucide-icons'

export default Vue.extend({
  components: {
    FilterIcon,
  },
  props: {
    rows: {
      type: Number,
      default: 1,
    },
  },
})
</script>
<style scoped lang="less">
.table {
  &:extend(.full-width);
  font-size: @text-size;
  background: transparent;
  margin: 0;

  thead {
    th {
      &:extend(.font-secondary);
      border-bottom-width: 1px;
      border-bottom-color: @text-muted;
    }
  }

  tr {
    td {
      padding: 0.75rem;
      &:extend(.font-primary);
      border-bottom-color: @foreground;
    }
  }

  .centered {
    text-align: center;
  }

  .icon {
    width: 30px;
  }

  .filename,
  .modified {
    width: 230px;
  }
  .filename-item {
    display: flex;
    .icon {
      width: 20px;
      flex: none;
      margin-left: 0.25rem;
      margin-right: 1rem;
    }
  }
  .sort {
    font-size: 9pt;
    cursor: pointer;
  }

  .type {
    width: 200px;
    .placeholder-item {
      max-width: 120px;
    }
  }
  .options {
    width: 50px;
    cursor: pointer;
    .placeholder-item {
      width: 20px;
    }
  }

  .encrypted {
    width: 100px;
    .placeholder-item {
      width: 20px;
    }
  }
  .size {
    width: 100px;
    .placeholder-item {
      width: 40px;
    }
  }
}

@media only screen and (max-width: @mobile-breakpoint) {
  .table {
    min-width: @viewport-width - 20px;
  }
}

.placeholder-item {
  &::before {
    content: '';
    display: block;
    position: absolute;
    left: -150px;
    top: 0;
    height: @full;
    width: 75%;
    background: linear-gradient(
      to right,
      transparent 0%,
      @midground-alt @half,
      transparent @full
    );
    animation: load 1s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  }
  flex: 1;
  border-radius: 2px;
  height: 18px;
  position: relative;
  overflow: hidden;
  background: @midground;
}
</style>
