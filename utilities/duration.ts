export function formatDuration(duration: number) {
  const d = Math.floor(duration)
  const s = d % 60
  const m = Math.floor(d / 60) % 60
  const h = Math.floor(d / 3600) % 60
  const mp = String(m).padStart(2, '0')
  const sp = String(s).padStart(2, '0')
  if (h) {
    const hp = String(h).padStart(2, '0')
    return `${hp}:${mp}:${sp}`
  }
  return `${mp}:${sp}`
}
