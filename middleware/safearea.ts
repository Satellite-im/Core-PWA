import { SafeArea } from 'capacitor-plugin-safe-area'

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
}
