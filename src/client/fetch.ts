import {
  Endpoint,
  type GetCounterRsp,
  type IncCounterReq,
  type IncCounterRsp,
} from '../shared/api.ts'

export async function fetchGetCounter(): Promise<GetCounterRsp | undefined> {
  let rsp
  try {
    rsp = await fetch(Endpoint.GetCounter, {
      headers: {Accept: 'application/json'},
    })
  } catch (err) {
    const msg = `HTTP error: ${err instanceof Error ? err.message : err}`
    console.error(msg)
    return
  }

  if (!rsp.ok) {
    const text = await rsp.text().catch(() => '')
    const err = `HTTP status ${rsp.status}: ${rsp.statusText}; ${text}`
    console.error(err)
    return
  }

  return (await rsp.json()) as GetCounterRsp
}

export async function fetchIncCounter(
  amount: number,
): Promise<IncCounterRsp | undefined> {
  const req: IncCounterReq = {amount}
  let rsp
  try {
    rsp = await fetch(Endpoint.IncCounter, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(req),
    })
  } catch (err) {
    const msg = `HTTP error: ${err instanceof Error ? err.message : err}`
    console.error(msg)
    return
  }

  if (!rsp.ok) {
    const text = await rsp.text().catch(() => '')
    const err = `HTTP status ${rsp.status}: ${rsp.statusText}; ${text}`
    console.error(err)
    return
  }

  return (await rsp.json()) as IncCounterRsp
}
