import { UIState } from './types'
import * as getters from '~/store/ui/getters'
import InitialUIState from '~/store/ui/state'

let instance: any
let localState: UIState

describe('Test ui/getters', () => {
  beforeEach(() => {
    instance = getters.default
    localState = InitialUIState()
  })

  it('should sort most used emojis', () => {
    // from order 1,3,2
    localState.mostEmojiUsed = [
      {
        code: 'thumbup',
        content: '👍',
        count: 1,
      },
      {
        code: 'flag_id',
        content: '🇮🇩',
        count: 3,
      },
      {
        code: 'pray',
        content: '🙏 ',
        count: 2,
      },
    ]

    const result = instance.getSortedMostUsedEmojis(localState)

    // from order 1,3,2 to 3,2,1

    expect(result[0]).toEqual({ code: 'flag_id', content: '🇮🇩', count: 3 })
    expect(result[1]).toEqual({ code: 'pray', content: '🙏 ', count: 2 })
    expect(result[2]).toEqual({ code: 'thumbup', content: '👍', count: 1 })
  })

  it('should sort recent glyphs', () => {
    // from order 1,3,2
    localState.recentGlyphs = [
      {
        pack: {
          name: 'Count 1',
          artist: 'Dina Brodsky',
          id: '0903',
          stickerURLs: [
            'https://satellite.mypinata.cloud/ipfs/QmS1NEujgAT8iogdK3jsQzDf751U6LCSpCNojg1JJhs3zz/$1/hawk.webp',
            'https://satellite.mypinata.cloud/ipfs/QmS1NEujgAT8iogdK3jsQzDf751U6LCSpCNojg1JJhs3zz/$1/ducklings.webp',
            'https://satellite.mypinata.cloud/ipfs/QmS1NEujgAT8iogdK3jsQzDf751U6LCSpCNojg1JJhs3zz/$1/owl.webp',
            'https://satellite.mypinata.cloud/ipfs/QmS1NEujgAT8iogdK3jsQzDf751U6LCSpCNojg1JJhs3zz/$1/penguins.webp',
            'https://satellite.mypinata.cloud/ipfs/QmS1NEujgAT8iogdK3jsQzDf751U6LCSpCNojg1JJhs3zz/$1/robin.webp',
            'https://satellite.mypinata.cloud/ipfs/QmS1NEujgAT8iogdK3jsQzDf751U6LCSpCNojg1JJhs3zz/$1/stork.webp',
            'https://satellite.mypinata.cloud/ipfs/QmS1NEujgAT8iogdK3jsQzDf751U6LCSpCNojg1JJhs3zz/$1/yellow_bird.webp',
          ],
        },
        url: 'https://satellite.mypinata.cloud/ipfs/QmS1NEujgAT8iogdK3jsQzDf751U6LCSpCNojg1JJhs3zz/$1/ducklings.webp',
        count: 1,
      },
      {
        pack: {
          name: 'Count 3',
          artist: 'John Treanor',
          id: '0123',
          stickerURLs: [
            'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/AHH.gif',
            'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/AHHcloseup.gif',
            'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/Coy_02.gif',
            'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/Cry.gif',
            'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/Cry2.gif',
            'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/Laugh.webp',
            'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/Luv.gif',
            'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/Luv_02.gif',
            'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/Sad3.gif',
            'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/ThumbsDownNew.gif',
            'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/ThumbsUP.gif',
            'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/ThumbsUPNew.gif',
          ],
        },
        url: 'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/Coy_02.gif',
        count: 3,
      },
      {
        pack: {
          name: 'Count 2',
          artist: 'John Treanor',
          id: '0123',
          stickerURLs: [
            'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/AHH.gif',
            'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/AHHcloseup.gif',
            'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/Coy_02.gif',
            'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/Cry.gif',
            'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/Cry2.gif',
            'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/Laugh.webp',
            'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/Luv.gif',
            'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/Luv_02.gif',
            'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/Sad3.gif',
            'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/ThumbsDownNew.gif',
            'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/ThumbsUP.gif',
            'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/ThumbsUPNew.gif',
          ],
        },
        url: 'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/ThumbsUP.gif',
        count: 2,
      },
    ]

    const result = instance.getSortedRecentGlyphs(localState)

    // from order 1,3,2 to 3,2,1

    expect(result[0]).toEqual({
      pack: {
        name: 'Count 3',
        artist: 'John Treanor',
        id: '0123',
        stickerURLs: [
          'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/AHH.gif',
          'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/AHHcloseup.gif',
          'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/Coy_02.gif',
          'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/Cry.gif',
          'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/Cry2.gif',
          'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/Laugh.webp',
          'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/Luv.gif',
          'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/Luv_02.gif',
          'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/Sad3.gif',
          'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/ThumbsDownNew.gif',
          'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/ThumbsUP.gif',
          'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/ThumbsUPNew.gif',
        ],
      },
      url: 'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/Coy_02.gif',
      count: 3,
    })
    expect(result[1]).toEqual({
      pack: {
        name: 'Count 2',
        artist: 'John Treanor',
        id: '0123',
        stickerURLs: [
          'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/AHH.gif',
          'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/AHHcloseup.gif',
          'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/Coy_02.gif',
          'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/Cry.gif',
          'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/Cry2.gif',
          'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/Laugh.webp',
          'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/Luv.gif',
          'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/Luv_02.gif',
          'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/Sad3.gif',
          'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/ThumbsDownNew.gif',
          'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/ThumbsUP.gif',
          'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/ThumbsUPNew.gif',
        ],
      },
      url: 'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/ThumbsUP.gif',
      count: 2,
    })
    expect(result[2]).toEqual({
      pack: {
        name: 'Count 1',
        artist: 'Dina Brodsky',
        id: '0903',
        stickerURLs: [
          'https://satellite.mypinata.cloud/ipfs/QmS1NEujgAT8iogdK3jsQzDf751U6LCSpCNojg1JJhs3zz/$1/hawk.webp',
          'https://satellite.mypinata.cloud/ipfs/QmS1NEujgAT8iogdK3jsQzDf751U6LCSpCNojg1JJhs3zz/$1/ducklings.webp',
          'https://satellite.mypinata.cloud/ipfs/QmS1NEujgAT8iogdK3jsQzDf751U6LCSpCNojg1JJhs3zz/$1/owl.webp',
          'https://satellite.mypinata.cloud/ipfs/QmS1NEujgAT8iogdK3jsQzDf751U6LCSpCNojg1JJhs3zz/$1/penguins.webp',
          'https://satellite.mypinata.cloud/ipfs/QmS1NEujgAT8iogdK3jsQzDf751U6LCSpCNojg1JJhs3zz/$1/robin.webp',
          'https://satellite.mypinata.cloud/ipfs/QmS1NEujgAT8iogdK3jsQzDf751U6LCSpCNojg1JJhs3zz/$1/stork.webp',
          'https://satellite.mypinata.cloud/ipfs/QmS1NEujgAT8iogdK3jsQzDf751U6LCSpCNojg1JJhs3zz/$1/yellow_bird.webp',
        ],
      },
      url: 'https://satellite.mypinata.cloud/ipfs/QmS1NEujgAT8iogdK3jsQzDf751U6LCSpCNojg1JJhs3zz/$1/ducklings.webp',
      count: 1,
    })
  })

  it('should sort most used emojis 1-2-3', () => {
    // from order 1,2,3
    localState.mostEmojiUsed = [
      {
        code: 'thumbup',
        content: '👍',
        count: 1,
      },
      {
        code: 'pray',
        content: '🙏 ',
        count: 2,
      },
      {
        code: 'flag_id',
        content: '🇮🇩',
        count: 3,
      },
    ]

    const result = instance.getSortedMostUsedEmojis(localState)

    // from order 1,3,2 to 3,2,1

    expect(result[0]).toEqual({ code: 'flag_id', content: '🇮🇩', count: 3 })
    expect(result[1]).toEqual({ code: 'pray', content: '🙏 ', count: 2 })
    expect(result[2]).toEqual({ code: 'thumbup', content: '👍', count: 1 })
  })

  it('should sort recent glyphs 1-2-3', () => {
    // from order 1,2,3
    localState.recentGlyphs = [
      {
        pack: {
          name: 'Count 1',
          artist: 'Dina Brodsky',
          id: '0903',
          stickerURLs: [
            'https://satellite.mypinata.cloud/ipfs/QmS1NEujgAT8iogdK3jsQzDf751U6LCSpCNojg1JJhs3zz/$1/hawk.webp',
            'https://satellite.mypinata.cloud/ipfs/QmS1NEujgAT8iogdK3jsQzDf751U6LCSpCNojg1JJhs3zz/$1/ducklings.webp',
            'https://satellite.mypinata.cloud/ipfs/QmS1NEujgAT8iogdK3jsQzDf751U6LCSpCNojg1JJhs3zz/$1/owl.webp',
            'https://satellite.mypinata.cloud/ipfs/QmS1NEujgAT8iogdK3jsQzDf751U6LCSpCNojg1JJhs3zz/$1/penguins.webp',
            'https://satellite.mypinata.cloud/ipfs/QmS1NEujgAT8iogdK3jsQzDf751U6LCSpCNojg1JJhs3zz/$1/robin.webp',
            'https://satellite.mypinata.cloud/ipfs/QmS1NEujgAT8iogdK3jsQzDf751U6LCSpCNojg1JJhs3zz/$1/stork.webp',
            'https://satellite.mypinata.cloud/ipfs/QmS1NEujgAT8iogdK3jsQzDf751U6LCSpCNojg1JJhs3zz/$1/yellow_bird.webp',
          ],
        },
        url: 'https://satellite.mypinata.cloud/ipfs/QmS1NEujgAT8iogdK3jsQzDf751U6LCSpCNojg1JJhs3zz/$1/ducklings.webp',
        count: 1,
      },
      {
        pack: {
          name: 'Count 2',
          artist: 'John Treanor',
          id: '0123',
          stickerURLs: [
            'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/AHH.gif',
            'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/AHHcloseup.gif',
            'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/Coy_02.gif',
            'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/Cry.gif',
            'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/Cry2.gif',
            'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/Laugh.webp',
            'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/Luv.gif',
            'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/Luv_02.gif',
            'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/Sad3.gif',
            'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/ThumbsDownNew.gif',
            'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/ThumbsUP.gif',
            'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/ThumbsUPNew.gif',
          ],
        },
        url: 'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/ThumbsUP.gif',
        count: 2,
      },
      {
        pack: {
          name: 'Count 3',
          artist: 'John Treanor',
          id: '0123',
          stickerURLs: [
            'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/AHH.gif',
            'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/AHHcloseup.gif',
            'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/Coy_02.gif',
            'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/Cry.gif',
            'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/Cry2.gif',
            'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/Laugh.webp',
            'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/Luv.gif',
            'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/Luv_02.gif',
            'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/Sad3.gif',
            'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/ThumbsDownNew.gif',
            'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/ThumbsUP.gif',
            'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/ThumbsUPNew.gif',
          ],
        },
        url: 'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/Coy_02.gif',
        count: 3,
      },
    ]

    const result = instance.getSortedRecentGlyphs(localState)

    // from order 1,3,2 to 3,2,1

    expect(result[0]).toEqual({
      pack: {
        name: 'Count 3',
        artist: 'John Treanor',
        id: '0123',
        stickerURLs: [
          'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/AHH.gif',
          'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/AHHcloseup.gif',
          'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/Coy_02.gif',
          'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/Cry.gif',
          'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/Cry2.gif',
          'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/Laugh.webp',
          'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/Luv.gif',
          'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/Luv_02.gif',
          'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/Sad3.gif',
          'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/ThumbsDownNew.gif',
          'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/ThumbsUP.gif',
          'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/ThumbsUPNew.gif',
        ],
      },
      url: 'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/Coy_02.gif',
      count: 3,
    })
    expect(result[1]).toEqual({
      pack: {
        name: 'Count 2',
        artist: 'John Treanor',
        id: '0123',
        stickerURLs: [
          'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/AHH.gif',
          'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/AHHcloseup.gif',
          'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/Coy_02.gif',
          'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/Cry.gif',
          'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/Cry2.gif',
          'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/Laugh.webp',
          'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/Luv.gif',
          'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/Luv_02.gif',
          'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/Sad3.gif',
          'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/ThumbsDownNew.gif',
          'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/ThumbsUP.gif',
          'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/ThumbsUPNew.gif',
        ],
      },
      url: 'https://satellite.mypinata.cloud/ipfs/QmXmpYrNUankzCCWR1U5ASDHcwhSJynQayMy1gT7RTU4ck/$1/ThumbsUP.gif',
      count: 2,
    })
    expect(result[2]).toEqual({
      pack: {
        name: 'Count 1',
        artist: 'Dina Brodsky',
        id: '0903',
        stickerURLs: [
          'https://satellite.mypinata.cloud/ipfs/QmS1NEujgAT8iogdK3jsQzDf751U6LCSpCNojg1JJhs3zz/$1/hawk.webp',
          'https://satellite.mypinata.cloud/ipfs/QmS1NEujgAT8iogdK3jsQzDf751U6LCSpCNojg1JJhs3zz/$1/ducklings.webp',
          'https://satellite.mypinata.cloud/ipfs/QmS1NEujgAT8iogdK3jsQzDf751U6LCSpCNojg1JJhs3zz/$1/owl.webp',
          'https://satellite.mypinata.cloud/ipfs/QmS1NEujgAT8iogdK3jsQzDf751U6LCSpCNojg1JJhs3zz/$1/penguins.webp',
          'https://satellite.mypinata.cloud/ipfs/QmS1NEujgAT8iogdK3jsQzDf751U6LCSpCNojg1JJhs3zz/$1/robin.webp',
          'https://satellite.mypinata.cloud/ipfs/QmS1NEujgAT8iogdK3jsQzDf751U6LCSpCNojg1JJhs3zz/$1/stork.webp',
          'https://satellite.mypinata.cloud/ipfs/QmS1NEujgAT8iogdK3jsQzDf751U6LCSpCNojg1JJhs3zz/$1/yellow_bird.webp',
        ],
      },
      url: 'https://satellite.mypinata.cloud/ipfs/QmS1NEujgAT8iogdK3jsQzDf751U6LCSpCNojg1JJhs3zz/$1/ducklings.webp',
      count: 1,
    })
  })

  it('should sort all unseen notifications and return error', () => {
    // from order 1,2,3
    localState.notifications = [
      {
        at: 1,
        state: 'READ',
      },
      {
        at: 3,
        state: 'UNREAD',
      },
      {
        at: 2,
        state: 'READ',
      },
    ]

    try {
      const result = instance.allUnseenNotifications(localState)
    } catch (error) {
      // Should return TypeError because AlertsState does not exist anymore.
      // Expected error: [TypeError: Cannot read properties of undefined (reading 'UNREAD')]
    }
  })
})
