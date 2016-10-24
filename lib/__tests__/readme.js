'use strict';

require('babel-polyfill');

var _supertest = require('supertest');

var _supertest2 = _interopRequireDefault(_supertest);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new _bluebird2.default(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return _bluebird2.default.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; } /*eslint-disable no-eval */


_bluebird2.default.promisifyAll(_supertest2.default.Test.prototype);

describe('README\'s code example', function () {
  var app = require('../__testData__/app');
  var request = (0, _supertest2.default)(app.listen());

  it('should 404 or 405 when accessing the wrong endpoint', _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return request.get('/api/nope').expect(404).endAsync();

          case 2:
            _context.next = 4;
            return request.post('/api/hello/bob').query({ chk: true }).expect(405).endAsync();

          case 4:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  })));

  it('should 400 when providing wrong parameters', _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return request.get('/api/hello/bob').query({ chuk: true }).expect(400).endAsync();

          case 2:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  })));

  it('should 200 when providing the right parameters', _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return request.get('/api/hello/bob').query({ punctuation: '!' }).expect(200).expect(/Hello bob!/).endAsync();

          case 2:
            _context3.next = 4;
            return request.get('/api/hello/bob').query({ punctuation: '.' }).expect(200).expect(/Hello bob\./).endAsync();

          case 4:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  })));
});