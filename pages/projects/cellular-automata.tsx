import { ControlPanel } from '@/components/projects/cellular-automata/ControlPanel'
import { PageSEO } from '@/components/SEO'
import React, { useRef, useEffect, useState } from 'react'

const getInitialState = (cols: number) => {
  const arr = new Array(cols).fill(0)
  arr[Math.round(arr.length / 2)] = 1
  return arr
}

const generateNextRow = (prevRow: number[], rule: number): number[] => {
  const ruleArray = rule.toString(2).padStart(8, '0').split('').map(Number).reverse()
  return prevRow.map((_, i) => {
    if (i === 0 || i === prevRow.length - 1) {
      return 0
    }
    const key = `${prevRow[i - 1]}${prevRow[i]}${prevRow[i + 1]}`
    const index = parseInt(key, 2)
    return ruleArray[index]
  })
}
let currentRow = null

export default function RuleThirty() {
  const canvasRef = useRef(null)
  const requestIdRef = useRef(null)
  const canvasCtx = useRef(null)
  const currentRowIndex = useRef(0)
  const [rule, setRule] = useState(30)

  const renderFrames = (frames: number) => {
    for (let i = 0; i < frames; i++) {
      const resolution = 1
      const cols = window.innerWidth + 500
      currentRow = currentRow ? generateNextRow(currentRow, rule) : getInitialState(cols)
      for (let col = 0; col < currentRow.length; col++) {
        const cell = currentRow[col]
        if (!cell) {
          continue
        }
        canvasCtx.current.beginPath()
        canvasCtx.current.rect(
          col * resolution,
          currentRowIndex.current * resolution,
          resolution,
          resolution
        )
        canvasCtx.current.fillStyle = '#000000'
        canvasCtx.current.fill()
      }
      currentRowIndex.current = currentRowIndex.current + 1
    }
  }

  const tick = () => {
    if (!canvasRef.current) return
    renderFrames(5)
    requestIdRef.current = requestAnimationFrame(tick)
  }

  useEffect(() => {
    canvasCtx.current = canvasRef.current.getContext('2d')
    canvasRef.current.width = window.innerWidth + 500
    canvasRef.current.height = window.innerHeight
    requestIdRef.current = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(requestIdRef.current)
    }
  }, [])

  const reset = () => {
    cancelAnimationFrame(requestIdRef.current)
    currentRowIndex.current = 0
    currentRow = null
    canvasCtx.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    requestIdRef.current = requestAnimationFrame(tick)
  }

  useEffect(() => {
    reset()
  }, [rule])

  return (
    <div className="overflow-clip bg-white">
      <PageSEO
        title={`Cellular Automata Explorer`}
        description="Specify a rule number and see the corresponding Cellular Automaton"
      />
      <ControlPanel rule={rule} setRule={setRule} />
      <canvas style={{ marginLeft: -250 }} ref={canvasRef} />
    </div>
  )
}
