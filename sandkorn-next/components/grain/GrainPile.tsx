'use client'

import { useEffect, useRef } from 'react'

type Scope = 'you' | 'city' | 'dk'

interface GrainPileProps {
  count: number
  scope?: Scope
  goal?: number
}

const GRAIN_R: Record<Scope, number> = { you: 13, city: 3.5, dk: 2.2 }

interface Grain {
  x: number; y: number; r: number
  isMine: boolean; alpha: number
  vx: number; vy: number
}

function seededRand(seed: number) {
  let s = seed
  return () => { s = (s * 9301 + 49297) % 233280; return s / 233280 }
}

function drawDiamond(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, alpha: number, isMine: boolean) {
  if (r < 0.5) return
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(Math.PI / 4)
  const s = r * 1.38
  const cr = s * 0.28
  ctx.beginPath()
  if (ctx.roundRect) {
    ctx.roundRect(-s / 2, -s / 2, s, s, cr)
  } else {
    const x0 = -s / 2, y0 = -s / 2, w = s, h = s
    ctx.moveTo(x0 + cr, y0)
    ctx.lineTo(x0 + w - cr, y0)
    ctx.arcTo(x0 + w, y0, x0 + w, y0 + cr, cr)
    ctx.lineTo(x0 + w, y0 + h - cr)
    ctx.arcTo(x0 + w, y0 + h, x0 + w - cr, y0 + h, cr)
    ctx.lineTo(x0 + cr, y0 + h)
    ctx.arcTo(x0, y0 + h, x0, y0 + h - cr, cr)
    ctx.lineTo(x0, y0 + cr)
    ctx.arcTo(x0, y0, x0 + cr, y0, cr)
    ctx.closePath()
  }
  ctx.fillStyle = isMine
    ? `rgba(200,164,100,${Math.min(1, alpha)})`
    : `rgba(175,142,80,${Math.min(1, alpha * 0.55)})`
  ctx.fill()
  ctx.restore()
}

function buildLayout(count: number, W: number, H: number, grainR: number): Grain[] {
  if (count <= 1) {
    return [{ x: W * 0.5, y: H - grainR * 2.2, r: grainR, isMine: true, alpha: 0.92, vx: 0, vy: 0 }]
  }
  const rand = seededRand(42)
  const diam = grainR * 2
  const rowH = grainR * 1.72
  const baseY = H - grainR * 1.6
  const baseN = Math.max(3, Math.floor(W * 0.78 / diam))
  const positions: { x: number; y: number; aRand: number }[] = []
  for (let row = 0; ; row++) {
    const n = baseN - row * 2
    if (n <= 0) break
    const x0 = (W - n * diam) / 2 + grainR
    const y = baseY - row * rowH
    for (let col = 0; col < n; col++) {
      const aRand = rand()
      const jx = (rand() - 0.5) * grainR * 0.42
      const jy = (rand() - 0.5) * grainR * 0.30
      positions.push({ x: x0 + col * diam + jx, y: y + jy, aRand })
    }
  }
  const mineCol = Math.floor(baseN / 2)
  const mineIdx = mineCol < positions.length ? mineCol : 0
  if (mineIdx > 0) [positions[0], positions[mineIdx]] = [positions[mineIdx], positions[0]]
  const gs: Grain[] = []
  for (let i = 0; i < count && i < positions.length; i++) {
    const p = positions[i]
    const isMine = i === 0
    gs.push({ x: p.x, y: p.y, r: grainR, isMine, alpha: isMine ? 0.92 : (0.42 + p.aRand * 0.38), vx: 0, vy: 0 })
  }
  return gs
}

function drawFrame(ctx: CanvasRenderingContext2D, W: number, H: number, gs: Grain[], goalY?: number) {
  ctx.clearRect(0, 0, W, H)
  gs.forEach(g => { if (!g.isMine) drawDiamond(ctx, g.x, g.y, g.r, g.alpha, false) })
  gs.forEach(g => { if (g.isMine) drawDiamond(ctx, g.x, g.y, g.r, g.alpha, true) })
  if (goalY !== undefined && goalY > 0 && goalY < H) {
    ctx.setLineDash([4, 4])
    ctx.strokeStyle = 'rgba(90,95,88,0.28)'
    ctx.lineWidth = 1
    ctx.beginPath(); ctx.moveTo(0, goalY); ctx.lineTo(W, goalY); ctx.stroke()
    ctx.setLineDash([])
  }
}

export default function GrainPile({ count, scope = 'dk', goal }: GrainPileProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number | null>(null)
  const prevScopeRef = useRef<Scope | null>(null)
  const prevCountRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const W = canvas.offsetWidth || 200
    const H = canvas.offsetHeight || 140
    const dpr = window.devicePixelRatio || 1
    canvas.width = W * dpr
    canvas.height = H * dpr
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.scale(dpr, dpr)

    if (rafRef.current) cancelAnimationFrame(rafRef.current)

    const grainR = GRAIN_R[scope]
    const goalY = goal ? H * (1 - goal / (count * 1.35)) : undefined
    const layout = buildLayout(count, W, H, grainR)
    const prevScope = prevScopeRef.current
    const prevCount = prevCountRef.current

    prevScopeRef.current = scope
    prevCountRef.current = count

    function startBob(settled: Grain[]) {
      let bt = 0
      function bob() {
        bt += 0.005
        const gs2 = settled.map(g => ({ ...g, y: g.y + Math.sin(bt + g.x * 0.05) * 0.35 }))
        drawFrame(ctx!, W, H, gs2, goalY)
        rafRef.current = requestAnimationFrame(bob)
      }
      rafRef.current = requestAnimationFrame(bob)
    }

    // You scope: scatter from prev pile (if coming from another scope) or spring drop
    if (scope === 'you') {
      // Coming down from city/dk: scatter all grains, zoom in mine
      if (prevScope && prevScope !== 'you') {
        const prevR = GRAIN_R[prevScope]
        const prevLayout = buildLayout(prevCount, W, H, prevR)
        const cx = W / 2, cy = H * 0.6
        const ZOOM_FRAMES = 32
        let frame = 0
        let scattered = prevLayout.filter(g => !g.isMine).map(g => {
          const dx = g.x - cx, dy = g.y - cy
          const dist = Math.sqrt(dx * dx + dy * dy) || 1
          const spd = 2.5 + Math.random() * 4
          return { ...g, vx: (dx / dist) * spd + (Math.random() - 0.5) * 1.5, vy: (dy / dist) * spd - Math.random() * 1.5 }
        })
        const myGrain = { ...prevLayout[0], r: prevR }
        const targetR = GRAIN_R['you']
        function scatterStep() {
          frame++
          const t = Math.min(frame / ZOOM_FRAMES, 1)
          const e = 1 - Math.pow(1 - t, 3)
          const currentR = myGrain.r + (targetR - myGrain.r) * e
          scattered = scattered.map(g => ({ ...g, x: g.x + g.vx, y: g.y + g.vy, vy: g.vy + 0.12, alpha: Math.max(0, g.alpha - 0.038) }))
          ctx!.clearRect(0, 0, W, H)
          scattered.forEach(g => { if (g.alpha > 0) drawDiamond(ctx!, g.x, g.y, g.r, g.alpha, false) })
          drawDiamond(ctx!, myGrain.x, myGrain.y, currentR, myGrain.alpha, true)
          if (t < 1 || scattered.some(g => g.alpha > 0)) {
            rafRef.current = requestAnimationFrame(scatterStep)
          } else {
            startBob([{ ...layout[0], r: targetR }])
          }
        }
        rafRef.current = requestAnimationFrame(scatterStep)
        return
      }
      // First mount or already 'you': single grain spring drop
      const grain = layout[0]
      let y = -20, vy = 0
      const floorY = grain.y
      function springDrop() {
        vy += 0.55
        y += vy
        if (y >= floorY) {
          y = floorY
          vy *= -0.42
          if (Math.abs(vy) < 0.4) { startBob([{ ...grain, y: floorY }]); return }
        }
        ctx!.clearRect(0, 0, W, H)
        drawDiamond(ctx!, grain.x, y, grain.r, grain.alpha, true)
        rafRef.current = requestAnimationFrame(springDrop)
      }
      rafRef.current = requestAnimationFrame(springDrop)
      return
    }

    // Going up in scope (count increased): zoom existing + rain new grains
    if (prevScope && count > prevCount) {
      const prevR = GRAIN_R[prevScope]
      const existing = layout.slice(0, prevCount)
      const newGrains = layout.slice(prevCount)
      const ZOOM_FRAMES = 22
      let zFrame = 0

      function zoomStep() {
        zFrame++
        const t = Math.min(zFrame / ZOOM_FRAMES, 1)
        const e = 1 - Math.pow(1 - t, 2)
        const currentR = prevR + (grainR - prevR) * e
        drawFrame(ctx!, W, H, existing.map(g => ({ ...g, r: currentR })), goalY)
        if (zFrame < ZOOM_FRAMES) {
          rafRef.current = requestAnimationFrame(zoomStep)
        } else {
          rainStep()
        }
      }

      function rainStep() {
        const maxDrop = Math.min(newGrains.length, 150)
        const subset = newGrains.slice(0, maxDrop)
        const msTotal = Math.max(1200, maxDrop * 12)
        const interval = msTotal / maxDrop
        let settled = [...existing]
        const active: { g: Grain; y: number; vy: number; done: boolean }[] = []
        let nextIdx = 0
        let t0: number | null = null

        function frame(ts: number) {
          if (!t0) t0 = ts
          const elapsed = ts - t0
          while (nextIdx < maxDrop && elapsed >= nextIdx * interval) {
            const g = subset[nextIdx++]
            active.push({ g, y: -grainR * 2, vy: 1.2 + Math.random() * 2.5, done: false })
          }
          ctx!.clearRect(0, 0, W, H)
          settled.forEach(g => { if (!g.isMine) drawDiamond(ctx!, g.x, g.y, g.r, g.alpha, false) })
          settled.forEach(g => { if (g.isMine) drawDiamond(ctx!, g.x, g.y, g.r, g.alpha, true) })
          active.forEach(ag => {
            if (ag.done) return
            ag.vy += 0.28
            ag.y += ag.vy
            if (ag.y >= ag.g.y) {
              ag.y = ag.g.y; ag.vy *= -0.28
              if (Math.abs(ag.vy) < 0.4) { ag.done = true; settled.push(ag.g); return }
            }
            drawDiamond(ctx!, ag.g.x, ag.y, ag.g.r, ag.g.alpha, ag.g.isMine)
          })
          if (goalY !== undefined && goalY > 0 && goalY < H) {
            ctx!.setLineDash([4, 4]); ctx!.strokeStyle = 'rgba(90,95,88,0.28)'; ctx!.lineWidth = 1
            ctx!.beginPath(); ctx!.moveTo(0, goalY); ctx!.lineTo(W, goalY); ctx!.stroke(); ctx!.setLineDash([])
          }
          const allDone = nextIdx >= maxDrop && active.every(a => a.done)
          if (!allDone) { rafRef.current = requestAnimationFrame(frame) } else { startBob(settled) }
        }
        rafRef.current = requestAnimationFrame(frame)
      }

      rafRef.current = requestAnimationFrame(zoomStep)
      return
    }

    // DK → CPH (count decreased but not to 'you'): partial scatter
    if (prevScope && count < prevCount) {
      const prevR = GRAIN_R[prevScope]
      const prevLayout = buildLayout(prevCount, W, H, prevR)
      const keepers = prevLayout.slice(0, count)
      const leavers = prevLayout.slice(count)
      const cx = W / 2, cy = H * 0.5
      const ZOOM_FRAMES = 22
      let frame = 0
      let scattered = leavers.map(g => {
        const dx = g.x - cx, dy = g.y - cy
        const dist = Math.sqrt(dx * dx + dy * dy) || 1
        const spd = 2 + Math.random() * 3
        return { ...g, vx: (dx / dist) * spd + (Math.random() - 0.5), vy: (dy / dist) * spd - Math.random() }
      })

      function step() {
        frame++
        const t = Math.min(frame / ZOOM_FRAMES, 1)
        const e = 1 - Math.pow(1 - t, 2)
        const currentR = prevR + (grainR - prevR) * e
        scattered = scattered.map(g => ({ ...g, x: g.x + g.vx, y: g.y + g.vy, vy: g.vy + 0.1, alpha: Math.max(0, g.alpha - 0.045) }))
        const zoomedKeepers = keepers.map(g => ({ ...g, r: currentR }))
        ctx!.clearRect(0, 0, W, H)
        zoomedKeepers.forEach(g => { if (!g.isMine) drawDiamond(ctx!, g.x, g.y, g.r, g.alpha, false) })
        scattered.forEach(g => { if (g.alpha > 0) drawDiamond(ctx!, g.x, g.y, g.r, g.alpha, false) })
        zoomedKeepers.forEach(g => { if (g.isMine) drawDiamond(ctx!, g.x, g.y, g.r, g.alpha, true) })
        if (goalY !== undefined && goalY > 0 && goalY < H) {
          ctx!.setLineDash([4, 4]); ctx!.strokeStyle = 'rgba(90,95,88,0.28)'; ctx!.lineWidth = 1
          ctx!.beginPath(); ctx!.moveTo(0, goalY); ctx!.lineTo(W, goalY); ctx!.stroke(); ctx!.setLineDash([])
        }
        const anyVisible = scattered.some(g => g.alpha > 0)
        if (t < 1 || anyVisible) {
          rafRef.current = requestAnimationFrame(step)
        } else {
          startBob(keepers.map(g => ({ ...g, r: grainR })))
        }
      }
      rafRef.current = requestAnimationFrame(step)
      return
    }

    // Default: just bob
    startBob(layout)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [count, scope, goal])

  return (
    <canvas
      ref={canvasRef}
      className="absolute bottom-0 left-0 w-full h-full block"
      style={{ zIndex: 1 }}
    />
  )
}
