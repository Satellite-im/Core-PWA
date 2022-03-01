import { stripEXIF } from '../../utilities/EXIF'
import { isNSFW } from '../../utilities/NSFW'
import Security from './Security'

describe('check properties', () => {
  it('check stripEXIF', () => {
    const inst: any = new Security()
    expect(inst.stripEXIF).toEqual(stripEXIF)
  })
  it('check isNSFW', () => {
    const inst: any = new Security()
    expect(inst.isNSFW).toEqual(isNSFW)
  })
})
