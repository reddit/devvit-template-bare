import {fetchGetCounter, fetchIncCounter} from './fetch.ts'

async function init(): Promise<void> {
  const counter = document.getElementById('counter') as HTMLOutputElement
  const incBtn = document.getElementById('inc-btn') as HTMLButtonElement
  const decBtn = document.getElementById('dec-btn') as HTMLButtonElement

  incBtn.addEventListener('click', () => void incCount(counter, 1))
  decBtn.addEventListener('click', () => void incCount(counter, -1))

  const rsp = await fetchGetCounter()
  counter.value = rsp ? `${rsp.count}` : 'Error'
}

async function incCount(
  counter: HTMLOutputElement,
  amount: number,
): Promise<void> {
  const inc = await fetchIncCounter(amount)
  counter.value = inc ? `${inc.count}` : 'Error'
}

void init()
