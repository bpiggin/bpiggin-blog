import Link from '@/components/Link'
import React, { FC, useState } from 'react'

interface IProps {
  rule: number
  setRule: (rule: number) => void
}

export const ControlPanel: FC<IProps> = ({ rule, setRule }) => {
  const [value, setValue] = useState(rule.toString())
  const [minimised, setMinimised] = useState(false)
  return minimised ? (
    <button
      className="absolute rounded-sm bg-slate-600 px-2 py-0.5 font-sans text-sm text-white"
      onClick={() => setMinimised(false)}
    >
      Open panel
    </button>
  ) : (
    <div className="absolute bg-white p-3 text-black">
      <p className="mb-2">
        Cellular Automata Explorer{' '}
        <Link href="https://mathworld.wolfram.com/ElementaryCellularAutomaton.html">ⓘ</Link>
      </p>
      <div className="row mb-2 flex">
        <p>Rule (1-256):</p>
        <input
          type="number"
          min="1"
          max="256"
          className="ml-2 -mt-0.5 h-7"
          value={value}
          onChange={(e) => e.target.value.length < 4 && setValue(e.target.value)}
        />
        <button
          className="-mt-0.5 ml-1 h-7 rounded-sm bg-slate-600 px-2 text-white"
          onClick={() => {
            setRule(Number(value))
          }}
        >
          →
        </button>
      </div>
      <button
        onClick={() => setMinimised(true)}
        className="self-end rounded-sm bg-slate-600 px-2 font-sans text-sm text-white"
      >
        Close panel
      </button>
    </div>
  )
}
