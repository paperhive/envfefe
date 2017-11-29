import { expect } from 'chai';

import { parse, parseEnv } from './parse';
import * as sanitize from './sanitize';

describe('parse', () => {
  let originalEnv;
  beforeEach(() => {
    originalEnv = process.env;
    process.env = {...process.env};
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('parseEnv()', () => {
    it('should return a parsed variable', () => {
      process.env.NUMBER_VAR = '1.337';
      expect(parseEnv({sanitize: sanitize.number, name: 'NUMBER_VAR'})).to.equal(1.337);
    });

    it('should return undefined if not set and optional without default', () => {
      expect(parseEnv({sanitize: sanitize.number, name: 'NUMBER_VAR', optional: true}))
      .to.equal(undefined);
    });

    it('should return a default value if not set and optional', () => {
      expect(parseEnv({sanitize: sanitize.number, name: 'NUMBER_VAR', optional: true, default: -2}))
        .to.equal(-2);
    });

    it('should throw if not set and not optional', () => {
      expect(() => parseEnv({sanitize: sanitize.number, name: 'NUMBER_VAR'}))
        .to.throw('Missing environment variable NUMBER_VAR.');
    });
  });

  describe('parse()', () => {
    beforeEach(() => Object.assign(process.env, {
      BOOLEAN_VAR: 'true',
      DATE_VAR: '2017-11-29T10:11:48.915Z',
      JSON_VAR: '{"foo": 1.337}',
      NUMBER_VAR: '1.337',
      STRING_VAR: 'foo',
    }));

    it('should return a parsed object with shorthand notation', () => {
      const definition = {
        booleanVar: sanitize.boolean,
        dateVar: sanitize.date,
        jsonVar: sanitize.json,
        numberVar: sanitize.number,
        stringVar: sanitize.string,
      };
      expect(parse(definition)).to.eql({
        booleanVar: true,
        dateVar: new Date('2017-11-29T10:11:48.915Z'),
        jsonVar: {foo: 1.337},
        numberVar: 1.337,
        stringVar: 'foo',
      });
    });

    it('should return a parsed object with explicit notation', () => {
      expect(parse({booleanVar: {sanitize: sanitize.boolean, optional: true}}))
        .to.eql({booleanVar: true});
    });

    it('should return a parsed object with provided name', () => {
      process.env.WEIRD_VAR = 'true';
      expect(parse({booleanVar: {sanitize: sanitize.boolean, name: 'WEIRD_VAR'}}))
        .to.eql({booleanVar: true});
    });

    it('should return a parsed object with undefined value if unset', () => {
      expect(parse({optionalVar: {sanitize: sanitize.boolean, optional: true}}))
        .to.eql({optionalVar: undefined});
    });

    it('should return a parsed object with default value if provided', () => {
      expect(parse({optionalVar: {sanitize: sanitize.boolean, optional: true, default: false}}))
        .to.eql({optionalVar: false});
    });

    it('should throw if variable is unset and not optional', () => {
      expect(() => parse({unsetVar: sanitize.boolean}))
        .to.throw('Missing environment variable UNSET_VAR');
    });

    it('should throw if variable cannot be sanitized', () => {
      expect(() => parse({booleanVar: sanitize.number}))
        .to.throw('Environment variable BOOLEAN_VAR cannot be sanitized: Value true is not a number.');
    });
  });
});
