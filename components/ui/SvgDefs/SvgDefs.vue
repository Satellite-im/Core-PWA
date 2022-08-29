<template>
  <svg width="0" height="0" viewBox="0 0 0 0">
    <defs>
      <mask id="circle-mask">
        <circle cx="20" cy="20" r="20" fill="white" />
        <rect
          width="18"
          height="18"
          color="black"
          rx="9"
          ry="9"
          x="25"
          y="25"
        />
      </mask>
      <mask id="mobile-mask">
        <circle cx="20" cy="20" r="20" fill="white" />
        <rect
          width="18"
          height="24"
          x="25"
          y="19"
          color="black"
          rx="4"
          ry="4"
        />
      </mask>
      <mask id="typing-mask">
        <circle cx="20" cy="20" r="20" fill="white" />
        <rect width="34" height="18" color="black" rx="9" ry="9" x="9" y="25" />
      </mask>
      <mask id="mask-state-online">
        <rect width="12" height="12" fill="white" rx="6" ry="6" y="6" x="16" />
      </mask>
      <mask id="mask-state-offline">
        <rect width="12" height="12" fill="white" rx="6" ry="6" y="6" x="16" />
      </mask>
      <mask id="mask-state-away">
        <rect width="12" height="12" fill="white" rx="6" ry="6" y="6" x="16" />
      </mask>
      <mask id="mask-state-busy">
        <rect width="12" height="12" fill="white" rx="6" ry="6" y="6" x="16" />
        <rect width="8" height="4" fill="black" rx="1" ry="1" y="10" x="18" />
      </mask>
      <mask id="mask-state-typing">
        <rect width="28" height="12" fill="white" rx="6" ry="6" y="6" x="0" />
      </mask>
      <mask id="mask-state-mobile">
        <rect width="12" height="18" fill="white" rx="2" ry="2" y="0" x="16" />
        <rect width="10" height="16" fill="black" rx="1" ry="1" y="1" x="17" />
        <rect width="2" height="2" fill="white" rx="2" ry="2" y="12" x="21" />
      </mask>
    </defs>
  </svg>
</template>
