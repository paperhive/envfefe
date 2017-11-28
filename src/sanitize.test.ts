import { expect } from 'chai';

import * as sanitize from './sanitize';

describe('boolean', () => {
  it('should sanitize true', () => expect(sanitize.boolean('true')).to.equal(true));

  it('should sanitize false', () => expect(sanitize.boolean('false')).to.equal(false));

  it('should throw if not a boolean', () => {
    expect(() => sanitize.boolean('1')).to.throw('Value 1 is not a boolean.');
  });
});

describe('date', () => {
  it('should sanitize a date', () => {
    const dateStr = '2017-11-28T22:10:03.793Z';
    const sanitizedDate = sanitize.date(dateStr);
    const date = new Date(dateStr);
    expect(sanitizedDate.getTime()).to.equal(date.getTime());
  });

  it('should throw if not a date', () => {
    expect(() => sanitize.date('foo')).to.throw('Value foo is not a date.');
  });
});

describe('json', () => {
  it('should sanitize a JSON string', () => expect(sanitize.json('{"foo": 1}')).to.eql({foo: 1}));

  it('should throw if not a JSON string', () => {
    expect(() => sanitize.json('foo')).to.throw('Unexpected token');
  });
});

describe('number', () => {
  it('should sanitize a number', () => expect(sanitize.number('1.337')).to.eql(1.337));

  it('should sanitize an integer', () => expect(sanitize.number('-2')).to.eql(-2));

  it('should throw if not a number', () => {
    expect(() => sanitize.number('foo')).to.throw('Value foo is not a number.');
  });
});

describe('string', () => {
  it('should return the input', () => expect(sanitize.string('foo')).to.equal('foo'));
});
