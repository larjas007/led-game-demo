import { useEffect, useState } from 'react'
import './App.css'

const LED_COUNT = 100
const SPEEDS = [0.5, 1, 1.5, 2]
const COLOR_NAMES = ['red', 'green', 'yellow', 'blue']
const ALL_GAME2_COLORS = ['red', 'green', 'yellow', 'blue', 'orange', 'purple', 'white', 'pink']
const COLOR_VALUES = {
    red: '#ff4052', green: '#45e68a', yellow: '#ffe55b', blue: '#4e91ff',
    orange: '#ff963d', purple: '#b97aff', white: '#f5f7ff', pink: '#ff75bd',
}
const MODES = [
    { id: 1, label: 'Boss fight', short: '01', description: 'Match shots to the advancing wave.' },
    { id: 2, label: 'Color match', short: '02', description: 'Find the correct color before it blinks away.' },
    { id: 3, label: 'Memory', short: '03', description: 'Repeat the growing LED sequence.' },
]

function randomItem(items) { return items[Math.floor(Math.random() * items.length)] }
function shuffled(items) { return [...items].sort(() => Math.random() - 0.5) }
function makeMinions(wave) {
    return Array.from({ length: Math.min(4 + wave * 2, 10) }, (_, index) => ({
        id: `${wave}-${index}-${Math.random()}`, position: 76 - index * 5, color: randomItem(COLOR_NAMES),
    }))
}

function App() {
    const [mode, setMode] = useState(1)
    const [speed, setSpeed] = useState(1)
    const [status, setStatus] = useState('idle')
    const [score, setScore] = useState(0)
    const [stageFlash, setStageFlash] = useState(true)
    const [bossPosition, setBossPosition] = useState(96)
    const [bossHp, setBossHp] = useState(3)
    const [wave, setWave] = useState(1)
    const [minions, setMinions] = useState([])
    const [matchTarget, setMatchTarget] = useState('blue')
    const [matchPosition, setMatchPosition] = useState(40)
    const [matchOptions, setMatchOptions] = useState(['blue', 'red', 'green'])
    const [memorySequence, setMemorySequence] = useState(['blue'])
    const [memoryIndex, setMemoryIndex] = useState(0)
    const [memoryBeat, setMemoryBeat] = useState(0)
    const [memoryActive, setMemoryActive] = useState(null)
    const [memoryProgress, setMemoryProgress] = useState(0)

    function createMatchRound() {
        const target = randomItem(ALL_GAME2_COLORS)
        const wrong = shuffled(ALL_GAME2_COLORS.filter((color) => color !== target)).slice(0, 2)
        setMatchTarget(target)
        setMatchPosition(Math.floor(Math.random() * LED_COUNT))
        setMatchOptions(shuffled([target, ...wrong]))
        setStageFlash(true)
    }

    function startMemorySequence(sequence = ['blue']) {
        setMemorySequence(sequence); setMemoryIndex(0); setMemoryBeat(0); setMemoryActive(null); setStatus('showing')
    }

    function startMode(nextMode = mode) {
        setMode(nextMode); setScore(0)
        if (nextMode === 1) {
            setBossPosition(96); setBossHp(3); setWave(1); setMinions(makeMinions(1)); setStatus('playing')
        } else if (nextMode === 2) {
            createMatchRound(); setStatus('playing')
        } else {
            setMemoryProgress(0); startMemorySequence()
        }
    }

    function stopMode() { setStatus('idle'); setMinions([]); setMemoryActive(null) }
    function chooseMode(nextMode) { setMode(nextMode); stopMode() }
    function changeSpeed(direction) {
        setSpeed((currentSpeed) => {
            const currentIndex = SPEEDS.indexOf(currentSpeed)
            return SPEEDS[Math.max(0, Math.min(SPEEDS.length - 1, currentIndex + direction))]
        })
    }

    function shoot(color) {
        if (mode !== 1 || status !== 'playing') return
        const hitIndex = minions.findIndex((minion) => minion.color === color)
        if (hitIndex >= 0) {
            setMinions((current) => current.filter((_, index) => index !== hitIndex))
            setScore((current) => current + 1)
        } else setBossPosition((current) => Math.max(0, current - 3))
    }

    function chooseMatchColor(color) {
        if (mode !== 2 || status !== 'playing') return
        if (color === matchTarget) {
            setScore((current) => current + 1); createMatchRound()
        } else {
            setStageFlash(false); window.setTimeout(() => setStageFlash(true), 180)
        }
    }

    function chooseMemoryColor(color) {
        if (mode !== 3 || status !== 'waiting') return
        setMemoryActive(color); window.setTimeout(() => setMemoryActive(null), 180 / speed)
        if (color !== memorySequence[memoryIndex]) {
            setMemoryProgress(0); startMemorySequence([randomItem(COLOR_NAMES)]); return
        }
        const nextIndex = memoryIndex + 1
        setMemoryProgress(nextIndex)
        if (nextIndex === memorySequence.length) startMemorySequence([...memorySequence, randomItem(COLOR_NAMES)])
        else setMemoryIndex(nextIndex)
    }

    useEffect(() => {
        if (mode !== 1 || status !== 'playing') return undefined
        const intervalId = window.setInterval(() => {
            setBossPosition((current) => Math.max(0, current - 1))
            setMinions((current) => current.map((minion) => ({ ...minion, position: minion.position - 1 })))
        }, 700 / speed)
        return () => window.clearInterval(intervalId)
    }, [mode, speed, status])

    useEffect(() => {
        if (mode !== 1 || status !== 'playing') return
        if (minions.some((minion) => minion.position <= 0) || bossPosition <= 0) setStatus('lost')
        if (minions.length === 0) {
            if (bossHp <= 1) { setBossHp(0); setStatus('won') }
            else { setBossHp((current) => current - 1); setWave((current) => current + 1); setMinions(makeMinions(wave + 1)) }
        }
    }, [bossHp, bossPosition, minions, mode, status, wave])

    useEffect(() => {
        if (mode !== 2 || status !== 'playing') return undefined
        const intervalId = window.setInterval(() => setStageFlash((current) => !current), 360 / speed)
        return () => window.clearInterval(intervalId)
    }, [mode, speed, status])

    useEffect(() => {
        if (mode !== 3 || status !== 'showing') return undefined
        const intervalId = window.setInterval(() => {
            setMemoryBeat((currentBeat) => {
                const nextBeat = currentBeat + 1
                if (nextBeat >= memorySequence.length * 2) { setMemoryActive(null); setStatus('waiting'); return currentBeat }
                return nextBeat
            })
        }, 390 / speed)
        return () => window.clearInterval(intervalId)
    }, [memorySequence, mode, speed, status])

    useEffect(() => {
        if (mode !== 3 || status !== 'showing') return
        setMemoryActive(memoryBeat % 2 === 0 ? memorySequence[Math.floor(memoryBeat / 2)] : null)
    }, [memoryBeat, memorySequence, mode, status])

    useEffect(() => { if (mode === 3 && status === 'waiting') setMemoryActive(null) }, [mode, status])

    function getLedColor(index) {
        if (mode === 2 && status === 'playing') return index === matchPosition && stageFlash ? COLOR_VALUES[matchTarget] : '#202735'
        if (mode === 3 && memoryActive) return COLOR_VALUES[memoryActive]
        if (mode === 1) {
            const minion = minions.find((current) => current.position === index)
            if (minion) return COLOR_VALUES[minion.color]
            if (index >= bossPosition && index < bossPosition + bossHp) return COLOR_VALUES.purple
            if (index === 0) return COLOR_VALUES.white
        }
        return '#202735'
    }

    const activeMode = MODES.find((item) => item.id === mode)
    const isRunning = status !== 'idle' && status !== 'won' && status !== 'lost'

    return (
        <main className="arcade-shell">
            <header className="topbar"><div className="brand-mark"><span /> LED LAB / 03</div><div className="topbar-note">ESP32 PROTOTYPE // WEB DEMO</div></header>
            <section className="game-console" id="demo">
                <nav className="mode-tabs" aria-label="Game modes">{MODES.map((item) => <button key={item.id} className={mode === item.id ? 'mode-tab active' : 'mode-tab'} onClick={() => chooseMode(item.id)}><span>{item.short}</span>{item.label}</button>)}</nav>
                <div className="console-heading"><div><p className="eyebrow">MODE {activeMode.short}</p><h2>{activeMode.label}</h2><p>{activeMode.description}</p></div><div className="speed-control"><span>GAME SPEED</span><button aria-label="Decrease game speed" onClick={() => changeSpeed(-1)}>-</button><strong>{speed.toFixed(1)}×</strong><button aria-label="Increase game speed" onClick={() => changeSpeed(1)}>+</button></div></div>
                <div className="stage-frame"><div className="stage-label"><span>STAGE / 100</span><span>{status.toUpperCase()}</span></div><div className="led-stage" aria-label="LED stage">{Array.from({ length: LED_COUNT }, (_, index) => <span key={index} style={{ backgroundColor: getLedColor(index) }} />)}</div><div className="stage-scale"><span>00</span><span>25</span><span>50</span><span>75</span><span>99</span></div></div>
                <div className="play-area">
                    {mode === 1 && <div className="mode-readout"><span>WAVE {wave}</span><strong>{score.toString().padStart(2, '0')} HITS</strong><span>BOSS HP {bossHp}</span></div>}
                    {mode === 2 && <div className="mode-readout"><span>TARGET / {matchTarget.toUpperCase()}</span><strong>{score.toString().padStart(2, '0')} MATCHES</strong><span>POSITION {String(matchPosition).padStart(2, '0')}</span></div>}
                    {mode === 3 && <div className="mode-readout"><span>{status === 'showing' ? 'WATCH THE STAGE' : 'YOUR TURN'}</span><strong>{memoryProgress.toString().padStart(2, '0')} REMEMBERED</strong><span>LENGTH {memorySequence.length}</span></div>}
                    {!isRunning && <button className="launch-button" onClick={() => startMode(mode)}>{status === 'won' ? 'Play again' : status === 'lost' ? 'Retry mode' : 'Start mode'} <span>↗</span></button>}
                    {mode === 1 && isRunning && <div className="button-row">{COLOR_NAMES.map((color) => <button key={color} className={`color-button ${color}`} onClick={() => shoot(color)}>{color}</button>)}</div>}
                    {mode === 2 && isRunning && <div className="button-row three-buttons">{matchOptions.map((color) => <button key={color} className={`color-button ${color}`} onClick={() => chooseMatchColor(color)}>{color}</button>)}</div>}
                    {mode === 3 && isRunning && <div className="button-row">{COLOR_NAMES.map((color) => <button key={color} disabled={status !== 'waiting'} className={`color-button ${color}`} onClick={() => chooseMemoryColor(color)}>{color}</button>)}<button className="repeat-button" onClick={() => startMemorySequence(memorySequence)}>repeat <span>↻</span></button></div>}
                    {status === 'won' && <p className="result-message success">BOSS DEFEATED / STAGE CLEAR</p>}{status === 'lost' && <p className="result-message failure">SIGNAL LOST / TRY AGAIN</p>}
                </div>
            </section>
            <footer className="footer-note"><span>BUILT BY LUIS LARUMBE</span><a href="https://github.com/larjas007" target="_blank" rel="noreferrer">GITHUB ↗</a><span>PYTHON → ESP32 → WEB</span></footer>
        </main>
    )
}

export default App
