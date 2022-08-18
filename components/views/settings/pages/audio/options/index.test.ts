import { expect } from '@jest/globals'
import {
  Bitrates,
  SampleSizes,
} from '~/components/views/settings/pages/audio/options/index'

describe('check Bitrates constants', () => {
  const inst: any = Bitrates

  it('should return the Bitrates constants', () => {
    expect(inst).toMatchSnapshot()
  })

  it('should not return the Bitrates constants', () => {
    expect(inst).not.toEqual({})
  })
})

describe('check SampleSizes constants', () => {
  const inst: any = SampleSizes

  it('should return the SampleSizes constants', () => {
    expect(inst).toMatchSnapshot()
  })

  it('should not return the SampleSizes constants', () => {
    expect(inst).not.toEqual({})
  })
})
