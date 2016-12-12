'use strict'
const awsServerlessExpressMiddleware = require('../middleware')
const eventContextMiddleware = awsServerlessExpressMiddleware.eventContext
const mockNext = () => true
const generateMockReq = () => {
    return {
        headers: {
            'x-apigateway-event': '{"path": "/foo/bar"}',
            'x-apigateway-context': '{"foo": "bar"}'
        }
    }
}
const mockRes = {}

test('defaults', () => {
    const req = generateMockReq()
    const originalHeaders = Object.assign({}, req.headers)

    eventContextMiddleware({})(req, mockRes, mockNext)

    expect(req.apiGateway.event).toEqual(JSON.parse(originalHeaders['x-apigateway-event']))
    expect(req.apiGateway.context).toEqual(JSON.parse(originalHeaders['x-apigateway-context']))
    expect(req.headers['x-apigateway-event']).toBe(undefined)
    expect(req.headers['x-apigateway-context']).toBe(undefined)
})

test('options.reqPropKey', () => {
    const req = generateMockReq()
    const originalHeaders = Object.assign({}, req.headers)

    eventContextMiddleware({ reqPropKey: '_apiGateway'})(req, mockRes, mockNext)

    expect(req._apiGateway.event).toEqual(JSON.parse(originalHeaders['x-apigateway-event']))
    expect(req._apiGateway.context).toEqual(JSON.parse(originalHeaders['x-apigateway-context']))
    expect(req.headers['x-apigateway-event']).toBe(undefined)
    expect(req.headers['x-apigateway-context']).toBe(undefined)
})


test('options.deleteHeaders = false', () => {
    const req = generateMockReq()
    const originalHeaders = Object.assign({}, req.headers)

    eventContextMiddleware({ deleteHeaders: false})(req, mockRes, mockNext)

    expect(req.apiGateway.event).toEqual(JSON.parse(originalHeaders['x-apigateway-event']))
    expect(req.apiGateway.context).toEqual(JSON.parse(originalHeaders['x-apigateway-context']))
    expect(req.headers['x-apigateway-event']).toEqual(originalHeaders['x-apigateway-event'])
    expect(req.headers['x-apigateway-context']).toEqual(originalHeaders['x-apigateway-context'])
})

test('Missing x-apigateway-event', () => {
    const req = generateMockReq()
    delete req.headers['x-apigateway-event']
    const originalHeaders = Object.assign({}, req.headers)

    eventContextMiddleware({ deleteHeaders: false})(req, mockRes, mockNext)

    expect(req.apiGateway).toBe(undefined)
})

test('Missing x-apigateway-context', () => {
    const req = generateMockReq()
    delete req.headers['x-apigateway-context']
    const originalHeaders = Object.assign({}, req.headers)

    eventContextMiddleware({ deleteHeaders: false})(req, mockRes, mockNext)

    expect(req.apiGateway).toBe(undefined)
})
