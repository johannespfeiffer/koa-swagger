'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (def) {
  var paths = def.paths;
  var base = def.basePath || '';

  var router = (0, _routington2.default)();
  Object.keys(paths).forEach(function (route) {
    var node = router.define(base + route.replace(/{([^}]*)}/g, ':$1'))[0];
    node.def = paths[route];
  });
  return router;
};

var _routington = require('routington');

var _routington2 = _interopRequireDefault(_routington);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }