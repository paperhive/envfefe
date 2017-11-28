import { expect } from 'chai';

import * as sanitize from './sanitize';

describe('boolean', () => {
  it('should validate true', () => expect(sanitize.boolean('true')).to.equal(true));

  it('should validate false', () => expect(sanitize.boolean('false')).to.equal(false));

  it('should throw if not a boolean', () => {
    expect(() => sanitize.boolean('1')).to.throw('Value 1 is not a boolean.');
  });
});
