import * as check from '../checkers';
import Jay from 'jayschema';

describe('paramter', () => {
  const ctx = {
    query: {
      thing: 'hello',
    },
    header: {
      'x-test': 'hello',
    },
    body: {
      myInt: 1,
      myList: [{ myStr: 'hello', myDouble: 2.1 }],
    },
    pathParam: {
      id: 'hello',
    },
  };
  const jay = new Jay();
  const validator = jay.validate.bind(jay);

  it('should validate querystring-parameters', () => {
    expect(check.parameter(validator, {
      name: 'thing',
      in: 'query',
      required: true,
      type: 'string',
    }, ctx)).toEqual('hello');

    expect(check.parameter(validator, {
      name: 'thingy',
      in: 'query',
      default: 'default',
    }, ctx)).toBe('default');

    expect(check.parameter(validator, {
      name: 'thing',
      in: 'query',
      default: 'default',
    }, ctx)).toBe('hello');

    expect(() => {
      check.parameter(validator, {
        name: 'thingy',
        in: 'query',
        required: true,
      }, ctx);
    }).toThrow();
  });

  it('should validate headers', () => {
    expect(check.parameter(validator, {
      name: 'x-test',
      in: 'header',
      required: true,
      type: 'string',
    }, ctx)).toBe('hello');

    expect(check.parameter(validator, {
      name: 'x-testy',
      in: 'header',
      default: 'default',
    }, ctx)).toBe('default');

    expect(check.parameter(validator, {
      name: 'x-test',
      in: 'header',
      default: 'default',
    }, ctx)).toBe('hello');

    expect(() => {
      check.parameter(validator, {
        name: 'x-testy',
        in: 'header',
        required: true,
      }, ctx);
    }).toThrow();
  });
});
