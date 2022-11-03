import { SafeArea } from 'capacitor-plugin-safe-area'

type KeyboardEventDetail = {
  height: number
}

const dirs = ['top', 'left', 'right', 'bottom']

export default async function () {
  const root = document.querySelector(':root') as HTMLElement
  if (!root.style) {
    return
  }
  const insets = (await SafeArea.getSafeAreaInsets()).insets as any
  for (const dir of dirs) {
    root.style.setProperty(
      `--safe-area-inset-${dir}`,
      insets[dir] > 0 ? `${insets[dir]}px` : `env(safe-area-inset-${dir})`,
    )
  }

  root.style.setProperty('--keyboard-height', '0px')
  window.addEventListener('keyboardHeight', (e) => {
    const { detail } = e as CustomEvent<KeyboardEventDetail>
    root.style.setProperty('--keyboard-height', `${detail.height}px`)
  })
}
