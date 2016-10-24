'use strict';

var _checkers = require('../checkers');

var check = _interopRequireWildcard(_checkers);

var _jayschema = require('jayschema');

var _jayschema2 = _interopRequireDefault(_jayschema);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

describe('paramter', function () {
  var ctx = {
    query: {
      thing: 'hello'
    },
    header: {
      'x-test': 'hello'
    },
    body: {
      myInt: 1,
      myList: [{ myStr: 'hello', myDouble: 2.1 }]
    },
    pathParam: {
      id: 'hello'
    }
  };
  var jay = new _jayschema2.default();
  var validator = jay.validate.bind(jay);

  it('should validate querystring-parameters', function () {
    expect(check.parameter(validator, {
      name: 'thing',
      in: 'query',
      required: true,
      type: 'string'
    }, ctx)).toEqual('hello');

    expect(check.parameter(validator, {
      name: 'thingy',
      in: 'query',
      default: 'default'
    }, ctx)).toBe('default');

    expect(check.parameter(validator, {
      name: 'thing',
      in: 'query',
      default: 'default'
    }, ctx)).toBe('hello');

    expect(function () {
      check.parameter(validator, {
        name: 'thingy',
        in: 'query',
        required: true
      }, ctx);
    }).toThrow();
  });

  it('should validate headers', function () {
    expect(check.parameter(validator, {
      name: 'x-test',
      in: 'header',
      required: true,
      type: 'string'
    }, ctx)).toBe('hello');

    expect(check.parameter(validator, {
      name: 'x-testy',
      in: 'header',
      default: 'default'
    }, ctx)).toBe('default');

    expect(check.parameter(validator, {
      name: 'x-test',
      in: 'header',
      default: 'default'
    }, ctx)).toBe('hello');

    expect(function () {
      check.parameter(validator, {
        name: 'x-testy',
        in: 'header',
        required: true
      }, ctx);
    }).toThrow();
  });
});