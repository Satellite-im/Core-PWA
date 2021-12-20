
import BucketManager from "../libraries/Textile/BucketManager"

describe('Test class BucketManager', () => {

it('BucketManager-init', () => {
// Arguments
const textile1 = undefined!
const identity1 = undefined!
const prefix1 = 'Oha'

// Method call
const bucketManager = new BucketManager(textile1, identity1, prefix1)
 bucketManager.init()
})

it('BucketManager-removeFromIndex', () => {
// Arguments
const textile2 = undefined!
const identity2 = undefined!
const prefix2 = 'Oha'
const file1 = undefined!

// Method call
const bucketManager = new BucketManager(textile2, identity2, prefix2)
 bucketManager.removeFromIndex(file1)
})

it('BucketManager-addToIndex', () => {
// Arguments
const textile3 = undefined!
const identity3 = undefined!
const prefix3 = 'Oha'
const file2 = undefined!
const root1 = undefined!
const remotePath1 = 'Oha'

// Method call
const bucketManager = new BucketManager(textile3, identity3, prefix3)
 bucketManager.addToIndex(file2, root1, remotePath1)
})

it('BucketManager-ensureIndex', async () => {
// Arguments
const textile4 = undefined!
const identity4 = undefined!
const prefix4 = 'Oha'

// Method call
const bucketManager = new BucketManager(textile4, identity4, prefix4)
const result = await bucketManager.ensureIndex()

// Expect result
expect(result).to.be.not.undefined!
})

it('BucketManager-fetchIndex', async () => {
// Arguments
const textile5 = undefined!
const identity5 = undefined!
const prefix5 = 'Oha'

// Method call
const bucketManager = new BucketManager(textile5, identity5, prefix5)
const result = await bucketManager.fetchIndex()

// Expect result
expect(result).not.toBe('undefined')
})

it('BucketManager-removeFile', () => {
// Arguments
const textile6 = undefined!
const identity6 = undefined!
const prefix6 = 'Oha'
const file3 = undefined!
const path1 = 'Oha'

// Method call
const bucketManager = new BucketManager(textile6, identity6, prefix6)
 bucketManager.removeFile(file3, path1)
})

it('BucketManager-pushFile', async () => {
// Arguments
const textile7 = undefined!
const identity7 = undefined!
const prefix7 = 'Oha'
const file4 = undefined!
const path2 = 'Oha'
const progress1 = undefined!

// Method call
const bucketManager = new BucketManager(textile7, identity7, prefix7)
const result = await bucketManager.pushFile(file4, path2, progress1)

// Expect result
expect(result).not.toBe('undefined')
})

it('BucketManager-getBucket', async () => {
// Arguments
const textile8 = undefined!
const identity8 = undefined!
const prefix8 = 'Oha'

// Method call
const bucketManager = new BucketManager(textile8, identity8, prefix8)
const result = await bucketManager.getBucket()

// Expect result
expect(result).not.toBe('undefined')
})

it('BucketManager-getLinks', async () => {
// Arguments
const textile9 = undefined!
const identity9 = undefined!
const prefix9 = 'Oha'

// Method call
const bucketManager = new BucketManager(textile9, identity9, prefix9)
const result = await bucketManager.getLinks()

// Expect result
expect(result).to.be.not.undefined!
})

it('BucketManager-buckets', () => {
// Arguments
const textile10 = undefined!
const identity10 = undefined!
const prefix10 = 'Oha'
const buckets1 = undefined!

// Property call
const bucketManager = new BucketManager(textile10, identity10, prefix10)
bucketManager.buckets = buckets1
const result = bucketManager.buckets

// Expect result
expect(result).toEqual(buckets1)
})

it('BucketManager-bucketKey', () => {
// Arguments
const textile11 = undefined!
const identity11 = undefined!
const prefix11 = 'Oha'
const bucketKey1 = undefined!

// Property call
const bucketManager = new BucketManager(textile11, identity11, prefix11)
bucketManager.bucketKey = bucketKey1
const result = bucketManager.bucketKey

// Expect result
expect(result).toEqual(bucketKey1)
})

it('BucketManager-textile', () => {
// Arguments
const textile12 = undefined!
const identity12 = undefined!
const prefix12 = 'Oha'
const textile13 = undefined!

// Property call
const bucketManager = new BucketManager(textile12, identity12, prefix12)
bucketManager.textile = textile13
const result = bucketManager.textile

// Expect result
expect(result).toEqual(textile13)
})

it('BucketManager-identity', () => {
// Arguments
const textile14 = undefined!
const identity13 = undefined!
const prefix13 = 'Oha'
const identity14 = undefined!

// Property call
const bucketManager = new BucketManager(textile14, identity13, prefix13)
bucketManager.identity = identity14
const result = bucketManager.identity

// Expect result
expect(result).toEqual(identity14)
})

it('BucketManager-bucketName', () => {
// Arguments
const textile15 = undefined!
const identity15 = undefined!
const prefix14 = 'Oha'
const bucketName1 = 'Oha'

// Property call
const bucketManager = new BucketManager(textile15, identity15, prefix14)
bucketManager.bucketName = bucketName1
const result = bucketManager.bucketName

// Expect result
expect(result).toEqual(bucketName1)
})

it('BucketManager-prefix', () => {
// Arguments
const textile16 = undefined!
const identity16 = undefined!
const prefix15 = 'Oha'
const prefix16 = 'Oha'

// Property call
const bucketManager = new BucketManager(textile16, identity16, prefix15)
bucketManager.prefix = prefix16
const result = bucketManager.prefix

// Expect result
expect(result).toEqual(prefix16)
})

})
