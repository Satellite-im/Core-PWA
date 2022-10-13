export type AnimationConfig = {
  timing: (v: number) => number
  draw: (v: number) => void
  duration: number
}

export function easeOutBack(v: number): number {
  const c1 = 1.2
  const c3 = c1 + 1

  return 1 + c3 * Math.pow(v - 1, 5) + c1 * Math.pow(v - 1, 4)
}

export function animate(config: AnimationConfig) {
  const { timing, draw, duration } = config
  const start = performance.now()

  const animate = (time: number) => {
    let timeFraction = (time - start) / duration
    if (timeFraction > 1) {
      timeFraction = 1
    }

    const progress = timing(timeFraction)
    draw(progress)

    if (timeFraction < 1) {
      requestAnimationFrame(animate)
    }
  }
  requestAnimationFrame(animate)
}

export function lerp(x: number, y: number, a: number) {
  return x * (1 - a) + y * a
}
