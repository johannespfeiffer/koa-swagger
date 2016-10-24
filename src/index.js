import 'babel-polyfill';
import deref from 'json-schema-deref-sync';
import Jay from 'jayschema';
import * as check from './checkers';
import * as match from './matchers';
import genRouter from './gen-router';


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
  return async function middleware(ctx, next) {
    // Routing matches
    let routeMatch;
    try {
      routeMatch = match.path(router, ctx.path);
    } catch (e) {
      // TODO: let an option before doing that, strict mode throws the error
      await next();
      return;
    }
    ctx.pathParam = routeMatch.param; // Add the path's params to the context
    const methodDef = match.method(routeMatch.def, ctx.method);


    // Parameters check & assign
    ctx.parameter = check.parameters(validator,
      methodDef.parameters || [], ctx);

    // Let the implementation happen
    await next();

    // Response check
    const statusDef = match.status(methodDef.responses || {}, ctx.status);
    check.sentHeaders(validator, statusDef.headers || {}, ctx.sentHeaders);
    if (statusDef.schema) {
      check.body(validator, statusDef.schema, ctx.body);
    }
  };
}

/**
 * Middleware factory function
 * Creates a new koa generator enforcing swagger api spec compliance
 * in a new context attribute: {object} parameter
 * @param def {Swagger} A swagger definition
 * @param options {{validator: function(object, Schema)}} Optional options dict.
 * @returns {function*} The created middleware
 */
export default function koaSwaggerFactory(def, options) {
  const flatDef = deref(def);

  check.swaggerVersion(flatDef);

  const jay = new Jay();
  const validator = options && options.validator ?
    options.validator :
    jay.validate.bind(jay);
  const router = genRouter(flatDef);

  // Return the middleware
  return createMiddleware(router, validator);
}
