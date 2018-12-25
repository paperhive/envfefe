import { expect } from 'chai'
import { parseBoolean, parseNumber } from 'fefe'

import { parseEnv, parseEnvValue } from './parse-env'

describe('parse', () => {
  let originalEnv: NodeJS.ProcessEnv
  beforeEach(() => {
    originalEnv = process.env
    process.env = { ...process.env }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  describe('parseEnvValue()', () => {
    it('should return a parsed variable', () => {
      process.env.NUMBER_VAR = '1.337'
      expect(parseEnvValue({ sanitize: parseNumber(), name: 'NUMBER_VAR' })).to.equal(1.337)
    })

    it('should return undefined if not set and optional without default', () => {
      expect(parseEnvValue({ sanitize: parseNumber(), name: 'NUMBER_VAR', optional: true }))
      .to.equal(undefined)
    })

    it('should return a default value if not set and optional', () => {
      expect(parseEnvValue({ sanitize: parseNumber(), name: 'NUMBER_VAR', default: -2 }))
        .to.equal(-2)
    })

    it('should throw if not set and not optional', () => {
      expect(() => parseEnvValue({ sanitize: parseNumber(), name: 'NUMBER_VAR' }))
        .to.throw('Missing environment variable NUMBER_VAR.')
    })
  })

  describe('parseEnv()', () => {
    it('should return a parsed object with shorthand notation', () => {
      process.env.BOOLEAN_VAR = 'true'
      expect(parseEnv({ booleanVar: parseBoolean() }))
        .to.eql({ booleanVar: true })
    })

    it('should return a parsed object with explicit notation', () => {
      process.env.BOOLEAN_VAR = 'true'
      expect(parseEnv({ booleanVar: { sanitize: parseBoolean(), optional: true } }))
        .to.eql({ booleanVar: true })
    })

    it('should return a parsed object with provided name', () => {
      process.env.WEIRD_VAR = 'true'
      expect(parseEnv({ booleanVar: { sanitize: parseBoolean(), name: 'WEIRD_VAR' } }))
        .to.eql({ booleanVar: true })
    })

    it('should return a parsed object with undefined value if unset', () => {
      expect(parseEnv({ optionalVar: { sanitize: parseBoolean(), optional: true } }))
        .to.eql({ optionalVar: undefined })
    })

    it('should return a parsed object with default value if provided', () => {
      expect(parseEnv({ optionalVar: { sanitize: parseBoolean(), default: false } }))
        .to.eql({ optionalVar: false })
    })
  })
})
