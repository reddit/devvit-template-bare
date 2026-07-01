import assert from 'node:assert/strict'
import {createServer} from 'node:http'
import type {AddressInfo, Server} from 'node:net'
import {after, before, beforeEach, test} from 'node:test'
import {type Context, redis, runWithContext} from '@devvit/web/server'
import {
  Endpoint,
  type ErrorRsp,
  type GetCounterRsp,
  type IncCounterReq,
  type IncCounterRsp,
} from '../shared/api.ts'
import {onReq} from './server.ts'

let server: Server
let serverURL: string
const redisValues = new Map<string, number>()
const redisGet = redis.get.bind(redis)
const redisIncrBy = redis.incrBy.bind(redis)

before(async () => {
  redis.get = async key => `${redisValues.get(key) ?? 0}`
  redis.incrBy = async (key, amount) => {
    const value = (redisValues.get(key) ?? 0) + amount
    redisValues.set(key, value)
    return value
  }

  server = createServer(async (req, rsp) => {
    await runWithContext(
      {
        appName: '<% name %>',
        postId: 't3_123',
        userId: 't2_123',
        username: 'username',
      } as unknown as Context,
      () => onReq(req, rsp),
    )
  })
  await new Promise<void>(resolve => {
    server.listen(0, '127.0.0.1', () => resolve())
  })
  const info = server.address() as AddressInfo
  serverURL = `http://127.0.0.1:${info.port}`
})

after(async () => {
  redis.get = redisGet
  redis.incrBy = redisIncrBy
  if (!server.listening) return
  await new Promise<void>((resolve, reject) => {
    server.close(err => (err ? reject(err) : resolve()))
  })
})

beforeEach(() => redisValues.clear())

test('get counter', async () => {
  const rsp = await fetch(`${serverURL}/${Endpoint.GetCounter}`)
  assert.equal(rsp.status, 200)
  assert.equal(rsp.headers.get('Content-Type'), 'application/json')
  assert.deepEqual<GetCounterRsp>(await rsp.json(), {count: 0})
})

test('inc', async () => {
  const req: IncCounterReq = {amount: 1}
  const rsp = await fetch(`${serverURL}/${Endpoint.IncCounter}`, {
    body: JSON.stringify(req),
    headers: {'Content-Type': 'application/json'},
    method: 'POST',
  })
  assert.equal(rsp.status, 200)
  assert.equal(rsp.headers.get('Content-Type'), 'application/json')
  assert.deepEqual<IncCounterRsp>(await rsp.json(), {count: 1})
})

test('wrong method', async () => {
  const rsp = await fetch(`${serverURL}/${Endpoint.IncCounter}`)
  assert.equal(rsp.status, 404)
  assert.deepEqual<ErrorRsp>(await rsp.json(), {
    error: 'not found',
    status: 404,
  })
})

test('404', async () => {
  const rsp = await fetch(serverURL)
  assert.equal(rsp.status, 404)
  assert.deepEqual<ErrorRsp>(await rsp.json(), {
    error: 'not found',
    status: 404,
  })
})
