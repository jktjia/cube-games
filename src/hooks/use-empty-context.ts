import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import type { UseNavigateResult } from '@tanstack/react-router'
import { EmptyContext } from '@/components/providers/empty-provider'
import { boredMessages } from '@/utils/messages'
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
  const [title, setTitle] = useState<string>('Cube Games')
  const [lastActivity, setLastActivity] = useState<Date>(() => {
    const localTime = localStorage.getItem('last-activity')
    return localTime ? new Date(JSON.parse(localTime)) : new Date()
  })

  const [showMessage, setShowMessage] = useState<boolean>(false)
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
      setShowMessage(true)
      setTitle('Empty Games')

      setTimeout(
        () => {
          setShowMessage(false)
          setTitle('Cube Games')
        },
        5 * 1000 * timeoutModifier,
      )
    }
    const timeout = setTimeout(
      () => setPokes((p) => p + 1),
      2 * 60 * 1000 * timeoutModifier,
    )
    return () => clearTimeout(timeout)
  }, [startTime, setShowMessage, setTitle, pokes])

  useEffect(() => {
    const startDiff = startTime.valueOf() - lastActivity.valueOf()
    if (startDiff > 20 * 60 * 1000 * timeoutModifier) {
      navigate({ to: '/' + DONT_LEAVE_PATH })
    }
  }, [])

  const riceMessage = useMemo(
    () =>
      showMessage
        ? boredMessages[Math.floor(Math.random() * boredMessages.length)]
        : undefined,
    [showMessage],
  )

  const toggleInterference = useCallback(
    (b: boolean) => {
      if (b) {
        setInterfereAllowed(true)
      } else {
        setInterfereAllowed(false)
        setIgnoreCount((i) => i + 1)
        setTimeout(
          () => {
            setInterfereAllowed(true)
            toast.info('I lived, bitch', {
              description: "Thought you'd seen the last of me, didn't you?",
            })
          },
          60 *
            1000 *
            timeoutModifier *
            (10 - Math.min(ignoreCount, 10) + Math.ceil(Math.random() * 5)),
        )
      }
    },
    [setInterfereAllowed],
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

  return {
    title,
    setTitle,
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
