import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import type { UseNavigateResult } from '@tanstack/react-router'
import { EmptyContext } from '@/components/providers/empty-provider'
import { boredMessages, rejectedMessages } from '@/utils/messages'
import { DONT_LEAVE_PATH } from '@/utils/paths'
import { decrypt, encrypt } from '@/utils'

export const timeoutModifier = 1

interface EmptyState {
  ignoreCount: number
  foundPages: string[]
  highScores: Record<string, number>
}

export function useEmptyProvider({
  navigate,
}: {
  navigate: UseNavigateResult<string>
}) {
  const [showEmpty, setShowEmpty] = useState<boolean>(false)
  const [lastActivity, setLastActivity] = useState<Date>(() => {
    const localTime = localStorage.getItem('last-activity')
    return localTime ? new Date(JSON.parse(localTime)) : new Date()
  })

  const [pokes, setPokes] = useState<number>(0)

  const [interfereAllowed, setInterfereAllowed] = useState<boolean>(true)
  const [ignoreCount, setIgnoreCount] = useState<number>(() => {
    const localEmpty = localStorage.getItem('empty')
    if (localEmpty) {
      const state = JSON.parse(decrypt(localEmpty)) as EmptyState
      return state.ignoreCount
    }
    return 0
  })

  const [foundPages, setFoundPages] = useState<string[]>(() => {
    const localEmpty = localStorage.getItem('empty')
    if (localEmpty) {
      const state = JSON.parse(decrypt(localEmpty)) as EmptyState
      return state.foundPages
    }
    return []
  })

  const [highScores, setHighScores] = useState<Record<string, number>>(() => {
    const localEmpty = localStorage.getItem('empty')
    if (localEmpty) {
      const state = JSON.parse(decrypt(localEmpty)) as EmptyState
      return state.highScores
    }
    return {}
  })

  const [startTime] = useState<Date>(new Date())

  const updateLocal = (activity: Date) => {
    localStorage.setItem('last-activity', JSON.stringify(activity))
  }

  useEffect(() => {
    localStorage.setItem(
      'empty',
      encrypt(JSON.stringify({ ignoreCount, foundPages, highScores })),
    )
  }, [ignoreCount, foundPages, highScores])

  const findPage = useCallback(
    (id: string) => {
      setFoundPages((found) =>
        found.some((f) => f == id) ? found : [...found, id],
      )
    },
    [setFoundPages],
  )

  const updateActivity = useCallback(() => {
    const now = new Date()
    setLastActivity(now)
    updateLocal(now)
  }, [setLastActivity])

  useEffect(() => {
    const now = new Date()
    const startDiff = now.valueOf() - startTime.valueOf()
    if (startDiff > 10 * 60 * 1000 * timeoutModifier) {
      setShowEmpty(true)

      setTimeout(
        () => {
          setShowEmpty(false)
        },
        5 * 1000 * timeoutModifier,
      )
    }
    const timeout = setTimeout(
      () => setPokes((p) => p + 1),
      2 * 60 * 1000 * timeoutModifier,
    )
    return () => clearTimeout(timeout)
  }, [startTime, setShowEmpty, pokes])

  useEffect(() => {
    const startDiff = startTime.valueOf() - lastActivity.valueOf()
    if (startDiff > 20 * 60 * 1000 * timeoutModifier) {
      navigate({ to: '/' + DONT_LEAVE_PATH })
    }
  }, [])

  const riceMessage = useMemo(
    () =>
      // ignoreCount == 15
      //   ? 'What did you do?'
      showEmpty
        ? boredMessages[Math.floor(Math.random() * boredMessages.length)]
        : undefined,
    [ignoreCount, showEmpty],
  )

  const toggleInterference = useCallback(
    (b: boolean) => {
      if (b) {
        setInterfereAllowed(true)
      } else {
        setTimeout(
          () => {
            setInterfereAllowed(true)
            const rejectedIdx = Math.min(
              ignoreCount,
              rejectedMessages.length - 1,
            )
            if (rejectedMessages[rejectedIdx].title) {
              toast.message(rejectedMessages[rejectedIdx].title, {
                description: rejectedMessages[rejectedIdx].desc,
              })
            } else {
              toast.info(`Notifications restored`, {
                description: rejectedMessages[rejectedIdx].desc,
              })
            }
          },
          60 *
            1000 *
            timeoutModifier *
            (10 - Math.min(ignoreCount, 10) + Math.ceil(Math.random() * 5)),
        )
      }
      setIgnoreCount((i) => i + 1)
      setInterfereAllowed(false)
    },
    [setInterfereAllowed, ignoreCount],
  )

  const getHighScore = useCallback(
    (id: string) => {
      const prevScore = highScores[id]
      return prevScore ? prevScore : 0
    },
    [highScores],
  )

  const updateHighScore = useCallback(
    (id: string, score: number, min?: boolean) => {
      if (
        highScores[id] == undefined ||
        (min ? highScores[id] > score : highScores[id] < score)
      ) {
        const newScores = { ...highScores }
        newScores[id] = score
        setHighScores(newScores)
      }
    },
    [highScores],
  )

  const title = useMemo(
    () => (showEmpty ? 'Empty Games' : 'Cube Games'),
    [showEmpty],
  )

  return {
    title,
    showEmpty,
    lastActivity,
    updateActivity,
    getHighScore,
    updateHighScore,
    riceMessage,
    interfereAllowed,
    setInterfereAllowed: toggleInterference,
    ignoreCount,
    foundPages,
    findPage,
  }
}

export default function useEmptyContext() {
  return useContext(EmptyContext)
}
