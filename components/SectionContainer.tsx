import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function SectionContainer({ children }: Props) {
  return <div className="mx-auto max-w-xl px-3 sm:px-3 xl:px-0">{children}</div>
}
