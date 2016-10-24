import Debug from 'debug';
import * as match from './matchers';
const debug = Debug('swagger:check');


/**
 * An error thrown when validating parameters
 * @param message {string} What failed ?
 * @param status {number} HTTP status override
 * @constructor
 */
export class ValidationError extends Error {
  name = 'ValidationError';
  constructor(message = '', status = 400) {
    super(message);
    this.status = status;
  }
}

/**
 * Defines if the spec version is supported by the middleware
 * @param def {Swagger} The swagger complete definition
 * @throws {ValidationError} If the version is not supported
 */
export function swaggerVersion(def) {
  if (def.swagger !== '2.0') {
    throw new ValidationError(`Swagger ${ def.swagger
      }is not supported by this middleware.`);
  }
}

/**
 * Check if the context carries the parameter correctly
 * @param validator {function(object, Schema)} JSON-Schema validator function
 * @param def {Parameter} The parameter's definition
 * @param context {Context} A koa context
 * @return {*} The cleaned value
 * @throws {ValidationError} A possible validation error
 */
export function parameter(validator, def, context) {
  let value = match.fromContext(def.name, def.in, context);

  // Check requirement
  if (def.required && !value) {
    throw new ValidationError(`${def.name } is required`);
  } else if (!value) {
    return def.default;
  }

  // Select the right schema according to the spec
  let schema;
  if (def.in === 'body') {
    schema = def.schema;
    // TODO: clean and sanitize recursively
  } else {
    // TODO: coerce other types
    if (def.type === 'integer') {
      value = parseInt(value, 10);
    } else if (def.type === 'number') {
      value = parseFloat(value);
    } else if (def.type === 'file') {
      def.type = 'object';
    }
    if (def.in === 'query' && def.type === 'array') {
      if (!def.collectionFormat || def.collectionFormat === 'csv') {
        value = value.split(',');
      } else if (def.collectionFormat === 'tsv') {
        value = value.split('\t');
      } else if (def.collectionFormat === 'ssv') {
        value = value.split(' ');
      } else if (def.collectionFormat === 'psv') {
        value = value.split('|');
      } else if (def.collectionFormat === 'multi') {
        throw new ValidationError('multi collectionFormat query parameters currently unsupported');
      } else {
        throw new ValidationError(`unknown collectionFormat ${ def.collectionFormat}`);
      }
    }

    schema = def;
  }

  const err = validator(value, schema);
  if (err.length > 0) {
    throw new ValidationError(`${def.name } has an invalid format: ${
      JSON.stringify(err)}`);
  }

  return value;
}

/**
 * Check if the context carries the parameters correctly
 * @param validator {function(object, Schema)} JSON-Schema validator function
 * @param defs {[Parameter]} The list of parameters definitions
 * @param context {Context} A koa context
 * @return {object} The checked parameters in a dict
 * @throws {ValidationError}
 */
export function parameters(validator, defs, context) {
  const errorMessages = [];
  const parameterDict = {};
  defs.forEach((def) => {
    try {
      parameterDict[def.name] = parameter(validator, def, context);
    } catch (e) {
      if (e.name !== 'ValidationError') {
        throw e;
      }
      errorMessages.push(e.message);
    }
  });
  if (errorMessages.length > 0) {
    throw new ValidationError(errorMessages.join(', '));
  }
  return parameterDict;
}

/**
 * Checks the response's body and logs the exact violation in swagger:check
 * @param validator {function(object, Schema)} JSON-Schema validator function
 * @param schema {Schema} The JSON-schema to test the body against
 * @param body {*} The body to send back
 * @throws {ValidationError} When the body does not respect the schema
 */
export function body(validator, schema, body) {
  // TODO: clean and sanitize recursively
  const err = validator(body, schema);
  if (err.length > 0) {
    debug('Implementation Spec Violation: Unmatching response format');
    debug(err);
    throw new ValidationError('Unmatching response format', 500);
  }
}

/**
 * Checks a sent header and logs the exact violation in swagger:check
 * @param validator {function(object, Schema)} JSON-Schema validator function
 * @param def {Header} The header definition
 * @param name {string} The header's name
 * @param value {*} The header value
 * @throws {ValidationError} When the header does not respect the schema
 */
export function sentHeader(validator, def, name, value) {
  if (!value && def.default) {
    return def.def.default;
  }
  const err = validator(value, def.schema);
  if (err) {
    debug(`Implementation Spec Violation: Unmatching sent header format: ${
      name}`);
    debug(err);
    throw new ValidationError('Unmatching response format', 500);
  }
}

/**
 *
 * @param validator {function(object, Schema)} JSON-Schema validator function
 * @param defs {Headers} The header's definitions
 * @param sentHeaders {object} The sent headers
 * @throws {ValidationError} When the headers does not respect the schema
 */
export function sentHeaders(validator, defs, sentHeaders) {
  let errored = false;
  Object.keys(defs).forEach((name) => {
    try {
      sentHeader(validator, defs[name], name, sentHeaders[name]);
    } catch (e) {
      errored = true;
    }
  });
  if (errored) {
    throw new ValidationError('Unmatching response format', 500);
  }
}
