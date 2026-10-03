import { createContext } from 'react'
import type { ReactNode } from 'react'
import type { UseNavigateResult } from '@tanstack/react-router'
import { useEmptyProvider } from '@/hooks/use-empty-context'

interface EmptyContextType {
  title: string
  setTitle: (s: string) => void
  lastActivity: Date
  updateActivity: () => void
  riceMessage?: string
  interfereAllowed: boolean
  setInterfereAllowed: (b: boolean) => void
  ignoreCount: number
  foundPages: string[]
  findPage: (id: string) => void
}

const EmptyContext = createContext<EmptyContextType>({
  title: '',
  setTitle: console.log,
  lastActivity: new Date(),
  updateActivity: () => console.log(new Date()),
  interfereAllowed: false,
  setInterfereAllowed: console.log,
  ignoreCount: 0,
  foundPages: [],
  findPage: console.log,
})

export default function EmptyProvider({
  navigate,
  children,
}: {
  navigate: UseNavigateResult<string>
  children: ReactNode
}) {
  return (
    <EmptyContext.Provider value={useEmptyProvider({ navigate })}>
      {children}
    </EmptyContext.Provider>
  )
}

export { EmptyContext }
