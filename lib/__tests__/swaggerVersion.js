'use strict';

var _checkers = require('../checkers');

var check = _interopRequireWildcard(_checkers);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

describe('swaggerVersion', function () {
  it('should accept swagger 2.0', function () {
    check.swaggerVersion({
      swagger: '2.0'
    });
  });

  it('should refuse everything else', function () {
    expect(function () {
      return check.swaggerVersion({ swagger: '0.2' });
    }).toThrow();
    expect(function () {
      return check.swaggerVersion({ swagger: '1.0' });
    }).toThrow();
    expect(function () {
      return check.swaggerVersion({ swagger: '3.0' });
    }).toThrow();
    expect(function () {
      return check.swaggerVersion({ swagger: '2.1' });
    }).toThrow();
  });
});