import {redis} from '@devvit/web/server'
import type {T3} from '@devvit/web/shared'

export async function dbGetCounter(t3: T3): Promise<number> {
  return Number((await redis.get(counterKey(t3))) ?? 0)
}

export async function dbIncCounter(t3: T3, amount: number): Promise<number> {
  return redis.incrBy(counterKey(t3), amount)
}

function counterKey(t3: T3): string {
  return `count:${t3}`
}
