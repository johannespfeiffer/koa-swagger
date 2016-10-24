'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MatchingError = undefined;
exports.path = path;
exports.method = method;
exports.fromContext = fromContext;
exports.status = status;

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var debug = (0, _debug2.default)('swagger:match');

/**
 * An error thrown when something didn't matched
 * @param message {string} What didn't matched ?
 * @param status {number} HTTP status override
 * @constructor
 */

var MatchingError = exports.MatchingError = function (_Error) {
  _inherits(MatchingError, _Error);

  function MatchingError() {
    var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var status = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 404;

    _classCallCheck(this, MatchingError);

    var _this = _possibleConstructorReturn(this, (MatchingError.__proto__ || Object.getPrototypeOf(MatchingError)).call(this, message));

    _this.name = 'MatchingError';

    _this.status = status;
    return _this;
  }

  return MatchingError;
}(Error);

/**
 * Matches a registered path with its definitions and its catched params
 * @param router {routington} The registered router
 * @param path {string} The HTTP path
 * @return {{def: Path, param: object}} The matched path definition and the
 *   found params
 * @throws {MatchingError} A 404 error
 */


function path(router, path) {
  var match = router.match(path);
  if (!match) {
    throw new MatchingError(path + ' not found');
  }
  return {
    def: match.node.def,
    param: match.param
  };
}

/**
 * Matches a registered method with it's definition
 * @param def {Path} The path definition to search in
 * @param method {string} The HTTP method
 * @returns {Operation} The method definition or null if it didn't matched
 */
function method(def, method) {
  var m = method.toLowerCase();
  if (!def || !def[m]) {
    throw new MatchingError(m + ' unsupported', 405);
  }
  return def[m];
}

/**
 * Matches an attribute from a specific location from the context and retrieve
 * its value
 * @param name {string} The attribute's name
 * @param from {string} The location between "query", "header", "path",
 *   "formData" or "body".
 * @param context {Context} The koa context
 * @return {*} The matched value
 */
function fromContext(name, from, context) {
  switch (from) {
    case 'query':
      return (context.query || {})[name];
    case 'header':
      return (context.header || {})[name];
    case 'body':
      return context.body || context.request.body || {};
    case 'path':
      return (context.pathParam || {})[name];
    case 'formData':
      return (context.body || context.request.body || {})[name] || (context.request.body.fields || {})[name] || (context.request.body.files || {})[name];
    default:
      throw new MatchingError('Unsupported parameter origin: ' + from, 500);
  }
}

/**
 * Matches a return code with its corresponding definition
 * @param def {Responses} The responses definition
 * @param status {number} The status
 * @returns {Response}
 */
function status(def, status) {
  var cast = '' + status;
  if (!def[cast] && !def.default) {
    debug('Implementation Spec Violation: Unsupported response status');
    debug('Unexpected ' + status);
    throw new MatchingError('Unmatching response format', 500);
  }
  return def[cast] || def.default;
}