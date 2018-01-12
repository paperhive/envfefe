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
      expect(parseEnv({sanitize: sanitize.number, name: 'NUMBER_VAR', default: -2}))
        .to.equal(-2);
    });

    it('should throw if not set and not optional', () => {
      expect(() => parseEnv({sanitize: sanitize.number, name: 'NUMBER_VAR'}))
        .to.throw('Missing environment variable NUMBER_VAR.');
    });
  });

  describe('parse()', () => {
    it('should return a parsed object with shorthand notation', () => {
      process.env.BOOLEAN_VAR = 'true';
      expect(parse({booleanVar: sanitize.boolean}))
        .to.eql({booleanVar: true});
    });

    it('should return a parsed object with explicit notation', () => {
      process.env.BOOLEAN_VAR = 'true';
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
      expect(parse({optionalVar: {sanitize: sanitize.boolean, default: false}}))
        .to.eql({optionalVar: false});
    });
  });
});
