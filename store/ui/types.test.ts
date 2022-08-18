import { expect } from '@jest/globals'
import { Flairs, Themes } from '~/store/ui/types'

describe('check flair constants', () => {
  const inst: any = Flairs

  it('should return the flair constants', () => {
    expect(inst).toMatchSnapshot()
  })

  it('should not return the flair constants', () => {
    expect(inst).not.toEqual({})
  })
})

describe('check theme constants', () => {
  const inst: any = Themes

  it('should return the theme constants', () => {
    expect(inst).toMatchSnapshot()
  })

  it('should not return the theme constants', () => {
    expect(inst).not.toEqual({})
  })
})
