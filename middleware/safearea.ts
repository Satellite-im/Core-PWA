import { SafeArea } from 'capacitor-plugin-safe-area'

type KeyboardEventDetail = {
  height: number
  duration?: number
}

const dirs = ['top', 'left', 'right', 'bottom']

export default async function () {
  const root = document.querySelector(':root') as HTMLElement
  if (!root.style) {
    return
  }
  const insets = (await SafeArea.getSafeAreaInsets()).insets as any
  for (const dir of dirs) {
    root.style.setProperty(`--safe-area-inset-${dir}`, `${insets[dir]}px`)
  }

  const app = document.querySelector('#app') as HTMLElement
  window.addEventListener('keyboardHeight', (e) => {
    const { detail } = e as CustomEvent<KeyboardEventDetail>
    if (detail.duration) {
      root.style.setProperty(
        `--keyboard-animation-duration`,
        `${detail.duration}px`,
      )
    }
    root.style.setProperty(`--safe-area-inset-bottom`, `${detail.height}px`)
  })
}
