import { expect } from 'chai';

import { parse, sanitize } from './index';

describe('integration tests', () => {
  let originalEnv;
  beforeEach(() => {
    originalEnv = process.env;
    process.env = {...process.env};
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should return a parsed object with shorthand notation', () => {
    Object.assign(process.env, {
      BOOLEAN_VAR: 'true',
      DATE_VAR: '2017-11-29T10:11:48.915Z',
      JSON_VAR: '{"foo": 1.337}',
      NUMBER_VAR: '1.337',
      OTHER_VAR: 'bar',
      STRING_VAR: 'foo',
    });

    expect(parse({
      booleanVar: sanitize.boolean,
      dateVar: sanitize.date,
      defaultVar: {sanitize: sanitize.number, optional: true, default: 1.337},
      jsonVar: sanitize.json,
      numberVar: sanitize.number,
      optionalStringVar: {sanitize: sanitize.string, optional: true},
      otherNameVar: {name: 'OTHER_VAR', sanitize: sanitize.string},
      stringVar: sanitize.string,
    })).to.eql({
      booleanVar: true,
      dateVar: new Date('2017-11-29T10:11:48.915Z'),
      defaultVar: 1.337,
      jsonVar: {foo: 1.337},
      numberVar: 1.337,
      optionalStringVar: undefined,
      otherNameVar: 'bar',
      stringVar: 'foo',
    });
  });

  it('should throw if variable is unset and not optional', () => {
    expect(() => parse({unsetVar: sanitize.boolean}))
      .to.throw('Missing environment variable UNSET_VAR');
  });

  it('should throw if variable cannot be sanitized', () => {
    process.env.BOOLEAN_VAR = '1';
    expect(() => parse({booleanVar: sanitize.boolean}))
      .to.throw('Environment variable BOOLEAN_VAR cannot be sanitized: Value 1 is not a boolean.');
  });
});
