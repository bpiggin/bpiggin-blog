import Link from '@/components/Link'
import React, { FC, useState } from 'react'

interface IProps {
  rule: number
  setRule: (rule: number) => void
}

export const ControlPanel: FC<IProps> = ({ rule, setRule }) => {
  const [value, setValue] = useState(rule.toString())
  return (
    <div className="absolute bg-white p-3">
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
    </div>
  )
}
