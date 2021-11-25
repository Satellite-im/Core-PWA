import Security from '../libraries/Security/Security'

describe('Test class Security', () => {
const security = new Security()

it('Security-stripEXIF', () => {
// Arguments
const stripEXIF1 = undefined!

// Property call
security.stripEXIF = stripEXIF1
const result = security.stripEXIF

// Expect result
expect(result).toEqual(stripEXIF1)
})

it('Security-isNSFW', () => {
// Arguments
const isNSFW1 = undefined!

// Property call
security.isNSFW = isNSFW1
const result = security.isNSFW

// Expect result
expect(result).toEqual(isNSFW1)
})

})
