export function formatDuration(duration: number) {
  const d = Math.floor(duration)
  const h = Math.floor(d / 3600) % 60
  const m = Math.floor(d / 60) % 60
  const s = d % 60
  if (h) {
    return `${pad(h)}:${pad(m)}:${pad(s)}`
  }
  return `${pad(m)}:${pad(s)}`
}

function pad(val: number): string {
  return String(val).padStart(2, '0')
}
