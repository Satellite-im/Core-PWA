import { Swiper, SwiperOptions } from 'swiper'
import { Capacitor, PluginListenerHandle } from '@capacitor/core'
import { Keyboard } from '@capacitor/keyboard'
import { App } from '@capacitor/app'

let backButtonHandle: PluginListenerHandle | undefined

export function DismissSoftwareKeyboard({
  swiper,
  on,
}: {
  swiper: Swiper
  on: (event: string, callback: () => void) => void
}) {
  on('activeIndexChange', () => {
    const activeElement = document.activeElement as HTMLElement | null
    if (activeElement) {
      activeElement.blur()
    }
    if (Capacitor.getPlatform() !== 'web') {
      Keyboard.hide()
    }
  })

  on('beforeInit', async () => {
    if (backButtonHandle) {
      backButtonHandle.remove()
    }

    backButtonHandle = await App.addListener('backButton', (e) => {
      if (!swiper) {
        return
      }
      if (swiper.activeIndex === 0) {
        App.minimizeApp()
        return
      }
      swiper.slidePrev(SWIPER_TRANSITION_SPEED)
    })
  })
}

export const SWIPER_TRANSITION_SPEED = 100 // ms

export function swiperOptions(options: SwiperOptions) {
  return {
    modules: [DismissSoftwareKeyboard],
    noSwipingClass: 'disable-swipe',
    allowSlidePrev: false,
    speed: SWIPER_TRANSITION_SPEED,
    resistanceRatio: 0,
    onTransitionEnd(swiper: Swiper) {
      swiper.params.speed = SWIPER_TRANSITION_SPEED
    },
    onTouchStart(swiper: Swiper) {
      swiper.params.speed = SWIPER_TRANSITION_SPEED
    },
    onTransitionStart(swiper: Swiper) {
      swiper.params.speed = SWIPER_TRANSITION_SPEED
    },
    ...options,
    on: {
      ...options.on,
      setTranslate(swiper: Swiper, translate: number) {
        options.on?.setTranslate?.(swiper, translate)

        swiper.slides.forEach((slide, index) => {
          const el = slide as HTMLElement
          const opacity = Math.max(
            0,
            Math.min(1, (swiper.width * index + translate) / swiper.width + 1),
          )
          el.style.setProperty('opacity', opacity.toString())
        })
      },
    },
  } as SwiperOptions
}
