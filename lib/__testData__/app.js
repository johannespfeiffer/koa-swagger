'use strict';

var SPEC = {
  swagger: '2.0',
  info: {
    title: 'Hello API',
    version: '1.0.0'
  },
  basePath: '/api',
  paths: {
    '/hello/{name}': {
      get: {
        tags: ['Hello'],
        summary: 'Says hello',
        parameters: [{ name: 'name',
          in: 'path',
          type: 'string',
          required: true,
          default: 'World' }, { name: 'punctuation',
          in: 'query',
          type: 'string',
          required: true }],
        responses: {
          200: {
            description: 'Everything went well :)',
            schema: { $ref: '#/definitions/Message' }
          },
          400: {
            description: 'Issue with the parameters'
          }
        }
      }
    }
  },
  definitions: {
    Message: {
      required: ['message'],
      properties: {
        message: {
          type: 'string'
        }
      }
    }
  }
};

var app = new (require('koa'))();
app.use(require('koa-bodyparser')());
app.use(require('../').default(SPEC));

var _ = require('koa-route');
app.use(_.get('/api/hello/:name', function (ctx, name) {
  ctx.body = {
    message: 'Hello ' + name + ctx.request.query.punctuation
  };
}));
module.exports = app;