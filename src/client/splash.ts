import {requestExpandedMode} from '@devvit/web/client'

const startBtn = document.getElementById('start-btn') as HTMLButtonElement
startBtn.addEventListener('click', ev => requestExpandedMode(ev, 'game'))
