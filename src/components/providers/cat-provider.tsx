import { createContext } from 'react'
import { useCatSetup } from '@/hooks/use-cats'

interface CatContextType {
  isCatFound: (n: number) => boolean
  findCat: (n: number) => void
  catsRemaining: number
  reset: () => void
}

const CatContext = createContext<CatContextType>({
  isCatFound: (n: number) => {
    console.log(`is cat found: ${n}`)
    return false
  },
  findCat: (n: number) => console.log(`find cat: ${n}`),
  catsRemaining: -1,
  reset: () => console.log('reset'),
})

export default function CatProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const context = useCatSetup(2)

  return <CatContext.Provider value={context}>{children}</CatContext.Provider>
}

export { CatContext }
