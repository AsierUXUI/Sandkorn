'use client'

import { useEffect, useRef } from 'react'

interface GrainPileProps {
  count: number
  width?: number
  height?: number
}

function seededRand(seed: number) {
  let s = seed
  return function () {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

function buildGrains(count: number, W: number, H: number) {
  const rand = seededRand(42)
  const grains: { x: number; y: number; r: number; alpha: number }[] = []
  const baseY = H - 4
  const pileW = W * 0.7
  const pileX = W * 0.15

  for (let i = 0; i < count; i++) {
    const progress = i / count
    const layerH = Math.sqrt(progress) * H * 0.82
    const layerSpread = pileW * (1 - progress * 0.45)
    const x = pileX + layerSpread * 0.1 + rand() * layerSpread * 0.8
    const y = baseY - layerH * rand()
    const r = 2.5 + rand() * 2.8
    grains.push({ x, y, r, alpha: 0.45 + rand() * 0.40 })
  }
  return grains
}

export default function GrainPile({ count, width = 200, height = 140 }: GrainPileProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const dpr = window.devicePixelRatio || 1
    const W = canvas.offsetWidth || width
    const H = canvas.offsetHeight || height

    canvas.width = W * dpr
    canvas.height = H * dpr

    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.scale(dpr, dpr)

    const grains = buildGrains(count, W, H)

    ctx.clearRect(0, 0, W, H)
    // Shadow pass for depth
    for (const g of grains) {
      ctx.beginPath()
      ctx.arc(g.x + 0.8, g.y + 0.8, g.r * 1.1, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(120,90,30,${g.alpha * 0.25})`
      ctx.fill()
    }
    for (const g of grains) {
      ctx.beginPath()
      ctx.arc(g.x, g.y, g.r, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(192,164,100,${g.alpha})`
      ctx.fill()
    }
  }, [count, width, height])

  return (
    <canvas
      ref={canvasRef}
      className="absolute bottom-0 left-0 w-full h-full block"
      style={{ zIndex: 1 }}
    />
  )
}
