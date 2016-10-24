'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = koaSwaggerFactory;

require('babel-polyfill');

var _jsonSchemaDerefSync = require('json-schema-deref-sync');

var _jsonSchemaDerefSync2 = _interopRequireDefault(_jsonSchemaDerefSync);

var _jayschema = require('jayschema');

var _jayschema2 = _interopRequireDefault(_jayschema);

var _checkers = require('./checkers');

var check = _interopRequireWildcard(_checkers);

var _matchers = require('./matchers');

var match = _interopRequireWildcard(_matchers);

var _genRouter = require('./gen-router');

var _genRouter2 = _interopRequireDefault(_genRouter);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/**
 * Creates the generator from the swagger router & validator
 * @param router {routington} A swagger definition
 * @param validator {function(object, Schema)} JSON-Schema validator function
 * @returns {function*} The created middleware
 */
function createMiddleware(router, validator) {
  /**
   * Checks request and response against a swagger spec
   * Uses the usual koa context attributes
   * Uses the koa-bodyparser context attribute
   * Sets a new context attribute: {object} parameter
   */
  return function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(ctx, next) {
      var routeMatch, methodDef, statusDef;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              // Routing matches
              routeMatch = void 0;
              _context.prev = 1;

              routeMatch = match.path(router, ctx.path);
              _context.next = 10;
              break;

            case 5:
              _context.prev = 5;
              _context.t0 = _context['catch'](1);
              _context.next = 9;
              return next();

            case 9:
              return _context.abrupt('return');

            case 10:
              ctx.pathParam = routeMatch.param; // Add the path's params to the context
              methodDef = match.method(routeMatch.def, ctx.method);

              // Parameters check & assign

              ctx.parameter = check.parameters(validator, methodDef.parameters || [], ctx);

              // Let the implementation happen
              _context.next = 15;
              return next();

            case 15:

              // Response check
              statusDef = match.status(methodDef.responses || {}, ctx.status);

              check.sentHeaders(validator, statusDef.headers || {}, ctx.sentHeaders);
              if (statusDef.schema) {
                check.body(validator, statusDef.schema, ctx.body);
              }

            case 18:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this, [[1, 5]]);
    }));

    function middleware(_x, _x2) {
      return _ref.apply(this, arguments);
    }

    return middleware;
  }();
}

/**
 * Middleware factory function
 * Creates a new koa generator enforcing swagger api spec compliance
 * in a new context attribute: {object} parameter
 * @param def {Swagger} A swagger definition
 * @param options {{validator: function(object, Schema)}} Optional options dict.
 * @returns {function*} The created middleware
 */
function koaSwaggerFactory(def, options) {
  var flatDef = (0, _jsonSchemaDerefSync2.default)(def);

  check.swaggerVersion(flatDef);

  var jay = new _jayschema2.default();
  var validator = options && options.validator ? options.validator : jay.validate.bind(jay);
  var router = (0, _genRouter2.default)(flatDef);

  // Return the middleware
  return createMiddleware(router, validator);
}