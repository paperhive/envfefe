import { assert } from 'chai'
import {
  branchError,
  defaultTo,
  failure,
  leafError,
  optional,
  parseNumber,
  pipe,
  string,
  success,
} from 'fefe'

import { envParser, parseEnv } from './parse-env'

describe('envParser()', () => {
  const parser = envParser({
    fooBar: string(),
    optionalVar: optional(pipe(string()).pipe(parseNumber())),
    defaultVar: defaultTo(string(), 'default'),
  })

  it('should return a parsed object if all values are provided', () =>
    assert.deepStrictEqual(
      parser({ FOO_BAR: 'foo', OPTIONAL_VAR: '1337', DEFAULT_VAR: 'test' }),
      success({ fooBar: 'foo', optionalVar: 1337, defaultVar: 'test' })
    ))

  it('should return a parsed object if only mandatory values are provided', () =>
    assert.deepStrictEqual(
      parser({ FOO_BAR: 'foo' }),
      success({ fooBar: 'foo', defaultVar: 'default' })
    ))

  it('should return an error if a validator errors', () => {
    const value = { FOO_BAR: 'foo', OPTIONAL_VAR: 'str' }
    assert.deepStrictEqual(
      parser(value),
      failure(
        branchError(value, [
          {
            key: 'OPTIONAL_VAR',
            error: leafError('str', 'Not a number.'),
          },
        ])
      )
    )
  })
})

describe('parseEnvValue()', () => {
  let originalEnv: NodeJS.ProcessEnv
  beforeEach(() => {
    originalEnv = process.env
    process.env = { ...process.env }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  it('should return a parsed object if all values are provided', () => {
    Object.assign(process.env, {
      FOO_BAR: 'foo',
      OPTIONAL_VAR: '1337',
      DEFAULT_VAR: 'test',
    })
    assert.deepStrictEqual(
      parseEnv({
        fooBar: string(),
        optionalVar: optional(pipe(string()).pipe(parseNumber())),
        defaultVar: defaultTo(string(), 'default'),
      }),
      success({ fooBar: 'foo', optionalVar: 1337, defaultVar: 'test' })
    )
  })
})
