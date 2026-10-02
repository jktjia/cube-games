import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { CatContext } from '@/components/providers/cat-provider'
import { decrypt, encrypt } from '@/utils'

function makeFalseArr(count: number) {
  return new Array(count).fill(false)
}

function useCatSetup(count: number) {
  const [foundCats, setFoundCats] = useState<boolean[]>(() => {
    const localCats = localStorage.getItem('found-cats')
    if (localCats) {
      const parsed = JSON.parse(decrypt(localCats))
      if (parsed.length == count) {
        return parsed
      }
    }
    return makeFalseArr(count)
  })

  useEffect(() => {
    const strState = encrypt(JSON.stringify(foundCats))
    localStorage.setItem('found-cats', strState)
  }, [foundCats])

  const isCatFound = useCallback(
    (n: number) => {
      if (n < 0 || n >= foundCats.length) {
        return false
      }
      return foundCats[n]
    },
    [foundCats],
  )

  const findCat = useCallback(
    (n: number) => {
      if (n < 0 || n >= foundCats.length) {
        console.log(`Cat ${n} does not exist`)
      } else {
        const newFoundCats = [...foundCats]
        newFoundCats[n] = true
        setFoundCats(newFoundCats)
      }
    },
    [foundCats],
  )

  const catsRemaining = useMemo(
    () => foundCats.filter((cat) => !cat).length,
    [foundCats],
  )

  const reset = () => {
    setFoundCats(makeFalseArr(count))
  }

  return {
    isCatFound,
    findCat,
    catsRemaining,
    reset,
  }
}

function useCats() {
  return useContext(CatContext)
}

export { useCatSetup, useCats }
